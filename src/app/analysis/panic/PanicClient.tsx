'use client';

import React from 'react';
import {
    AlertTriangle,
    Activity,
    TrendingUp,
    Info,
    MapPin,
    ShoppingBag,
    Wallet,
    Users,
    Zap
} from 'lucide-react';
import { PanicReport } from '@/lib/types';
import { REGION_NAMES } from '@/lib/constants';

const STATUS_LABELS: Record<string, { label: string, class: string }> = {
    normal: { label: '正常', class: 'low' },
    stable: { label: '安定', class: 'low' },
    unstable: { label: '不安定', class: 'medium' },
    volatile: { label: '変動', class: 'high' },
    critical: { label: '危機的', class: 'critical' },
};

const CAUSE_ICONS: Record<string, React.ReactNode> = {
    '食料不足': <ShoppingBag className="w-4 h-4" />,
    '金融不安': <Wallet className="w-4 h-4" />,
    'デモ': <Users className="w-4 h-4" />,
    'エネルギー不安': <Zap className="w-4 h-4" />,
};

export default function PanicClient({ report }: { report: PanicReport | null }) {
    if (!report) {
        return (
            <div className="hero-section">
                <AlertTriangle className="w-12 h-12 text-risk-medium mx-auto mb-4" />
                <h2 className="hero-title">データがまだありません</h2>
                <p className="hero-subtitle">パニック分析の初回実行を待機しています...</p>
            </div>
        );
    }

    return (
        <div className="fade-in">
            {/* Hero Section */}
            <section className="hero-section">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '20px', backgroundColor: 'var(--risk-critical-bg)', color: 'var(--risk-critical)', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    <Activity className="w-3 h-3" />
                    LIVE SOCIAL MONITORING
                </div>
                <h1 className="hero-title">World Panic Index</h1>
                <p className="hero-subtitle">
                    AIエージェントが世界各地のSNS・ニュースから「集合的パニック」の予兆を抽出。
                    社会秩序の緊迫度をリアルタイムに数値化。
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    <div className="glass-card" style={{ width: '200px', height: '200px', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '4px solid var(--border-glow)', boxShadow: 'var(--shadow-glow)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>GLOBAL SCORE</span>
                        <span style={{ fontSize: '4rem', fontWeight: '900', background: 'linear-gradient(135deg, #f43f5e, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {report.global_panic_index}
                        </span>
                        <TrendingUp className="w-6 h-6" style={{ color: 'var(--risk-critical)' }} />
                    </div>
                </div>
            </section>

            {/* Summary Card */}
            <section className="summary-card" style={{ borderLeft: '4px solid var(--accent-blue)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ padding: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem' }}>
                        <Info className="w-6 h-6" style={{ color: 'var(--accent-blue)' }} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>パニック概況概観</h2>
                        <p className="summary-text">{report.summary}</p>
                    </div>
                </div>
            </section>

            {/* Region View */}
            <h2 className="section-title">
                <span className="icon">🗺️</span>
                地域別パニック状況
            </h2>
            <div className="world-map-grid" style={{ marginBottom: '4rem' }}>
                {report.regions.map((reg) => {
                    const regionInfo = REGION_NAMES[reg.region];
                    const status = STATUS_LABELS[reg.status] || { label: reg.status, class: 'none' };

                    return (
                        <div key={reg.region} className="region-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '1.5rem' }}>{regionInfo?.emoji || '🗺️'}</span>
                                    <div>
                                        <div className="region-name">{regionInfo?.name || reg.region}</div>
                                        <div className="region-name-en">{reg.region.toUpperCase()}</div>
                                    </div>
                                </div>
                                <span className={`risk-badge ${status.class}`}>
                                    <span className="dot"></span>
                                    {status.label}
                                </span>
                            </div>

                            <div style={{ marginTop: '0.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Panic Intensity</span>
                                    <span style={{ fontSize: '1.5rem', fontWeight: '900' }}>{reg.panic_index}</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div
                                        style={{
                                            width: `${reg.panic_index}%`,
                                            height: '100%',
                                            backgroundColor: reg.panic_index > 70 ? 'var(--risk-critical)' : reg.panic_index > 40 ? 'var(--risk-high)' : 'var(--accent-blue)',
                                            transition: 'width 1s ease-in-out'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', backgroundColor: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                                <strong>主な原因:</strong> {reg.main_cause}
                            </div>

                            <div style={{ marginTop: '0.5rem' }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', borderLeft: '2px solid var(--accent-blue)', paddingLeft: '0.5rem' }}>
                                    主要な事象
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {reg.incidents.map((incident, idx) => (
                                        <div key={idx} style={{ padding: '0.75rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                                                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', lineHeight: '1.2' }}>{incident.title}</div>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--risk-critical)', fontFamily: 'monospace' }}>#{incident.severity}</span>
                                            </div>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {incident.description}
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem', fontSize: '0.65rem', color: 'var(--accent-blue)' }}>
                                                <MapPin className="w-2 h-2" />
                                                {incident.location}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer / Legend */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', paddingBottom: '4rem', textAlign: 'center', opacity: 0.6 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--risk-low)' }}></span> 0-40 Low
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--risk-medium)' }}></span> 41-70 Volatile
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--risk-critical)' }}></span> 71-100 Panic
                    </div>
                </div>
            </div>
        </div>
    );
}
