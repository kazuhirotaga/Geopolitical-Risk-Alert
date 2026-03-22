"""
物流モジュール：地政学リスク情報収集スクリプトの拡張
Google Alert/RSSフィードなどから物流・サプライチェーン関連のニュースを収集する
"""

import argparse
import os
import logging
from config import LOGISTICS_DATA_SOURCES, LOGISTICS_KEYWORDS
from collector import fetch_rss_feed, deduplicate, save_news

# ログ設定
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

# 定数
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
OUTPUT_PATH = os.path.join(DATA_DIR, "raw_logistics_news.json")

def collect_logistics_news():
    """物流関連ニュースを収集"""
    logger.info("=" * 60)
    logger.info("物流・サプライチェーン情報の収集を開始")
    logger.info(f"対象ソース数: {len(LOGISTICS_DATA_SOURCES)}")
    logger.info("=" * 60)

    all_articles = []

    for source in LOGISTICS_DATA_SOURCES:
        articles = fetch_rss_feed(source, LOGISTICS_KEYWORDS)
        all_articles.extend(articles)

    # 重複排除
    unique_articles = deduplicate(all_articles)

    # 日付でソート（新しい順）
    unique_articles.sort(key=lambda x: x.get("published", ""), reverse=True)

    logger.info("=" * 60)
    logger.info(f"収集完了: 合計 {len(unique_articles)} 件（重複排除後）")

    # 保存
    save_news(unique_articles, OUTPUT_PATH)
    return unique_articles


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="物流ニュース収集スクリプト")
    args = parser.parse_args()
    
    collect_logistics_news()
