"""
地政学リスク情報収集スクリプト
RSSフィードおよび公的機関からニュースを自動収集する
"""

import argparse
import feedparser
import requests
import json
import os
import hashlib
import logging
from datetime import datetime, timedelta
from dateutil import parser as date_parser
from bs4 import BeautifulSoup
from config import (
    DATA_SOURCES, FINANCIAL_DATA_SOURCES, STATEMENTS_DATA_SOURCES,
    GEOPOLITICAL_KEYWORDS, FINANCIAL_KEYWORDS, STATEMENTS_KEYWORDS,
    REGIONS
)

# ログ設定
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

# 定数
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
MAX_AGE_HOURS = 168  # 1週間以内のニュースのみ収集

def get_config(news_type: str):
    if news_type == 'financial':
        return {
            'sources': FINANCIAL_DATA_SOURCES,
            'keywords': FINANCIAL_KEYWORDS,
            'output_path': os.path.join(DATA_DIR, "raw_financial_news.json"),
            'log_prefix': "金融リスク"
        }
    elif news_type == 'statements':
        return {
            'sources': STATEMENTS_DATA_SOURCES,
            'keywords': [],  # 要人発言ソースは既に特定されているため、フィルタリングをスキップ
            'output_path': os.path.join(DATA_DIR, "raw_statements_news.json"),
            'log_prefix': "要人発言"
        }
    else:
        return {
            'sources': DATA_SOURCES,
            'keywords': GEOPOLITICAL_KEYWORDS,
            'output_path': os.path.join(DATA_DIR, "raw_news.json"),
            'log_prefix': "地政学リスク"
        }

def generate_id(title: str, url: str) -> str:
    """記事のユニークIDを生成"""
    content = f"{title}:{url}"
    return hashlib.md5(content.encode("utf-8")).hexdigest()[:12]

def is_relevant(title: str, summary: str, keywords: list) -> bool:
    """指定されたキーワードに関連するニュースかどうかを判定"""
    text = (title + " " + summary).lower()
    return any(kw.lower() in text for kw in keywords)

def detect_regions(title: str, summary: str) -> list:
    """ニュースに関連する地域を推定"""
    text = (title + " " + summary).lower()
    detected = []
    for region_id, region_info in REGIONS.items():
        for keyword in region_info["keywords"]:
            if keyword.lower() in text:
                detected.append(region_id)
                break
    return detected if detected else ["global"]

def parse_date(date_str: str) -> str:
    """日付文字列をISO形式に変換"""
    try:
        dt = date_parser.parse(date_str)
        return dt.isoformat()
    except (ValueError, TypeError):
        return datetime.utcnow().isoformat()


def is_recent(date_str: str) -> bool:
    """記事が最近のものかどうかをチェック"""
    try:
        dt = date_parser.parse(date_str)
        if dt.tzinfo:
            dt = dt.replace(tzinfo=None)
        cutoff = datetime.utcnow() - timedelta(hours=MAX_AGE_HOURS)
        return dt >= cutoff
    except (ValueError, TypeError):
        return True  # 日付が不明な場合は含める


def fetch_rss_feed(source: dict, keywords: list) -> list:
    """RSSフィードからニュースを取得"""
    articles = []
    try:
        logger.info(f"収集中: {source['name']} ({source['url']})")
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        response = requests.get(source["url"], headers=headers, timeout=15)
        feed = feedparser.parse(response.content)

        for entry in feed.entries:
            title = entry.get("title", "")
            summary = entry.get("summary", entry.get("description", ""))
            link = entry.get("link", "")
            published = entry.get("published", entry.get("updated", ""))

            # HTMLタグを除去
            if summary:
                soup = BeautifulSoup(summary, "html.parser")
                summary = soup.get_text(strip=True)

            # キーワードフィルタリング（キーワードリストが空でない場合のみ実行）
            if keywords and not is_relevant(title, summary, keywords):
                continue

            # 日付チェック
            if published and not is_recent(published):
                continue

            article = {
                "id": generate_id(title, link),
                "title": title,
                "summary": summary[:500],  # 500文字に制限
                "url": link,
                "published": parse_date(published) if published else datetime.utcnow().isoformat(),
                "source_name": source["name"],
                "source_type": source["type"],
                "language": source["language"],
                "regions": detect_regions(title, summary),
            }
            articles.append(article)

        logger.info(f"  → {len(articles)}件の関連記事を取得")

    except requests.exceptions.RequestException as e:
        logger.warning(f"  → 取得失敗: {source['name']}: {e}")
    except Exception as e:
        logger.error(f"  → エラー: {source['name']}: {e}")

    return articles


def deduplicate(articles: list) -> list:
    """記事の重複を排除"""
    seen_ids = set()
    unique = []
    for article in articles:
        if article["id"] not in seen_ids:
            seen_ids.add(article["id"])
            unique.append(article)
    return unique


def load_existing_news(file_path: str) -> list:
    """既存の収集データを読み込む"""
    if os.path.exists(file_path):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return []
    return []


def save_news(articles: list, file_path: str):
    """収集データを保存"""
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(articles, f, ensure_ascii=False, indent=2)
    logger.info(f"保存完了: {file_path} ({len(articles)}件)")


def collect_all(news_type: str = 'geopolitical'):
    """全ソースからニュースを収集"""
    config = get_config(news_type)
    
    logger.info("=" * 60)
    logger.info(f"{config['log_prefix']}情報の収集を開始")
    logger.info(f"対象ソース数: {len(config['sources'])}")
    logger.info("=" * 60)

    all_articles = []

    for source in config['sources']:
        articles = fetch_rss_feed(source, config['keywords'])
        all_articles.extend(articles)

    # 重複排除
    unique_articles = deduplicate(all_articles)

    # 日付でソート（新しい順）
    unique_articles.sort(key=lambda x: x.get("published", ""), reverse=True)

    logger.info("=" * 60)
    logger.info(f"収集完了: 合計 {len(unique_articles)} 件（重複排除後）")

    # ソース種別ごとの統計
    type_counts = {}
    for a in unique_articles:
        st = a.get("source_type", "unknown")
        type_counts[st] = type_counts.get(st, 0) + 1
    for st, count in type_counts.items():
        logger.info(f"  {st}: {count}件")

    logger.info("=" * 60)

    # 保存
    save_news(unique_articles, config['output_path'])
    return unique_articles


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="ニュース収集スクリプト")
    parser.add_argument("--type", choices=['geopolitical', 'financial', 'statements'], default='geopolitical', help="収集するニュースの種別")
    args = parser.parse_args()
    
    collect_all(args.type)
