import React from 'react';
export const dynamic = 'force-dynamic';
import { getLatestReport } from '@/lib/data';
import LogisticsClient from './LogisticsClient';

export const metadata = {
    title: 'Logistics & Supply Chain Monitor | GeoRisk Alert',
    description: '世界の主要航路・物流網・サプライチェーンのリスク状況をリアルタイムで監視。',
};

export default function LogisticsPage() {
    console.log('[LogisticsPage] Rendering...');
    const report = getLatestReport('logistics');

    if (report) {
        console.log(`[LogisticsPage] Data found for ${report.date}`);
    } else {
        console.warn('[LogisticsPage] No report data found!');
    }

    return (
        <main className="main-container">
            <div className="fade-in">
                <LogisticsClient report={report} />
            </div>
        </main>
    );
}
