import { getLatestReport, RISK_LABELS } from '@/lib/data';
export const dynamic = 'force-dynamic';

export default function StatementsPage() {
    const report = getLatestReport('statements');

    if (!report) {
        return (
            <div className="hero-section">
                <h1 className="hero-title">Influential Statements</h1>
                <p className="hero-subtitle">データを読み込み中、または初回実行をお待ちください。</p>
            </div>
        );
    }

    return (
        <>
            <section className="hero-section fade-in">
                <h1 className="hero-title">Influential Statements</h1>
                <p className="hero-subtitle">
                    世界の指導者、政策決定者、中央銀行総裁、主要企業経営者などの
                    重要な発言をリアルタイムで追跡・分析します。
                </p>
            </section>

            <section className="summary-card fade-in fade-in-delay-1">
                <div className="overall-risk">
                    <span className="risk-badge low">
                        <span className="dot"></span>
                        ライブ更新中
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {report.date} の要人発言サマリー
                    </span>
                </div>
                <p className="summary-text">{report.summary}</p>
            </section>

            <section className="statements-section fade-in fade-in-delay-2">
                <div className="statement-grid">
                    {report.statements.map((statement: any, index: number) => (
                        <div key={index} className={`statement-card ${statement.importance}`}>
                            <div className="statement-context">
                                📍 {statement.context}
                            </div>

                            <div className="quote-container">
                                <blockquote className="statement-quote">
                                    {statement.quote}
                                </blockquote>
                            </div>

                            <div className="statement-analysis">
                                {statement.analysis}
                            </div>

                            <div className="statement-tags">
                                {statement.tags.map((tag: string, i: number) => (
                                    <span key={i} className="tag-badge">#{tag}</span>
                                ))}
                            </div>

                            <div className="statement-speaker-info">
                                <div className="speaker-avatar">
                                    {statement.speaker.charAt(0)}
                                </div>
                                <div className="speaker-details">
                                    <span className="speaker-name">{statement.speaker}</span>
                                    <span className="speaker-title">{statement.title}</span>
                                </div>
                                <div style={{ marginLeft: 'auto' }}>
                                    <span className={`risk-badge ${statement.importance}`}>
                                        {RISK_LABELS[statement.importance]?.label_ja || statement.importance}
                                    </span>
                                </div>
                            </div>

                            {statement.source_url && (
                                <a
                                    href={statement.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="source-badge"
                                    style={{ position: 'absolute', top: 'var(--space-md)', right: 'var(--space-md)', opacity: 0.6 }}
                                >
                                    📰 記事元
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
