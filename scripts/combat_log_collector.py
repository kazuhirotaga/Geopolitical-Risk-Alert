"""
戦闘log収集・分析スクリプト
軍事ニュースを収集し、Gemini APIを使用して具体的な戦闘イベントを抽出・要約する
"""

import os
import json
import logging
import argparse
from datetime import datetime
import google.generativeai as genai
from dotenv import load_dotenv

# .envファイルを読み込む（ローカル用）
load_dotenv()
from collector import fetch_rss_feed, deduplicate
from config import COMBAT_DATA_SOURCES, COMBAT_LOG_ANALYSIS_PROMPT

# ログ設定
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

# 定数
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "combat")
OUTPUT_PATH = os.path.join(DATA_DIR, "logs.json")

def analyze_combat_events(articles):
    """収集した記事からAIを使用して戦闘イベントを抽出する"""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logger.error("GEMINI_API_KEY が設定されていません")
        return None

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')

    # ニュースデータをテキスト化
    news_text = ""
    for i, a in enumerate(articles[:20]):  # 上位20件を対象
        news_text += f"[{i+1}] {a['title']}\nSource: {a['source_name']}\nSummary: {a['summary']}\nURL: {a['url']}\n\n"

    prompt = COMBAT_LOG_ANALYSIS_PROMPT.format(news_data=news_text)

    try:
        response = model.generate_content(prompt)
        # JSON部分を抽出
        content = response.text
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        
        return json.loads(content)
    except Exception as e:
        logger.error(f"AI分析中にエラーが発生しました: {e}")
        return None

def collect_combat_logs():
    """全プロセスを実行"""
    logger.info("=" * 60)
    logger.info("戦闘logの収集・分析を開始")
    logger.info("=" * 60)

    # 1. ニュース収集
    all_articles = []
    for source in COMBAT_DATA_SOURCES:
        articles = fetch_rss_feed(source, []) # キーワードフィルタはAI側に任せるため空
        all_articles.extend(articles)

    unique_articles = deduplicate(all_articles)
    logger.info(f"合計 {len(unique_articles)} 件の記事を収集しました")

    if not unique_articles:
        logger.warning("記事が収集できませんでした")
        return

    # 2. AIによるイベント抽出
    report = analyze_combat_events(unique_articles)
    if not report:
        logger.error("レポートの生成に失敗しました")
        return

    # 3. 保存
    os.makedirs(DATA_DIR, exist_ok=True)
    
    # 既存ログとの統合 (過去のログを保持しつつ更新)
    existing_data = []
    if os.path.exists(OUTPUT_PATH):
        try:
            with open(OUTPUT_PATH, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
        except:
            existing_data = []

    # 重複排除のためのIDリスト
    seen_ids = {e["id"] for entry in existing_data for e in entry.get("events", [])}
    
    # 新しいイベントのみを抽出
    new_events = [e for e in report["events"] if e["id"] not in seen_ids]
    
    if new_events:
        logger.info(f"{len(new_events)} 件の新しい戦闘イベントを特定しました")
        # レポートを日付ごとに保存する形式にする
        # 簡易的に、既存のリストの先頭に追加
        report["events"] = new_events # この回の新規分のみにするか、全部保持するか
        existing_data.insert(0, report)
        
        # 最大30日分（または適切な数）保持
        existing_data = existing_data[:30]

        with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
            json.dump(existing_data, f, ensure_ascii=False, indent=2)
        
        logger.info(f"保存完了: {OUTPUT_PATH}")
    else:
        logger.info("新しい戦闘イベントは見つかりませんでした")

    logger.info("=" * 60)

if __name__ == "__main__":
    collect_combat_logs()
