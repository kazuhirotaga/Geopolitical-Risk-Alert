"""
地政学リスク情報収集サイト - 設定ファイル
RSSフィード、公的機関データソース、地域分類、AIプロンプトテンプレートを定義
"""

# ============================================================
# データソース定義
# ============================================================

# ソース種別
SOURCE_TYPES = {
    "media": "ニュースメディア",
    "government": "政府機関",
    "research": "研究機関",
    "international_org": "国際機関",
}

# RSSフィード / データソース一覧
# 各エントリ: { "name", "url", "type", "language", "region_focus" }
DATA_SOURCES = [
    # --- ニュースメディア ---
    {
        "name": "Reuters - World",
        "url": "https://feeds.reuters.com/Reuters/worldNews",
        "type": "media",
        "language": "en",
        "region_focus": "global",
    },
    {
        "name": "BBC - World",
        "url": "https://feeds.bbci.co.uk/news/world/rss.xml",
        "type": "media",
        "language": "en",
        "region_focus": "global",
    },
    {
        "name": "Al Jazeera",
        "url": "https://www.aljazeera.com/xml/rss/all.xml",
        "type": "media",
        "language": "en",
        "region_focus": "middle_east",
    },
    {
        "name": "NHK World",
        "url": "https://www3.nhk.or.jp/rss/news/cat6.xml",
        "type": "media",
        "language": "ja",
        "region_focus": "east_asia",
    },
    {
        "name": "共同通信 - 国際",
        "url": "https://www.47news.jp/rss/national_international.xml",
        "type": "media",
        "language": "ja",
        "region_focus": "global",
    },
    {
        "name": "CNN - World",
        "url": "http://rss.cnn.com/rss/edition_world.rss",
        "type": "media",
        "language": "en",
        "region_focus": "global",
    },
    {
        "name": "AP News - World",
        "url": "https://rsshub.app/apnews/topics/world-news",
        "type": "media",
        "language": "en",
        "region_focus": "global",
    },
    # --- 政府機関 ---
    {
        "name": "外務省 - 海外安全情報",
        "url": "https://www.anzen.mofa.go.jp/rss/rss.xml",
        "type": "government",
        "language": "ja",
        "region_focus": "global",
    },
    {
        "name": "米国務省 - Travel Advisories",
        "url": "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.html/rss.xml",
        "type": "government",
        "language": "en",
        "region_focus": "global",
    },
    # --- 国際機関 ---
    {
        "name": "国連ニュース",
        "url": "https://news.un.org/feed/subscribe/en/news/all/rss.xml",
        "type": "international_org",
        "language": "en",
        "region_focus": "global",
    },
    {
        "name": "国連安保理",
        "url": "https://press.un.org/en/taxonomy/term/10/feed",
        "type": "international_org",
        "language": "en",
        "region_focus": "global",
    },
    {
        "name": "IAEA News",
        "url": "https://www.iaea.org/feeds/topstories",
        "type": "international_org",
        "language": "en",
        "region_focus": "global",
    },
    {
        "name": "NATO News",
        "url": "https://www.nato.int/cps/en/natolive/news.htm?mode=list&type=rss",
        "type": "international_org",
        "language": "en",
        "region_focus": "europe",
    },
    # --- 研究機関 ---
    {
        "name": "SIPRI News",
        "url": "https://www.sipri.org/rss.xml",
        "type": "research",
        "language": "en",
        "region_focus": "global",
    },
    {
        "name": "ICG - CrisisWatch",
        "url": "https://www.crisisgroup.org/crisiswatch/feed/rss",
        "type": "research",
        "language": "en",
        "region_focus": "global",
    },
    {
        "name": "Council on Foreign Relations",
        "url": "https://www.cfr.org/rss.xml",
        "type": "research",
        "language": "en",
        "region_focus": "global",
    },
]

# 金融RSSフィード / データソース一覧
FINANCIAL_DATA_SOURCES = [
    {
        "name": "Reuters - Business",
        "url": "https://feeds.reuters.com/reuters/businessNews",
        "type": "media",
        "language": "en",
        "region_focus": "global",
    },
    {
        "name": "CNBC - Top News",
        "url": "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114",
        "type": "media",
        "language": "en",
        "region_focus": "global",
    },
    {
        "name": "Yahoo Finance",
        "url": "https://finance.yahoo.com/news/rssindex",
        "type": "media",
        "language": "en",
        "region_focus": "global",
    },
    {
        "name": "日経新聞 - 金融",
        "url": "https://assets.wor.jp/rss/rdf/nikkei/finance.rdf",
        "type": "media",
        "language": "ja",
        "region_focus": "east_asia",
    },
    {
        "name": "CoinDesk",
        "url": "https://www.coindesk.com/arc/outboundfeeds/rss/",
        "type": "media",
        "language": "en",
        "region_focus": "global",
    },
]

