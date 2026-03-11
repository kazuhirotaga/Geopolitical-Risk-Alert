import requests
from bs4 import BeautifulSoup
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
BASE_URL = "https://stats.paj.gr.jp/jp/pub/"
TARGET_URL = f"{BASE_URL}current_jp_n2.html"
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "energy")
OUTPUT_PATH = os.path.join(DATA_DIR, "petroleum_stocks.json")

def fetch_fuel_data():
    """石油連盟(PAJ)から在庫データを取得し、JSONを更新する"""
    logger.info("=" * 60)
    logger.info("燃料在庫データの収集を開始")
    logger.info("=" * 60)

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    try:
        # 直接最新レポートを試行
        response = requests.get(TARGET_URL, headers=headers, timeout=20)
        # もし同意ページへリダイレクトされる等の場合は、ここを調整する
        # (通常、直リンクは閲覧可能なことが多い)
        
        if response.status_code != 200:
            logger.error(f"データの取得に失敗しました (Status: {response.status_code})")
            return

        soup = BeautifulSoup(response.content, "html.parser")
        
        # 報告日の抽出 (例: 2026年03月01日 ～ 2026年03月07日)
        # タイトルや特定のテキストから日付を特定する
        # ここでは簡易的に、最新の週末日を特定するロジックを想定
        
        # テーブルの解析
        tables = soup.find_all("table")
        if not tables:
            logger.error("統計テーブルが見つかりません")
            return

        # 在庫データを探す
        # 石油連盟のテーブル構造は品目が1列目にあることが多い
        stock_data = {}
        
        # ターゲット品目
        targets = {
            "ガソリン": "gasoline",
            "ジェット燃料油": "jet_fuel",
            "粗ガソリン": "naphtha"
        }

        # 日付を取得 (h2 や タイトルから)
        # 例: <title>週報（2026年03月07日週）</title> のような形式を想定
        # または本文中の期間表示
        date_str = datetime.utcnow().strftime("%Y-%m-%d") # デフォルト
        
        page_text = soup.get_text()
        # 簡易的な日付抽出 (YYYY年MM月DD日)
        import re
        date_matches = re.findall(r"(\d{4})年(\d{2})月(\d{2})日", page_text)
        if date_matches:
            # 期間の終了日（2番目以降の出現）を取得することが多い
            last_date = date_matches[-1]
            date_str = f"{last_date[0]}-{last_date[1]}-{last_date[2]}"

        for table in tables:
            rows = table.find_all("tr")
            for row in rows:
                cols = row.find_all(["td", "th"])
                if len(cols) < 2: continue
                
                label = cols[0].get_text(strip=True)
                for target_label, key in targets.items():
                    if target_label in label:
                        # 数値列を探す（通常、 kl 単位の列）
                        try:
                            # カンマを除去して数値化
                            val_text = cols[1].get_text(strip=True).replace(",", "")
                            stock_data[key] = int(val_text)
                        except (ValueError, IndexError):
                            continue

        if len(stock_data) < 3:
            logger.warning("一部のデータが取得できませんでした")
            # 取得できた分だけでも処理を続けるか検討
            if not stock_data: return

        # 既存データの読み込みと更新
        os.makedirs(DATA_DIR, exist_ok=True)
        current_json = {"unit": "kl", "source": "PAJ", "last_updated": "", "data": []}
        
        if os.path.exists(OUTPUT_PATH):
            with open(OUTPUT_PATH, "r", encoding="utf-8") as f:
                current_json = json.load(f)

        # 重複チェック (同じ日付なら更新、なければ追加)
        new_entry = {
            "date": date_str,
            "gasoline": stock_data.get("gasoline", 0),
            "jet_fuel": stock_data.get("jet_fuel", 0),
            "naphtha": stock_data.get("naphtha", 0)
        }

        # 既存のリストから同じ日付を探す
        found = False
        for i, entry in enumerate(current_json["data"]):
            if entry["date"] == date_str:
                current_json["data"][i] = new_entry
                found = True
                break
        
        if not found:
            current_json["data"].append(new_entry)
            # 日付順にソート
            current_json["data"].sort(key=lambda x: x["date"])

        current_json["last_updated"] = datetime.utcnow().isoformat() + "Z"

        # 保存
        with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
            json.dump(current_json, f, ensure_ascii=False, indent=2)

        logger.info(f"保存完了: {OUTPUT_PATH}")
        logger.info(f"取得データ: {new_entry}")
        logger.info("=" * 60)

    except Exception as e:
        logger.error(f"エラーが発生しました: {e}")

if __name__ == "__main__":
    fetch_fuel_data()
