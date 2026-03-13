@echo off
echo ==========================================
echo Geopolitical Risk Data - 一括更新スクリプト
echo ==========================================

set PYTHONPATH=%PYTHONPATH%;scripts

echo [1/6] 地政学ニュースを収集...
python scripts/collector.py --type geopolitical
echo [2/6] 地政学レポートを生成...
python scripts/ai_writer.py --type geopolitical

echo [3/6] 金融ニュースを収集...
python scripts/collector.py --type financial
echo [4/6] 金融レポートを生成...
python scripts/ai_writer.py --type financial

echo [5/6] 重要発言を収集・抽出...
python scripts/collector.py --type statements
python scripts/ai_writer.py --type statements

echo [6/7] 戦闘log・マーケット・燃料データを更新...
python scripts/combat_log_collector.py
python scripts/market_data_collector.py
python scripts/fuel_data_collector.py

echo [7/7] パニック状況を分析 (Gemini 2.5)...
python scripts/panic_collector.py

echo ==========================================
echo すべての更新が完了しました。
echo ==========================================
pause
