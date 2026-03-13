import { getLatestReport, getMarketData, REGION_NAMES, RISK_LABELS, SOURCE_TYPE_LABELS } from '@/lib/data';
export const dynamic = 'force-dynamic';

export const metadata = {
    title: "Financial Risk Alert | 金融リスク情報ダッシュボード",
    description: "AIエージェントが自動収集・分析する世界の金融リスク（市場、通貨、経済）情報ダッシュボード。",
};

export default function FinancialHome() {
    const report = getLatestReport('financial');
    const marketData = getMarketData();

    if (!report) {
        return (
            <div className="hero-section">
                <h1 className="hero-title">Financial Risk Alert</h1>
                <p className="hero-subtitle">データを読み込み中、または初回実行をお待ちください。</p>
            </div>
        );
    }

    // リスクレベル別の記事数を集計
    const riskCounts = { critical: 0, high: 0, medium: 0, low: 0 };
    report.articles.forEach((a) => {
        const level = a.risk_level as keyof typeof riskCounts;
        if (level in riskCounts) riskCounts[level]++;
    });

    return (
        <>
            {/* Hero Section */}
            <section className="hero-section fade-in">
                <h1 className="hero-title" style={{ background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Financial Risk Alert
                </h1>
                <p className="hero-subtitle">
                    AIエージェントが市場動向、中央銀行の政策、暗号資産規制などの
                    金融リスクを自動収集・分析するダッシュボード
                </p>
            </section>

            {/* Risk Level Stats */}
            <section className="risk-stats fade-in fade-in-delay-1">
                {(['critical', 'high', 'medium', 'low'] as const).map((level) => (
                    <div key={level} className={`risk-stat-card ${level}`}>
                        <div className="risk-stat-count">{riskCounts[level]}</div>
                        <div className="risk-stat-label">
                            {RISK_LABELS[level]?.label_ja || level}
                        </div>
                    </div>
                ))}
            </section>

            {/* Summary */}
            <section className="summary-card fade-in fade-in-delay-2" style={{ borderLeft: '4px solid #4facfe' }}>
                <div className="overall-risk">
                    <span className={`risk-badge ${report.overall_risk_level}`}>
                        <span className="dot"></span>
                        {RISK_LABELS[report.overall_risk_level]?.label_ja || '不明'}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {report.date} の金融市場総合リスク
                    </span>
                </div>
                <p className="summary-text">{report.summary}</p>
            </section>

            {/* 市場概況ウィジェット */}
            {marketData && marketData.indices && marketData.indices.length > 0 && (
                <section className="mb-12 mt-12 fade-in" style={{ backgroundColor: 'var(--card-bg)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid var(--border-color)' }}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span>📊</span> 市場概況 (Market Overview)
                        </h2>
                        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            更新日時: {new Date(marketData.generated_at).toLocaleString('ja-JP')}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {marketData.indices.map((index) => (
                            <div key={index.symbol} className="p-4 rounded-lg transition-colors" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-color)' }}>
                                <div className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{index.label}</div>
                                <div className="text-xl font-bold font-mono mb-2">{index.price_formatted}</div>
                                <div className={`flex items-center text-sm font-semibold ${index.trend === 'up' ? 'text-green-500' :
                                    index.trend === 'down' ? 'text-red-500' : 'text-gray-400'
                                    }`}>
                                    {index.trend === 'up' && <span className="mr-1">▲</span>}
                                    {index.trend === 'down' && <span className="mr-1">▼</span>}
                                    {index.trend === 'flat' && <span className="mr-1">▶</span>}
                                    {index.change_formatted} ({index.change_percent_formatted})
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Region/Category Risk Overview */}
            <section className="world-map-section fade-in fade-in-delay-3">
                <h2 className="section-title">
                    <span className="icon">📈</span>
                    市場・地域別リスク状況
                </h2>
                <div className="world-map-container">
                    <div className="world-map-grid">
                        {Object.entries(report.region_risk_map).map(([regionId, riskLevel]) => {
                            const region = REGION_NAMES[regionId] || { name: regionId, name_en: regionId, emoji: '📊' };
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

            {/* Latest Articles */}
            <section className="articles-section fade-in fade-in-delay-4">
                <h2 className="section-title">
                    <span className="icon">🔍</span>
                    最新の金融リスク分析
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
                                    {regionInfo ? (
                                        <span className="source-badge">
                                            {regionInfo.emoji} {regionInfo.name}
                                        </span>
                                    ) : (
                                        <span className="source-badge">📊 {article.region}</span>
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
