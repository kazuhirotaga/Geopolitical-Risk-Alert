import { getLatestReport, REGION_NAMES, RISK_LABELS, SOURCE_TYPE_LABELS } from '@/lib/data';
import VesselMap from '@/components/VesselMap';

export default function Home() {
  const report = getLatestReport();

  if (!report) {
    return (
      <div className="hero-section">
        <h1 className="hero-title">GeoRisk Alert</h1>
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
        <h1 className="hero-title">GeoRisk Alert</h1>
        <p className="hero-subtitle">
          AIエージェントが世界中の公的機関・メディアから情報を自動収集し、
          地政学リスクを分析・レポートするダッシュボード
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
      <section className="summary-card fade-in fade-in-delay-2">
        <div className="overall-risk">
          <span className={`risk-badge ${report.overall_risk_level}`}>
            <span className="dot"></span>
            {RISK_LABELS[report.overall_risk_level]?.label_ja || '不明'}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {report.date} の総合リスクレベル
          </span>
        </div>
        <p className="summary-text">{report.summary}</p>
      </section>

      {/* World Map - Region Risk Overview */}
      <section className="world-map-section fade-in fade-in-delay-3">
        <h2 className="section-title">
          <span className="icon">🗺️</span>
          地域別リスクマップ
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
                      {RISK_LABELS[riskLevel]?.label_ja || '情報なし'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vessel Traffic Monitoring */}
      <section className="vessel-monitoring-section fade-in fade-in-delay-3">
        <h2 className="section-title">
          <span className="icon">🚢</span>
          ホルムズ海峡 船舶航行モニタリング
        </h2>
        <div className="vessel-map-wrapper">
          <VesselMap />
        </div>
      </section>

      {/* Latest Articles */}
      <section className="articles-section fade-in fade-in-delay-4">
        <h2 className="section-title">
          <span className="icon">📋</span>
          最新のリスク分析記事
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
