"""
主要な市場データを yfinance から取得し保存する
"""

import yfinance as yf
import json
import os
import logging
from datetime import datetime

# ログ設定
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

# 定数
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
OUTPUT_PATH = os.path.join(DATA_DIR, "financial", "market_data.json")

# 取得対象のティッカーシンボルとラベル
MARKET_SYMBOLS = {
    "^N225": "日経平均株価",
    "^DJI": "NYダウ",
    "^SPX": "S&P 500",
    "^VIX": "VIX指数 (恐怖指数)",
    "^TNX": "米10年国債利回り",
    "USDJPY=X": "ドル円相場",
    "BTC-USD": "ビットコイン (USD)",
    "GC=F": "金 (先物)",
    "CL=F": "原油 (WTI先物)",
}

def fetch_market_data():
    """市場データをyh from yfinance"""
    logger.info("=" * 60)
    logger.info("市場データの収集を開始")
    logger.info("=" * 60)

    market_data = {
        "generated_at": datetime.utcnow().isoformat(),
        "indices": []
    }

    # 各ティッカーについて直近数日のデータを取得
    # 週末や祝日を考慮して過去5日分を取得し、最新の2件（当日と前営業日）を比較する
    period = "5d"

    for symbol, label in MARKET_SYMBOLS.items():
        try:
            logger.info(f"取得中: {label} ({symbol})")
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=period)

            if len(hist) < 2:
                logger.warning(f"  → 十分なデータが取得できませんでした: {symbol}")
                continue

            # 最新の行（当日/現在の価格）
            current_row = hist.iloc[-1]
            current_price = float(current_row['Close'])

            # 1つ前の行（前営業日の価格）
            previous_row = hist.iloc[-2]
            previous_price = float(previous_row['Close'])

            # 変化額と変化率
            change = current_price - previous_price
            change_percent = (change / previous_price) * 100 if previous_price != 0 else 0

            # データの整形
            # 利回りや指数の場合は小数点以下の表示を調整
            if symbol in ["^VIX", "^TNX"]:
                price_fmt = f"{current_price:.2f}"
                change_fmt = f"{change:+.2f}"
            elif symbol == "USDJPY=X":
                price_fmt = f"{current_price:.2f}"
                change_fmt = f"{change:+.2f}"
            elif symbol == "BTC-USD":
                price_fmt = f"{current_price:,.0f}"
                change_fmt = f"{change:+,.0f}"
            else:
                price_fmt = f"{current_price:,.2f}"
                change_fmt = f"{change:+,.2f}"

            market_data["indices"].append({
                "symbol": symbol,
                "label": label,
                "current_price": current_price,
                "price_formatted": price_fmt,
                "change": change,
                "change_formatted": change_fmt,
                "change_percent": change_percent,
                "change_percent_formatted": f"{change_percent:+.2f}%",
                "trend": "up" if change > 0 else ("down" if change < 0 else "flat"),
                "date": str(hist.index[-1].date())
            })

            logger.info(f"  → 取得完了: {price_fmt} ({change_percent:+.2f}%)")

        except Exception as e:
            logger.error(f"  → 取得エラー {symbol}: {e}")

    # データを保存
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(market_data, f, ensure_ascii=False, indent=2)

    logger.info("=" * 60)
    logger.info(f"市場データの保存完了: {OUTPUT_PATH} ({len(market_data['indices'])}件)")
    logger.info("=" * 60)

if __name__ == "__main__":
    fetch_market_data()
