'use client';

import React from 'react';
import {
    AlertTriangle,
    Activity,
    TrendingUp,
    Globe,
    Zap,
    ShoppingBag,
    Users,
    Wallet,
    Info,
    MapPin
} from 'lucide-react';
import { PanicReport, REGION_NAMES } from '@/lib/data';

const STATUS_COLORS: Record<string, string> = {
    normal: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    stable: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    unstable: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    volatile: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    critical: 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse',
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
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <AlertTriangle className="w-12 h-12 text-amber-500" />
                <h2 className="text-xl font-bold">データがまだありません</h2>
                <p className="text-muted">パニック分析の初回実行を待機しています...</p>
            </div>
        );
    }

    return (
        <div className="fade-in space-y-12 pb-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-glass-deep border border-white/10 p-8 md:p-12 mb-12">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-rose-500/10 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest">
                            <Activity className="w-3 h-3" />
                            Live Social Monitoring
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
                            World <span className="text-gradient-rose">Panic</span> Index
                        </h1>
                        <p className="text-lg text-secondary max-w-xl">
                            世界各地のSNS・ニュースから「集合的パニック」の予兆を抽出。
                            社会秩序の緊迫度をリアルタイムに数値化します。
                        </p>
                    </div>

                    <div className="flex-shrink-0 relative">
                        <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-8 border-glass-deep flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 to-amber-500/20 group-hover:opacity-100 opacity-50 transition-opacity"></div>
                            <span className="text-xs uppercase font-bold text-muted mb-1 relative z-10">Global Score</span>
                            <span className="text-6xl md:text-8xl font-black relative z-10">{report.global_panic_index}</span>
                            <div className="mt-2 relative z-10">
                                <TrendingUp className="w-6 h-6 text-rose-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Summary Card */}
            <section className="glass-card !border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent-blue"></div>
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent-blue/10 rounded-xl">
                        <Info className="w-6 h-6 text-accent-blue" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-2">パニック概況概観</h2>
                        <p className="text-secondary leading-relaxed">{report.summary}</p>
                    </div>
                </div>
            </section>

            {/* Region View */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {report.regions.map((reg) => {
                    const regionInfo = REGION_NAMES[reg.region];
                    return (
                        <div key={reg.region} className="glass-card hover:border-white/20 transition-all group">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{regionInfo?.emoji || '🗺️'}</span>
                                    <div>
                                        <h3 className="font-bold">{regionInfo?.name || reg.region}</h3>
                                        <p className="text-[10px] text-muted uppercase tracking-wider">{reg.region}</p>
                                    </div>
                                </div>
                                <div className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${STATUS_COLORS[reg.status]}`}>
                                    {reg.status}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-end justify-between">
                                    <span className="text-xs text-muted">Panic Intensity</span>
                                    <span className="text-3xl font-black text-white">{reg.panic_index}</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${reg.panic_index > 70 ? 'bg-rose-500' : reg.panic_index > 40 ? 'bg-amber-500' : 'bg-accent-blue'
                                            }`}
                                        style={{ width: `${reg.panic_index}%` }}
                                    ></div>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-secondary bg-white/5 p-2 rounded-lg">
                                    {CAUSE_ICONS[reg.main_cause] || <Activity className="w-3 h-3" />}
                                    <span>Main Cause: <strong>{reg.main_cause}</strong></span>
                                </div>
                            </div>

                            <div className="mt-8 space-y-3">
                                <h4 className="text-[10px] font-bold text-muted uppercase tracking-widest border-l-2 border-accent-blue pl-2">Major Incidents</h4>
                                {reg.incidents.map((incident, idx) => (
                                    <div key={idx} className="p-3 bg-black/30 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h5 className="text-xs font-bold leading-tight">{incident.title}</h5>
                                            <span className="text-[10px] text-rose-400 font-mono">#{incident.severity}</span>
                                        </div>
                                        <p className="text-[10px] text-muted line-clamp-2">{incident.description}</p>
                                        <div className="flex items-center gap-1 mt-2 text-[8px] text-accent-blue uppercase">
                                            <MapPin className="w-2 h-2" />
                                            {incident.location}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Legend / Info */}
            <section className="flex flex-wrap justify-center gap-8 pt-8 border-t border-white/5 text-[10px] text-muted uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span> 0-20 Stable
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> 41-60 Volatile
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 81-100 Panic
                </div>
            </section>
        </div>
    );
}
