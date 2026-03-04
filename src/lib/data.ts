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

const DATA_DIR = path.join(process.cwd(), 'data', 'articles');

export function getLatestReport(): DailyReport | null {
    try {
        const filePath = path.join(DATA_DIR, 'latest.json');
        if (!fs.existsSync(filePath)) return null;
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch {
        return null;
    }
}

export function getReportByDate(date: string): DailyReport | null {
    try {
        const filePath = path.join(DATA_DIR, `${date}.json`);
        if (!fs.existsSync(filePath)) return null;
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch {
        return null;
    }
}

export function getIndex(): IndexEntry[] {
    try {
        const filePath = path.join(DATA_DIR, 'index.json');
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
