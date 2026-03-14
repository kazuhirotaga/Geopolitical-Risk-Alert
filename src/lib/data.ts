import fs from 'fs';
import path from 'path';
import {
    Article,
    DailyReport,
    IndexEntry,
    MarketData,
    PetroleumStocks,
    CombatLog,
    StatementReport,
    PanicReport
} from './types';

export * from './types';
export * from './constants';

const ARTICLES_DIR = path.join(process.cwd(), 'data', 'articles');
const FINANCIAL_DIR = path.join(process.cwd(), 'data', 'financial');
const STATEMENTS_DIR = path.join(process.cwd(), 'data', 'statements');
const ENERGY_DIR = path.join(process.cwd(), 'data', 'energy');
const COMBAT_DIR = path.join(process.cwd(), 'data', 'combat');
const PANIC_DIR = path.join(process.cwd(), 'data', 'panic');

export function getMarketData(): MarketData | null {
    try {
        const filePath = path.join(FINANCIAL_DIR, 'market_data.json');
        if (!fs.existsSync(filePath)) return null;
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch {
        return null;
    }
}

export function getPetroleumStocks(): PetroleumStocks | null {
    try {
        const filePath = path.join(ENERGY_DIR, 'petroleum_stocks.json');
        if (!fs.existsSync(filePath)) return null;
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch {
        return null;
    }
}

export function getCombatLogs(): CombatLog[] {
    try {
        const filePath = path.join(COMBAT_DIR, 'logs.json');
        if (!fs.existsSync(filePath)) return [];
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export function getLatestReport(type?: 'articles' | 'financial'): DailyReport | null;
export function getLatestReport(type: 'statements'): StatementReport | null;
export function getLatestReport(type: 'panic'): PanicReport | null;
export function getLatestReport(type: 'articles' | 'financial' | 'statements' | 'panic' = 'articles'): any | null {
    try {
        let dir;
        if (type === 'financial') dir = FINANCIAL_DIR;
        else if (type === 'statements') dir = STATEMENTS_DIR;
        else if (type === 'panic') dir = PANIC_DIR;
        else dir = ARTICLES_DIR;

        const filePath = path.join(dir, 'latest.json');
        console.log(`[DataLayer] Fetching latest report for type: ${type}, path: ${filePath}`);

        if (!fs.existsSync(filePath)) {
            console.warn(`[DataLayer] File NOT found: ${filePath}`);
            return null;
        }

        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`[DataLayer] Error loading latest report (${type}):`, error);
        return null;
    }
}

export function getReportByDate(date: string, type?: 'articles' | 'financial'): DailyReport | null;
export function getReportByDate(date: string, type: 'statements'): StatementReport | null;
export function getReportByDate(date: string, type: 'articles' | 'financial' | 'statements' = 'articles'): any | null {
    try {
        let dir;
        if (type === 'financial') dir = FINANCIAL_DIR;
        else if (type === 'statements') dir = STATEMENTS_DIR;
        else dir = ARTICLES_DIR;

        const filePath = path.join(dir, `${date}.json`);
        if (!fs.existsSync(filePath)) return null;
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch {
        return null;
    }
}

export function getIndex(type: 'articles' | 'financial' | 'statements' = 'articles'): IndexEntry[] {
    try {
        let dir;
        if (type === 'financial') dir = FINANCIAL_DIR;
        else if (type === 'statements') dir = STATEMENTS_DIR;
        else dir = ARTICLES_DIR;

        const filePath = path.join(dir, 'index.json');
        if (!fs.existsSync(filePath)) return [];
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}
