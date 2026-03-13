import React from 'react';
import { getPetroleumStocks } from '@/lib/data';
import FuelStocksClient from './FuelStocksClient';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: '燃料在庫モニタリング | GeoRisk Alert',
};

export default function FuelStocksPage() {
    const stocks = getPetroleumStocks();

    if (!stocks || !stocks.data || stocks.data.length === 0) {
        return (
            <div className="hero-section">
                <h1 className="hero-title">燃料在庫モニタリング</h1>
                <p className="hero-subtitle">データを読み込み中、または初回実行をお待ちください。</p>
            </div>
        );
    }

    return <FuelStocksClient stocks={stocks} />;
}
