'use client';

import React, { useState } from 'react';
import {
    ShieldAlert,
    MapPin,
    ExternalLink,
    Clock,
    Flame,
    TowerControl as Tower,
    Crosshair,
    ArrowLeftRight,
    ShieldCheck,
    Globe
} from 'lucide-react';
import { CombatLog } from '@/lib/data';

const EVENT_TYPE_ICONS: Record<string, React.ReactNode> = {
    bombing: <Flame className="w-4 h-4" />,
    clash: <Crosshair className="w-4 h-4" />,
    occupy: <Tower className="w-4 h-4" />,
    retreat: <ArrowLeftRight className="w-4 h-4" />,
    cyber: <ShieldAlert className="w-4 h-4" />,
    other: <Globe className="w-4 h-4" />,
};

const URGENCY_COLORS: Record<string, string> = {
    critical: 'border-rose-500 bg-rose-500/10 text-rose-500',
    high: 'border-orange-500 bg-orange-500/10 text-orange-500',
    medium: 'border-amber-500 bg-amber-500/10 text-amber-500',
    low: 'border-emerald-500 bg-emerald-500/10 text-emerald-500',
};

export default function CombatLogClient({ logs }: { logs: CombatLog[] }) {
    const [selectedRegion, setSelectedRegion] = useState<string>('all');

    const filteredLogs = logs.map(log => ({
        ...log,
        events: log.events.filter(e => selectedRegion === 'all' || e.region === selectedRegion)
    })).filter(log => log.events.length > 0);

    return (
        <div className="fade-in">
            <section className="hero-section">
                <h1 className="hero-title">戦闘情報タイムライン (Combat Log)</h1>
                <p className="hero-subtitle">
                    世界各地の軍事衝突・戦闘イベントをリアルタイムに近い形式で監視。
                    最新の戦況動態をログ形式で記録します。
                </p>
            </section>

            {/* Filters */}
            <div className="flex gap-4 mb-8 justify-center">
                {['all', 'europe', 'middle_east', 'east_asia', 'africa'].map(region => (
                    <button
                        key={region}
                        onClick={() => setSelectedRegion(region)}
                        className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${selectedRegion === region
                            ? 'bg-accent-blue border-transparent text-white shadow-lg shadow-blue-500/20'
                            : 'bg-glass border-white/10 text-muted hover:border-white/30'
                            }`}
                    >
                        {region === 'all' ? 'すべて' : region.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="max-w-4xl mx-auto">
                {filteredLogs.length === 0 ? (
                    <div className="glass-card text-center p-12">
                        <p className="text-muted">表示可能な戦闘イベントがありません。</p>
                    </div>
                ) : (
                    filteredLogs.map((day, dayIdx) => (
                        <div key={day.date} className="mb-12 relative">
                            <div className="flex items-center gap-4 mb-6 sticky top-24 z-10 py-2 bg-background/80 backdrop-blur-sm">
                                <div className="bg-glass-deep px-4 py-1.5 rounded-lg border border-white/10 shadow-xl">
                                    <span className="text-sm font-bold text-accent-blue">{day.date}</span>
                                </div>
                                <p className="text-xs text-muted leading-relaxed flex-1 italic">
                                    {day.summary}
                                </p>
                            </div>

                            <div className="space-y-6 pl-4 border-l border-white/5 ml-6">
                                {day.events.map((event, eventIdx) => (
                                    <div key={event.id} className="relative">
                                        {/* Timeline Dot */}
                                        <div className={`absolute -left-[2.1rem] top-4 w-3 h-3 rounded-full border-2 border-background z-20 ${event.urgency === 'critical' || event.urgency === 'high' ? 'bg-rose-500' : 'bg-accent-blue'
                                            }`} />

                                        <div className="glass-card !p-0 overflow-hidden hover:border-white/30 transition-all group">
                                            <div className="p-4 sm:p-6">
                                                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${URGENCY_COLORS[event.urgency]}`}>
                                                                {event.urgency}
                                                            </span>
                                                            <span className="flex items-center gap-1 text-[10px] text-muted font-mono uppercase bg-black/30 px-2 py-0.5 rounded">
                                                                {EVENT_TYPE_ICONS[event.event_type]}
                                                                {event.event_type}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-lg font-bold group-hover:text-accent-blue transition-colors">
                                                            {event.title}
                                                        </h3>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <div className="flex items-center gap-1 text-xs text-muted">
                                                            <Clock className="w-3 h-3" />
                                                            {event.timestamp ? new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs text-accent-blue">
                                                            <MapPin className="w-3 h-3" />
                                                            {event.location}
                                                        </div>
                                                    </div>
                                                </div>

                                                <p className="text-sm text-secondary leading-relaxed mb-4">
                                                    {event.content}
                                                </p>

                                                <div className="flex flex-wrap items-center justify-between gap-4 mt-auto pt-4 border-t border-white/5">
                                                    <div className="flex flex-wrap gap-2">
                                                        {event.involved_parties.map(party => (
                                                            <span key={party} className="text-[10px] bg-white/5 px-2 py-1 rounded text-muted">
                                                                {party}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    {event.source_url && (
                                                        <a
                                                            href={event.source_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1 text-[10px] text-muted hover:text-white transition-colors"
                                                        >
                                                            Source: {event.source_name}
                                                            <ExternalLink className="w-2.5 h-2.5" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Analysis Sidebar */}
            <div className="mt-12 glass-card border-accent-blue/20">
                <h2 className="section-title text-lg flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-accent-blue" />
                    現在の軍事動態分析
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-black/20 rounded-xl">
                        <h4 className="text-xs font-bold mb-2 text-accent-blue uppercase tracking-wider">ウクライナ・ロシア</h4>
                        <p className="text-xs text-muted leading-relaxed">
                            ロシア軍による後方インフラへの長距離ドローン攻撃が激化。ウクライナ軍は限定的な反撃と特殊部隊による海上ドローン攻撃を継続しており、戦線は膠着気味。
                        </p>
                    </div>
                    <div className="p-4 bg-black/20 rounded-xl">
                        <h4 className="text-xs font-bold mb-2 text-rose-400 uppercase tracking-wider">中東（パレスチナ・ガザ）</h4>
                        <p className="text-xs text-muted leading-relaxed">
                            イスラエル国防軍によるガザ北部・南部への空爆が継続。人道支援ルートの確保が焦点となる一方、ヒズボラによる北部国境での散発的な衝突も警戒対象。
                        </p>
                    </div>
                    <div className="p-4 bg-black/20 rounded-xl">
                        <h4 className="text-xs font-bold mb-2 text-amber-400 uppercase tracking-wider">全般的リスク傾向</h4>
                        <p className="text-xs text-muted leading-relaxed">
                            非国家主体（武装組織等）による安価なドローン技術の利用が一般化しており、攻撃手法の非対称性が増大。サプライチェーンへの物理的・地政学的リスクは依然として高い。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
