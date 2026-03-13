import os
import json
import logging
import google.generativeai as genai
from datetime import datetime
from dotenv import load_dotenv

# 自作モジュールのインポート
import sys
sys.path.append(os.path.dirname(__file__))
from collector import fetch_rss_feed, deduplicate
from config import PANIC_DATA_SOURCES, PANIC_ANALYSIS_PROMPT

# .env の読み込み
load_dotenv()

# ログ設定
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

# 出力パス設定
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "panic")
OUTPUT_PATH = os.path.join(DATA_DIR, "latest.json")

def analyze_panic_status(articles):
    """Gemini 2.5 Flash を使用してパニック状況を分析"""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logger.error("GEMINI_API_KEY が設定されていません")
        return None

    genai.configure(api_key=api_key)
    # ユーザー指定の Gemini 2.5 Flash を使用
    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
    except Exception as e:
        logger.warning(f"gemini-2.5-flash の初期化に失敗しました。2.0-flash にフォールバックします: {e}")
        model = genai.GenerativeModel('gemini-2.0-flash')

    # ニュースデータを管理可能な量に制限してテキスト化
    news_text = ""
    for i, a in enumerate(articles[:40]):
        news_text += f"[{i+1}] {a['title']}\nSource: {a['source_name']}\nSummary: {a['summary']}\n\n"

    prompt = PANIC_ANALYSIS_PROMPT.format(news_data=news_text)

    try:
        response = model.generate_content(prompt)
        content = response.text.strip()
        
        # JSON部分の抽出
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        
        return json.loads(content)
    except Exception as e:
        logger.error(f"AI分析中にエラーが発生しました: {e}")
        return None

def collect_panic_reports():
    """パニック状況の収集と分析を実行"""
    logger.info("=" * 60)
    logger.info("世界パニック状況の収集・分析を開始")
    logger.info("=" * 60)

    # 1. ニュース収集
    all_articles = []
    for source in PANIC_DATA_SOURCES:
        logger.info(f"情報源から取得中: {source['name']}")
        articles = fetch_rss_feed(source, [])
        all_articles.extend(articles)

    unique_articles = deduplicate(all_articles)
    logger.info(f"合計 {len(unique_articles)} 件の記事を収集しました")

    if not unique_articles:
        logger.warning("分析対象の記事が見つかりませんでした")
        return

    # 2. AI分析
    logger.info("Gemini 2.5 Flash によるパニック分析を実行中...")
    report = analyze_panic_status(unique_articles)
    
    if not report:
        logger.error("パニックレポートの生成に失敗しました")
        return

    # 日付の補正
    report["date"] = datetime.now().strftime("%Y-%m-%d")

    # 3. 保存
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    logger.info(f"パニックレポートを保存しました: {OUTPUT_PATH}")
    logger.info("=" * 60)

if __name__ == "__main__":
    collect_panic_reports()