# ============================================================
# 地域分類
# ============================================================

REGIONS = {
    "east_asia": {
        "name": "東アジア",
        "name_en": "East Asia",
        "keywords": [
            "china", "japan", "korea", "taiwan", "mongolia",
            "中国", "日本", "韓国", "北朝鮮", "台湾", "モンゴル",
            "beijing", "tokyo", "seoul", "pyongyang", "taipei",
        ],
    },
    "southeast_asia": {
        "name": "東南アジア",
        "name_en": "Southeast Asia",
        "keywords": [
            "myanmar", "vietnam", "philippines", "indonesia", "thailand",
            "malaysia", "singapore", "cambodia", "laos",
            "ミャンマー", "ベトナム", "フィリピン", "インドネシア", "タイ",
        ],
    },
    "south_asia": {
        "name": "南アジア",
        "name_en": "South Asia",
        "keywords": [
            "india", "pakistan", "bangladesh", "sri lanka", "afghanistan",
            "nepal", "インド", "パキスタン", "アフガニスタン",
        ],
    },
    "central_asia": {
        "name": "中央アジア",
        "name_en": "Central Asia",
        "keywords": [
            "kazakhstan", "uzbekistan", "turkmenistan", "kyrgyzstan",
            "tajikistan", "カザフスタン", "ウズベキスタン",
        ],
    },
    "middle_east": {
        "name": "中東",
        "name_en": "Middle East",
        "keywords": [
            "iran", "iraq", "syria", "israel", "palestine", "gaza",
            "saudi", "yemen", "lebanon", "turkey", "jordan",
            "イラン", "イラク", "シリア", "イスラエル", "パレスチナ", "ガザ",
            "サウジ", "イエメン", "レバノン", "トルコ",
        ],
    },
    "europe": {
        "name": "欧州",
        "name_en": "Europe",
        "keywords": [
            "ukraine", "russia", "nato", "eu", "europe", "germany", "france",
            "uk", "britain", "poland", "baltic",
            "ウクライナ", "ロシア", "欧州", "ドイツ", "フランス", "イギリス",
        ],
    },
    "africa": {
        "name": "アフリカ",
        "name_en": "Africa",
        "keywords": [
            "africa", "sahel", "sudan", "ethiopia", "somalia", "congo",
            "nigeria", "libya", "niger", "mali", "mozambique",
            "アフリカ", "スーダン", "エチオピア", "ソマリア", "コンゴ",
        ],
    },
    "north_america": {
        "name": "北米",
        "name_en": "North America",
        "keywords": [
            "united states", "usa", "canada", "mexico",
            "アメリカ", "米国", "カナダ", "メキシコ",
        ],
    },
    "south_america": {
        "name": "南米",
        "name_en": "South America",
        "keywords": [
            "brazil", "venezuela", "colombia", "argentina", "chile", "peru",
            "ブラジル", "ベネズエラ", "コロンビア", "アルゼンチン",
        ],
    },
}

# ============================================================
# 地政学キーワード（フィルタリング用）
# ============================================================

GEOPOLITICAL_KEYWORDS = [
    # 英語
    "war", "conflict", "military", "sanctions", "nuclear", "missile",
    "troops", "invasion", "ceasefire", "diplomacy", "tensions",
    "threat", "security", "terrorism", "extremism", "coup",
    "protest", "uprising", "rebellion", "border", "disputed",
    "alliance", "treaty", "embargo", "arms", "weapons",
    "cyber attack", "espionage", "intelligence", "assassination",
    "refugee", "humanitarian", "crisis", "emergency",
    "geopolitical", "sovereignty", "territorial",
    # 日本語
    "戦争", "紛争", "軍事", "制裁", "核", "ミサイル",
    "軍", "侵攻", "停戦", "外交", "緊張",
    "脅威", "安全保障", "テロ", "クーデター",
    "抗議", "蜂起", "反乱", "国境", "領土",
    "同盟", "条約", "禁輸", "武器", "兵器",
    "サイバー攻撃", "スパイ", "諜報", "暗殺",
    "難民", "人道", "危機", "緊急",
    "地政学", "主権",
]

# ============================================================
# 金融キーワード（フィルタリング用）
# ============================================================

FINANCIAL_KEYWORDS = [
    # 英語
    "market", "stock", "economy", "inflation", "recession", "interest rate",
    "fed", "central bank", "currency", "crypto", "bitcoin", "sec",
    "earnings", "trade", "tariff", "debt", "bankrupt", "investment",
    "financial", "wall street", "trading", "yield", "bond",
    "treasury", "commodity", "oil", "gold", "energy", "banking",
    # 日本語
    "市場", "株価", "経済", "インフレ", "景気後退", "リセッション", "金利",
    "利上げ", "利下げ", "中央銀行", "日銀", "FRB", "ECB", "通貨", "為替",
    "円安", "円高", "ドル", "暗号資産", "仮想通貨", "ビットコイン",
    "決算", "貿易", "関税", "債務", "破産", "倒産", "投資",
    "金融", "ウォール街", "国債", "利回り", "コモディティ", "原油", "銀行",
]

