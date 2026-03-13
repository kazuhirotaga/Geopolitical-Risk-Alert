import React from 'react';
export const dynamic = 'force-dynamic';
import { getLatestReport } from '@/lib/data';
import PanicClient from './PanicClient';

export const metadata = {
    title: 'Panic Situations Dashboard | GeoRisk Alert',
    description: '世界各地のパニック状況、社会不安、資源不足をリアルタイムで監視。',
};

export default function PanicPage() {
    console.log('[PanicPage] Rendering...');
    const report = getLatestReport('panic');

    if (report) {
        console.log(`[PanicPage] Data found for ${report.date}`);
    } else {
        console.warn('[PanicPage] No report data found!');
    }

    return (
        <main className="main-container">
            <div className="fade-in">
                <PanicClient report={report} />
            </div>
        </main>
    );
}
