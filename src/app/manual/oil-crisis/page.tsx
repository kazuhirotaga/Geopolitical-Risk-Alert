import React from 'react';
import Link from 'next/link';

export const metadata = {
    title: '石油危機対策マニュアル | GeoRisk Alert',
    description: '地政学的リスクに伴う石油・燃料供給不安に対する、個人や企業の備え・対策マニュアル',
};

export default function OilCrisisManualPage() {
    return (
        <div className="manual-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
            <div className="hero-section" style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 className="hero-title" style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--risk-critical)' }}>石油危機対策マニュアル</h1>
                <p className="hero-subtitle">深刻な燃料供給不足や価格高騰に備えるための行動指針</p>
            </div>

            <div className="risk-card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--risk-high)', padding: '1.5rem', backgroundColor: 'rgba(255, 165, 0, 0.05)' }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--text-color)' }}>1. 現在の状況確認と冷静な行動</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                    パニック買い（買いだめ）は、一時的な在庫不足を深刻な供給危機に悪化させます。まずは冷静に現在の備蓄状況と供給見通しを確認してください。
                </p>
                <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                    <li>当サイトの<strong>「燃料在庫モニタリング」</strong>を確認し、マクロな在庫水準を把握する</li>
                    <li>SNS等での不確かな情報に惑わされず、政府や信頼できる報道機関の発表を確認する</li>
                    <li>「念のための給油」を控え、本当に必要な給油のみにとどめる</li>
                </ul>
                <div style={{ marginTop: '1.5rem' }}>
                    <Link href="/analysis/fuel-stocks"
                        style={{ display: 'inline-block', padding: '0.6rem 1.2rem', backgroundColor: 'var(--primary-color)', color: 'white', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                        燃料在庫モニタリングを確認する
                    </Link>
                </div>
            </div>

            <div className="risk-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--text-color)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>2. 個人・家庭での備え</h2>

                <h3 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.8rem' }}>移動・車両利用の最適化</h3>
                <ul style={{ listStyleType: 'circle', paddingLeft: '1.5rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                    <li><strong>急発進・急ブレーキを避ける：</strong> エコドライブの実践により、10%〜20%の燃費向上が見込めます</li>
                    <li><strong>相乗り（カープール）の推進：</strong> 家族や近隣住民と協力し、車両の利用回数を減らす</li>
                    <li><strong>公共交通機関・自転車の利用：</strong> 可能な移動は電車、バス、自転車、徒歩に切り替える</li>
                    <li><strong>タイヤの空気圧点検：</strong> 空気圧が適正でないと燃費が悪化します</li>
                </ul>

                <h3 style={{ fontSize: '1.2rem', marginTop: '1.5rem', marginBottom: '0.8rem' }}>家庭でのエネルギー節約</h3>
                <ul style={{ listStyleType: 'circle', paddingLeft: '1.5rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                    <li><strong>暖房の依存度を下げる：</strong> 灯油ヒーター等の使用時間を減らし、着込むなどの工夫をする</li>
                    <li><strong>設定温度の調整：</strong> エアコンの暖房は20℃、冷房は28℃を目安に設定する（電力不足対策）</li>
                    <li><strong>太陽光発電やポータブル電源の活用：</strong> 停電やエネルギー供給不安に備え、代替電力を確保する</li>
                </ul>
            </div>

            <div className="risk-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--text-color)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>3. 企業・事業者向けの対策</h2>
                <ul style={{ listStyleType: 'square', paddingLeft: '1.5rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                    <li><strong>BCP（事業継続計画）の発動・見直し：</strong> 燃料不足時の業務優先順位を明確化する</li>
                    <li><strong>リモートワークの最大化：</strong> 従業員の通勤を減らし、交通網の混雑とエネルギー消費を抑制する</li>
                    <li><strong>物流の効率化：</strong> 積載率の向上、配送ルートの最適化、共同配送の実施</li>
                    <li><strong>非常用電源の点検：</strong> 燃料が必要な自家発電設備の在庫確認と動作テストを実施</li>
                </ul>
            </div>

            <div className="risk-card" style={{ padding: '1.5rem', backgroundColor: 'rgba(255, 69, 58, 0.05)', borderLeft: '4px solid var(--risk-critical)' }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--text-color)' }}>4. 情報収集と関連リンク</h2>
                <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
                    正確な情報収集がパニックを防ぎます。以下の情報リソースもご活用ください。
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <a href="/analysis/logistics" style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '6px', textDecoration: 'none', color: 'var(--text-color)', display: 'block' }}>
                        <strong>🌍 海上物流モニタリング</strong><br />
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>タンカーやコンテナ船の運行状況を確認</span>
                    </a>
                    <a href="/analysis/combat-log" style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '6px', textDecoration: 'none', color: 'var(--text-color)', display: 'block' }}>
                        <strong>⚔️ 戦闘Log（中東情勢など）</strong><br />
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>産油国周辺での軍事衝突の最新情報</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
