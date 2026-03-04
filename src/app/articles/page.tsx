import { getIndex, RISK_LABELS, REGION_NAMES } from '@/lib/data';

export const metadata = {
    title: '記事一覧 | GeoRisk Alert',
    description: '地政学リスク分析記事の一覧。日付別のリスクレポートを閲覧できます。',
};

export default function ArticlesPage() {
    const index = getIndex();

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">📋 リスク分析記事一覧</h1>
                <p className="page-description">
                    AIエージェントが毎日自動生成する地政学リスク分析レポートの一覧です
                </p>
            </div>

            {index.length === 0 ? (
                <div className="summary-card">
                    <p className="summary-text">
                        まだ記事がありません。GitHub Actionsの初回実行後に記事が表示されます。
                    </p>
                </div>
            ) : (
                <div className="article-grid">
                    {index.map((entry) => (
                        <a
                            key={entry.date}
                            href={`/articles/${entry.date}`}
                            className="article-card"
                        >
                            <div className="article-header">
                                <div>
                                    <h3 className="article-title">
                                        {entry.date} のリスクレポート
                                    </h3>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                        {entry.article_count}件の分析記事
                                    </div>
                                </div>
                                <span className={`risk-badge ${entry.overall_risk_level}`}>
                                    <span className="dot"></span>
                                    {RISK_LABELS[entry.overall_risk_level]?.label_ja || '不明'}
                                </span>
                            </div>
                            <p className="article-summary">{entry.summary}</p>

                            {entry.region_risk_map && (
                                <div className="article-entities" style={{ marginTop: '12px' }}>
                                    {Object.entries(entry.region_risk_map)
                                        .filter(([, level]) => level !== 'none' && level !== 'low')
                                        .map(([regionId, riskLevel]) => {
                                            const region = REGION_NAMES[regionId];
                                            if (!region) return null;
                                            return (
                                                <span
                                                    key={regionId}
                                                    className={`risk-badge ${riskLevel}`}
                                                    style={{ fontSize: '0.65rem' }}
                                                >
                                                    <span className="dot"></span>
                                                    {region.emoji} {region.name}
                                                </span>
                                            );
                                        })}
                                </div>
                            )}
                        </a>
                    ))}
                </div>
            )}
        </>
    );
}
