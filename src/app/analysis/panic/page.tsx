import React from 'react';
export const dynamic = 'force-dynamic';
import { getLatestReport } from '@/lib/data';
import PanicClient from './PanicClient';

export const metadata = {
    title: 'Panic Situations Dashboard | GeoRisk Alert',
    description: '世界各地のパニック状況、社会不安、資源不足をリアルタイムで監視。',
};

export default function PanicPage() {
    const report = getLatestReport('panic');

    return (
        <main className="container mx-auto px-4 py-8">
            <PanicClient report={report} />
        </main>
    );
}
