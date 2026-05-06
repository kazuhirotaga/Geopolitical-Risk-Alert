import fs from 'fs';
import path from 'path';
import ProcurementClient from './ProcurementClient';

export const metadata = {
  title: "世界各国の代替調達ルート監視 | GeoRisk Alert",
  description: "AIエージェントが分析する、世界のエネルギー・石油代替調達の現状とサプライチェーンのシフト",
};

export default function AlternativeProcurementPage() {
  // データの読み込み
  const dataPath = path.join(process.cwd(), 'data', 'energy', 'procurement_data.json');
  let procurementData = null;
  
  try {
    const fileContents = fs.readFileSync(dataPath, 'utf8');
    procurementData = JSON.parse(fileContents);
  } catch (error) {
    console.error("Failed to read procurement data:", error);
  }

  return (
    <div className="fade-in">
      {procurementData ? (
        <ProcurementClient data={procurementData} />
      ) : (
        <div className="hero-section">
          <h1 className="hero-title">データ読み込みエラー</h1>
          <p className="hero-subtitle">代替調達データを読み込めませんでした。</p>
        </div>
      )}
    </div>
  );
}
