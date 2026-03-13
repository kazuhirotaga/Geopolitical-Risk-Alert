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
    model = genai.GenerativeModel('gemini-2.0-flash')

    # ニュースデータをテキスト化
    news_text = ""
    for i, a in enumerate(articles[:30]):  # 対象件数を少し増やす
        news_text += f"[{i+1}] {a['title']}\nSource: {a['source_name']}\nSummary: {a['summary']}\nURL: {a['url']}\n\n"

    prompt = COMBAT_LOG_ANALYSIS_PROMPT.format(news_data=news_text)

    try:
        response = model.generate_content(prompt)
        # JSON部分を抽出
        content = response.text.strip()
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
        articles = fetch_rss_feed(source, [])
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

    # 現在の日付を設定（レポート内が古い場合の上書き）
    report["date"] = datetime.now().strftime("%Y-%m-%d")

    # 3. 保存
    os.makedirs(DATA_DIR, exist_ok=True)
    
    # 既存ログとの統合
    existing_data = []
    if os.path.exists(OUTPUT_PATH):
        try:
            with open(OUTPUT_PATH, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
        except:
            existing_data = []

    # 既存のイベントIDを収集（重複排除用）
    seen_ids = set()
    for day_entry in existing_data:
        for ev in day_entry.get("events", []):
            seen_ids.add(ev.get("id"))
    
    # 新しいイベントのみを抽出
    incoming_events = report.get("events", [])
    new_events = [e for e in incoming_events if e.get("id") not in seen_ids]
    
    # 同一日のデータが既にあるかチェック
    today_str = report["date"]
    day_entry = next((item for item in existing_data if item["date"] == today_str), None)

    if day_entry:
        # 同一日のエントリがある場合：サマリーを更新し、新しいイベントを追加
        day_entry["summary"] = report["summary"]
        if new_events:
            day_entry["events"].extend(new_events)
            # 時系列順（新しい順）にソート
            day_entry["events"].sort(key=lambda x: x.get("timestamp", ""), reverse=True)
            logger.info(f"{today_str} のエントリに {len(new_events)} 件の新しいイベントを追加しました")
        else:
            logger.info(f"{today_str} のサマリーを更新しました（新規イベントなし）")
    else:
        # 新しい日のエントリの場合：先頭に追加
        report["events"] = incoming_events # 最初は全件入れる
        existing_data.insert(0, report)
        logger.info(f"{today_str} の新規レポートを追加しました ({len(incoming_events)} 件のイベント)")

    # 最大30日分保持
    existing_data = existing_data[:30]

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(existing_data, f, ensure_ascii=False, indent=2)
    
    logger.info(f"保存完了: {OUTPUT_PATH}")

    logger.info("=" * 60)

if __name__ == "__main__":
    collect_combat_logs()
