'use client';

import React, { useState } from 'react';
import type { LogisticsReport, LogisticsRouteStatus, LogisticsIncident } from '@/lib/types';
import { RISK_LABELS } from '@/lib/constants';

interface Props {
    report: LogisticsReport | null;
}

export default function LogisticsClient({ report }: Props) {
    const [activeTab, setActiveTab] = useState<'routes' | 'incidents'>('routes');

    if (!report) {
        return (
            <div className="fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>物流・サプライチェーン監視</h2>
                <p>データが見つかりません。データ収集スクリプトを実行してください。</p>
            </div>
        );
    }

    const getStatusLabel = (status: LogisticsRouteStatus['status']) => {
        switch (status) {
            case 'normal': return { label: '通常稼働', color: 'var(--risk-low)' };
            case 'congested': return { label: '混雑', color: 'var(--risk-medium)' };
            case 'restricted': return { label: '制限あり', color: 'var(--risk-high)' };
            case 'blocked': return { label: '封鎖・機能停止', color: 'var(--risk-critical)' };
            default: return { label: '不明', color: 'var(--text-muted)' };
        }
    };

    return (
        <div className="fade-in">
            <header style={{ marginBottom: '2rem' }}>
                <h1 className="section-title">
                    <span className="icon">🚢</span>
                    物流・サプライチェーン モニタリング
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    世界の主要航路およびサプライチェーンの状況を監視します。（最終更新: {new Date(report.generated_at).toLocaleString('ja-JP')}）
                </p>
            </header>

            {/* Overview Section */}
            <section className="summary-card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>全体の物流リスク概況</h2>
                        <div style={{ marginTop: '0.5rem' }}>
                            <span className={`risk-badge ${report.overall_risk_level}`}>
                                <span className="dot"></span>
                                {RISK_LABELS[report.overall_risk_level]?.label_ja || report.overall_risk_level}リスク
                            </span>
                        </div>
                    </div>
                </div>
                <p className="summary-text" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                    {report.summary}
                </p>
            </section>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('routes')}
                    style={{
                        padding: '1rem 2rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'routes' ? '3px solid var(--accent-light)' : '3px solid transparent',
                        color: activeTab === 'routes' ? 'var(--text-primary)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        fontWeight: activeTab === 'routes' ? 'bold' : 'normal',
                        transition: 'all 0.2s'
                    }}
                >
                    主要航路ステータス
                </button>
                <button
                    onClick={() => setActiveTab('incidents')}
                    style={{
                        padding: '1rem 2rem',
                        background: 'none',
                        border: 'none',
                        borderBottom: activeTab === 'incidents' ? '3px solid var(--accent-light)' : '3px solid transparent',
                        color: activeTab === 'incidents' ? 'var(--text-primary)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        fontWeight: activeTab === 'incidents' ? 'bold' : 'normal',
                        transition: 'all 0.2s'
                    }}
                >
                    最近のインシデント
                </button>
            </div>

            {/* Routes Map/List */}
            {activeTab === 'routes' && (
                <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {report.routes.map((route, index) => {
                        const statusInfo = getStatusLabel(route.status);
                        return (
                            <div key={index} className="article-card" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{route.route_name}</h3>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.85rem',
                                        fontWeight: 'bold',
                                        backgroundColor: `${statusInfo.color}20`,
                                        color: statusInfo.color,
                                        border: `1px solid ${statusInfo.color}50`
                                    }}>
                                        {statusInfo.label}
                                    </span>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <span className={`risk-badge ${route.risk_level}`} style={{ fontSize: '0.8rem' }}>
                                        <span className="dot"></span>
                                        影響度：{RISK_LABELS[route.risk_level]?.label_ja || route.risk_level}
                                    </span>
                                </div>

                                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5, flexGrow: 1 }}>
                                    {route.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Incidents Timeline */}
            {activeTab === 'incidents' && (
                <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {report.incidents.map((incident, index) => (
                        <div key={index} className="article-card" style={{ borderLeft: `4px solid var(--risk-${incident.severity})` }}>
                            <div className="article-header">
                                <h3 className="article-title">{incident.title}</h3>
                                <span className={`risk-badge ${incident.severity}`}>
                                    <span className="dot"></span>
                                    {RISK_LABELS[incident.severity]?.label_ja}
                                </span>
                            </div>
                            <div className="article-meta">
                                <span className="source-badge">📍 {incident.location}</span>
                                <span className="source-badge">🗞️ {incident.source}</span>
                            </div>
                            <p className="article-summary" style={{ marginTop: '1rem' }}>{incident.description}</p>
                            <div className="article-analysis" style={{ marginTop: '0.5rem', borderLeft: '2px solid var(--border-color)', paddingLeft: '1rem' }}>
                                <strong>サプライチェーンへの影響：</strong><br />
                                {incident.impact}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