# ============================================================
# リスクレベル定義
# ============================================================

RISK_LEVELS = {
    "critical": {
        "label": "Critical",
        "label_ja": "危機的",
        "color": "#EF4444",
        "description": "武力衝突・大規模テロ・核関連の重大事態",
    },
    "high": {
        "label": "High",
        "label_ja": "高リスク",
        "color": "#F97316",
        "description": "軍事的緊張・制裁強化・大規模抗議活動",
    },
    "medium": {
        "label": "Medium",
        "label_ja": "中リスク",
        "color": "#EAB308",
        "description": "外交上の摩擦・経済的不安定・政治的混乱",
    },
    "low": {
        "label": "Low",
        "label_ja": "低リスク",
        "color": "#22C55E",
        "description": "監視対象のイベント・潜在的リスク要因",
    },
}

# ============================================================
# Gemini API プロンプトテンプレート
# ============================================================

ANALYSIS_PROMPT = """あなたは地政学リスクの専門アナリストです。以下のニュース情報を分析し、日本語で地政学リスクレポートを作成してください。

## 入力ニュース情報
{news_data}

## 出力形式（JSON）
以下のJSON形式で出力してください。マークダウンの```json```タグは不要です。

{{
  "date": "YYYY-MM-DD",
  "summary": "本日の地政学リスク概況（200文字程度）",
  "overall_risk_level": "critical|high|medium|low",
  "articles": [
    {{
      "title": "記事タイトル",
      "region": "east_asia|southeast_asia|south_asia|central_asia|middle_east|europe|africa|north_america|south_america",
      "risk_level": "critical|high|medium|low",
      "summary": "概要（100文字程度）",
      "analysis": "詳細分析（300-500文字）。背景、影響、今後の見通しを含める",
      "key_entities": ["関連する国家・組織・人物のリスト"],
      "sources": ["情報源のリスト"],
      "source_types": ["media|government|research|international_org"]
    }}
  ],
  "region_risk_map": {{
    "east_asia": "critical|high|medium|low|none",
    "southeast_asia": "critical|high|medium|low|none",
    "south_asia": "critical|high|medium|low|none",
    "central_asia": "critical|high|medium|low|none",
    "middle_east": "critical|high|medium|low|none",
    "europe": "critical|high|medium|low|none",
    "africa": "critical|high|medium|low|none",
    "north_america": "critical|high|medium|low|none",
    "south_america": "critical|high|medium|low|none"
  }}
}}

## 分析ガイドライン
- 事実に基づいた客観的な分析を行ってください
- 情報源の信頼度を考慮してください（政府機関・国際機関 > 研究機関 > メディア）
- リスクレベルは慎重に判定してください
- 複数の情報源が同じ事象を報じている場合は、信頼度が高いと判断してください
- 最大10件の記事を生成してください
- 各地域のリスクレベルは、その地域に関する記事のリスクレベルの最大値を設定してください
"""

FINANCIAL_ANALYSIS_PROMPT = """あなたは金融・経済リスクの専門アナリストです。以下の金融関連ニュース情報を分析し、日本語で金融リスクレポートを作成してください。

## 入力ニュース情報
{news_data}

## 出力形式（JSON）
以下のJSON形式で出力してください。マークダウンの```json```タグは不要です。

{{
  "date": "YYYY-MM-DD",
  "summary": "本日の金融・経済リスク概況（200文字程度）",
  "overall_risk_level": "critical|high|medium|low",
  "articles": [
    {{
      "title": "記事タイトル",
      "region": "global|north_america|europe|east_asia|south_america|africa|middle_east",
      "risk_level": "critical|high|medium|low",
      "summary": "概要（100文字程度）",
      "analysis": "詳細分析（300-500文字）。市場への影響、今後の見通しを含める",
      "key_entities": ["関連する中央銀行・企業・経済指標のリスト"],
      "sources": ["情報源のリスト"],
      "source_types": ["media|government|research|international_org"]
    }}
  ],
  "region_risk_map": {{
    "global": "critical|high|medium|low|none",
    "north_america": "critical|high|medium|low|none",
    "europe": "critical|high|medium|low|none",
    "east_asia": "critical|high|medium|low|none"
  }}
}}

## 分析ガイドライン
- 事実に基づいた客観的な分析を行ってください
- 金利政策、インフレ指標、市場のボラティリティ、暗号資産規制などの要素を重視してください
- 複数の情報源が同じ事象を報じている場合は、信頼度が高いと判断してください
- 最大10件の記事を生成してください
- 各地域/市場のリスクレベルは、その地域に関する記事のリスクレベルの最大値を設定してください
"""
