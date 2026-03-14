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

export interface PanicIncident {
    title: string;
    location: string;
    severity: number;
    description: string;
    source: string;
}

export interface PanicRegionReport {
    region: string;
    panic_index: number;
    status: 'normal' | 'stable' | 'unstable' | 'volatile' | 'critical';
    main_cause: string;
    incidents: PanicIncident[];
}

export interface PanicReport {
    date: string;
    summary: string;
    global_panic_index: number;
    regions: PanicRegionReport[];
}
