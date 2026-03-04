"""
AI執筆スクリプト
収集したニュースデータをGemini APIで分析し、地政学リスクレポートを生成する
"""

import google.generativeai as genai
import json
import os
import logging
from datetime import datetime
from config import ANALYSIS_PROMPT, RISK_LEVELS, REGIONS

# ログ設定
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

# 定数
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
RAW_NEWS_PATH = os.path.join(DATA_DIR, "raw_news.json")
ARTICLES_DIR = os.path.join(DATA_DIR, "articles")


def load_raw_news() -> list:
    """収集済みニュースデータを読み込む"""
    if not os.path.exists(RAW_NEWS_PATH):
        logger.error(f"ニュースデータが見つかりません: {RAW_NEWS_PATH}")
        logger.error("先に collector.py を実行してください")
        return []

    with open(RAW_NEWS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def format_news_for_prompt(news_items: list) -> str:
    """ニュースデータをプロンプト用にフォーマット"""
    formatted = []
    for i, item in enumerate(news_items[:50], 1):  # 最大50件
        source_type_label = {
            "media": "メディア",
            "government": "政府機関",
            "research": "研究機関",
            "international_org": "国際機関",
        }.get(item.get("source_type", ""), "不明")

        formatted.append(
            f"【記事{i}】\n"
            f"タイトル: {item['title']}\n"
            f"概要: {item.get('summary', 'なし')}\n"
            f"情報源: {item['source_name']} ({source_type_label})\n"
            f"日時: {item.get('published', '不明')}\n"
            f"関連地域: {', '.join(item.get('regions', ['不明']))}\n"
            f"URL: {item.get('url', '')}\n"
        )
    return "\n".join(formatted)


def generate_report(news_items: list) -> dict:
    """Gemini APIを使用してリスクレポートを生成"""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logger.error("GEMINI_API_KEY が設定されていません")
        logger.error("環境変数 GEMINI_API_KEY を設定してください")
        return None

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash")

    # ニュースデータをフォーマット
    news_text = format_news_for_prompt(news_items)
    prompt = ANALYSIS_PROMPT.format(news_data=news_text)

    logger.info("Gemini APIでリスク分析を実行中...")

    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.3,
                max_output_tokens=8192,
            ),
        )

        # レスポンスのパース
        response_text = response.text.strip()

        # ```json ``` タグを除去
        if response_text.startswith("```"):
            lines = response_text.split("\n")
            response_text = "\n".join(lines[1:])
        if response_text.endswith("```"):
            response_text = response_text[:-3].strip()

        report = json.loads(response_text)
        logger.info("リスクレポートの生成に成功しました")
        return report

    except json.JSONDecodeError as e:
        logger.error(f"APIレスポンスのJSON解析に失敗: {e}")
        logger.error(f"レスポンス: {response_text[:500]}")
        return None
    except Exception as e:
        logger.error(f"Gemini API呼び出しエラー: {e}")
        return None


def save_report(report: dict):
    """レポートをJSONファイルとして保存"""
    os.makedirs(ARTICLES_DIR, exist_ok=True)

    today = datetime.utcnow().strftime("%Y-%m-%d")
    report["date"] = today
    report["generated_at"] = datetime.utcnow().isoformat()
    report["risk_levels_meta"] = RISK_LEVELS
    report["regions_meta"] = {
        k: {"name": v["name"], "name_en": v["name_en"]}
        for k, v in REGIONS.items()
    }

    filepath = os.path.join(ARTICLES_DIR, f"{today}.json")
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    logger.info(f"レポート保存完了: {filepath}")

    # latest.json も更新
    latest_path = os.path.join(ARTICLES_DIR, "latest.json")
    with open(latest_path, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    logger.info(f"最新レポート更新: {latest_path}")

    # index.json を更新（記事一覧）
    update_index(today, report)

    return filepath


def update_index(date: str, report: dict):
    """記事一覧インデックスを更新"""
    index_path = os.path.join(ARTICLES_DIR, "index.json")

    # 既存インデックスの読み込み
    index = []
    if os.path.exists(index_path):
        try:
            with open(index_path, "r", encoding="utf-8") as f:
                index = json.load(f)
        except (json.JSONDecodeError, IOError):
            index = []

    # 既存の同一日付エントリを更新
    entry = {
        "date": date,
        "summary": report.get("summary", ""),
        "overall_risk_level": report.get("overall_risk_level", "low"),
        "article_count": len(report.get("articles", [])),
        "region_risk_map": report.get("region_risk_map", {}),
        "generated_at": report.get("generated_at", ""),
    }

    # 同一日付の既存エントリを削除
    index = [item for item in index if item.get("date") != date]
    index.insert(0, entry)

    # 最大90日分保持
    index = index[:90]

    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)

    logger.info(f"インデックス更新完了: {index_path}")


def main():
    """メイン処理"""
    logger.info("=" * 60)
    logger.info("AI執筆エージェント 起動")
    logger.info("=" * 60)

    # ニュースデータの読み込み
    news_items = load_raw_news()
    if not news_items:
        logger.warning("収集済みニュースがありません。処理を終了します。")
        return

    logger.info(f"入力ニュース数: {len(news_items)}")

    # レポート生成
    report = generate_report(news_items)
    if not report:
        logger.error("レポート生成に失敗しました")
        return

    # 保存
    save_report(report)

    logger.info("=" * 60)
    logger.info("AI執筆完了")
    logger.info(f"  記事数: {len(report.get('articles', []))}")
    logger.info(f"  全体リスクレベル: {report.get('overall_risk_level', 'N/A')}")
    logger.info("=" * 60)


if __name__ == "__main__":
    main()
