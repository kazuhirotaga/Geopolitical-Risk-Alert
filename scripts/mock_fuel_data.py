import json
import os
from datetime import datetime, timedelta

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "energy")
OUTPUT_PATH = os.path.join(DATA_DIR, "petroleum_stocks.json")

def generate_mock_data():
    base_data = [
        {"date": "2026-03-14", "gasoline": 1600000, "jet_fuel": 710000, "naphtha": 1800000},
        {"date": "2026-03-21", "gasoline": 1580000, "jet_fuel": 690000, "naphtha": 1820000},
        {"date": "2026-03-28", "gasoline": 1620000, "jet_fuel": 705000, "naphtha": 1780000},
        {"date": "2026-04-04", "gasoline": 1550000, "jet_fuel": 680000, "naphtha": 1850000},
        {"date": "2026-04-11", "gasoline": 1500000, "jet_fuel": 670000, "naphtha": 1900000},
        {"date": "2026-04-18", "gasoline": 1480000, "jet_fuel": 660000, "naphtha": 1920000},
        {"date": "2026-04-25", "gasoline": 1520000, "jet_fuel": 680000, "naphtha": 1880000},
        {"date": "2026-05-02", "gasoline": 1510000, "jet_fuel": 675000, "naphtha": 1870000},
    ]

    current_json = {"unit": "kl", "source": "Petroleum Association of Japan (PAJ) [MOCK]", "last_updated": "", "data": []}
    
    if os.path.exists(OUTPUT_PATH):
        with open(OUTPUT_PATH, "r", encoding="utf-8") as f:
            current_json = json.load(f)
            
    # Remove old items if we want, or just append
    for entry in base_data:
        found = False
        for i, existing in enumerate(current_json["data"]):
            if existing["date"] == entry["date"]:
                current_json["data"][i] = entry
                found = True
                break
        if not found:
            current_json["data"].append(entry)

    current_json["data"].sort(key=lambda x: x["date"])
    current_json["last_updated"] = datetime.utcnow().isoformat() + "Z"

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(current_json, f, ensure_ascii=False, indent=2)
        
    print(f"Mock data generated at {OUTPUT_PATH}")

if __name__ == "__main__":
    generate_mock_data()
