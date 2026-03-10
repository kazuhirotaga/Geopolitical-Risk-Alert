import { getReportByDate, getIndex, REGION_NAMES, RISK_LABELS, SOURCE_TYPE_LABELS } from '@/lib/data';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ date: string }>;
}

export async function generateStaticParams() {
    const index = getIndex();
    return index.map((entry) => ({
        date: entry.date,
    }));
}

export default async function ArticleDatePage({ params }: PageProps) {
    const { date } = await params;
    const report = getReportByDate(date);

    if (!report) {
        notFound();
    }

    return (
        <>
            <div className="page-header">
                <a href="/articles" style={{ fontSize: '0.85rem', color: 'var(--accent-blue)' }}>
                    ← 記事一覧に戻る
                </a>
                <h1 className="page-title" style={{ marginTop: '12px' }}>
                    📊 {report.date} リスクレポート
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                    <span className={`risk-badge ${report.overall_risk_level}`}>
                        <span className="dot"></span>
                        総合: {RISK_LABELS[report.overall_risk_level]?.label_ja || '不明'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {report.articles.length}件の分析記事
                    </span>
                </div>
            </div>

            {/* Summary */}
            <section className="summary-card">
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px' }}>
                    本日の概況
                </h2>
                <p className="summary-text">{report.summary}</p>
            </section>

            {/* Region Risk Map */}
            {report.region_risk_map && (
                <section className="world-map-section">
                    <h2 className="section-title">
                        <span className="icon">🗺️</span>
                        地域別リスクレベル
                    </h2>
                    <div className="world-map-container">
                        <div className="world-map-grid">
                            {Object.entries(report.region_risk_map).map(([regionId, riskLevel]) => {
                                const region = REGION_NAMES[regionId];
                                if (!region) return null;
                                return (
                                    <div key={regionId} className={`region-card ${riskLevel}`}>
                                        <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{region.emoji}</div>
                                        <div className="region-name">{region.name}</div>
                                        <div className="region-name-en">{region.name_en}</div>
                                        <div style={{ marginTop: '8px' }}>
                                            <span className={`risk-badge ${riskLevel}`}>
                                                <span className="dot"></span>
                                                {RISK_LABELS[riskLevel as keyof typeof RISK_LABELS]?.label_ja || '情報なし'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Articles */}
            <section className="articles-section">
                <h2 className="section-title">
                    <span className="icon">📋</span>
                    詳細分析
                </h2>
                <div className="article-grid">
                    {report.articles.map((article, index) => {
                        const regionInfo = REGION_NAMES[article.region];
                        return (
                            <article key={index} className="article-card">
                                <div className="article-header">
                                    <h3 className="article-title">{article.title}</h3>
                                    <span className={`risk-badge ${article.risk_level}`}>
                                        <span className="dot"></span>
                                        {RISK_LABELS[article.risk_level]?.label_ja}
                                    </span>
                                </div>
                                <div className="article-meta">
                                    {regionInfo && (
                                        <span className="source-badge">
                                            {regionInfo.emoji} {regionInfo.name}
                                        </span>
                                    )}
                                    {article.source_types && [...new Set(article.source_types)].map((st, i) => (
                                        <span key={i} className={`source-badge ${st}`}>
                                            {SOURCE_TYPE_LABELS[st] || st}
                                        </span>
                                    ))}
                                </div>
                                <p className="article-summary">{article.summary}</p>
                                <div className="article-analysis">{article.analysis}</div>
                                {article.key_entities && article.key_entities.length > 0 && (
                                    <div className="article-entities">
                                        {article.key_entities.map((entity, i) => (
                                            <span key={i} className="entity-tag">{entity}</span>
                                        ))}
                                    </div>
                                )}
                                {article.sources && article.sources.length > 0 && (
                                    <div className="article-sources">
                                        {article.sources.map((src, i) => (
                                            <span key={i} className="source-badge">
                                                📰 {src}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            </section>
        </>
    );
}
