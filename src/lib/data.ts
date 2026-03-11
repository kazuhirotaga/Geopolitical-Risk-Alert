import fs from 'fs';
import path from 'path';

export interface Article {
    title: string;
    region: string;
    risk_level: string;
    summary: string;
    analysis: string;
    key_entities: string[];
    sources: string[];
    source_types: string[];
}

export interface DailyReport {
    date: string;
    summary: string;
    overall_risk_level: string;
    generated_at: string;
    articles: Article[];
    region_risk_map: Record<string, string>;
}

export interface IndexEntry {
    date: string;
    summary: string;
    overall_risk_level: string;
    article_count: number;
    region_risk_map: Record<string, string>;
    generated_at: string;
}

export interface MarketIndex {
    symbol: string;
    label: string;
    current_price: number;
    price_formatted: string;
    change: number;
    change_formatted: string;
    change_percent: number;
    change_percent_formatted: string;
    trend: 'up' | 'down' | 'flat';
    date: string;
}

export interface MarketData {
    generated_at: string;
    indices: MarketIndex[];
}

export interface Statement {
    speaker: string;
    title: string;
    quote: string;
    context: string;
    analysis: string;
    importance: string;
    tags: string[];
    source_url: string;
}

export interface StatementReport {
    date: string;
    summary: string;
    generated_at: string;
    statements: Statement[];
}

export interface PetroleumStockPoint {
    date: string;
    gasoline: number;
    jet_fuel: number;
    naphtha: number;
}

export interface PetroleumStocks {
    unit: string;
    source: string;
    last_updated: string;
    data: PetroleumStockPoint[];
}

export interface CombatEvent {
    id: string;
    timestamp: string;
    location: string;
    region: string;
    title: string;
    content: string;
    involved_parties: string[];
    event_type: 'bombing' | 'clash' | 'occupy' | 'retreat' | 'cyber' | 'other';
    urgency: 'critical' | 'high' | 'medium' | 'low';
    source_name: string;
    source_url: string;
}

export interface CombatLog {
    date: string;
    summary: string;
    events: CombatEvent[];
}

const ARTICLES_DIR = path.join(process.cwd(), 'data', 'articles');
const FINANCIAL_DIR = path.join(process.cwd(), 'data', 'financial');
const STATEMENTS_DIR = path.join(process.cwd(), 'data', 'statements');
const ENERGY_DIR = path.join(process.cwd(), 'data', 'energy');
const COMBAT_DIR = path.join(process.cwd(), 'data', 'combat');

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
export function getLatestReport(type: 'articles' | 'financial' | 'statements' = 'articles'): any | null {
    try {
        let dir;
        if (type === 'financial') dir = FINANCIAL_DIR;
        else if (type === 'statements') dir = STATEMENTS_DIR;
        else dir = ARTICLES_DIR;

        const filePath = path.join(dir, 'latest.json');
        if (!fs.existsSync(filePath)) return null;
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch {
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

export const REGION_NAMES: Record<string, { name: string; name_en: string; emoji: string }> = {
    east_asia: { name: '東アジア', name_en: 'East Asia', emoji: '🌏' },
    southeast_asia: { name: '東南アジア', name_en: 'Southeast Asia', emoji: '🌴' },
    south_asia: { name: '南アジア', name_en: 'South Asia', emoji: '🏔️' },
    central_asia: { name: '中央アジア', name_en: 'Central Asia', emoji: '🏜️' },
    middle_east: { name: '中東', name_en: 'Middle East', emoji: '🕌' },
    europe: { name: '欧州', name_en: 'Europe', emoji: '🏰' },
    africa: { name: 'アフリカ', name_en: 'Africa', emoji: '🌍' },
    north_america: { name: '北米', name_en: 'North America', emoji: '🗽' },
    south_america: { name: '南米', name_en: 'South America', emoji: '🌎' },
};

export const RISK_LABELS: Record<string, { label: string; label_ja: string }> = {
    critical: { label: 'Critical', label_ja: '危機的' },
    high: { label: 'High', label_ja: '高リスク' },
    medium: { label: 'Medium', label_ja: '中リスク' },
    low: { label: 'Low', label_ja: '低リスク' },
    none: { label: 'None', label_ja: '情報なし' },
};

export const SOURCE_TYPE_LABELS: Record<string, string> = {
    media: 'メディア',
    government: '政府機関',
    research: '研究機関',
    international_org: '国際機関',
};
