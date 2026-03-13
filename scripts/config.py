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

# 戦闘log用 / 軍事ニュースデータソース
COMBAT_DATA_SOURCES = [
    {
        "name": "ISW - Ukraine",
        "url": "https://understandingwar.org/rss.xml",
        "type": "research",
        "language": "en",
        "region_focus": "europe",
    },
    {
        "name": "AFPBB - 軍事",
        "url": "https://www.afpbb.com/category/military/rss",
        "type": "media",
        "language": "ja",
        "region_focus": "global",
    },
    {
        "name": "Defense News",
        "url": "https://www.defensenews.com/arc/outboundfeeds/rss/category/global/",
        "type": "media",
        "language": "en",
        "region_focus": "global",
    },
    {
        "name": "Critical Threats Project",
        "url": "https://www.criticalthreats.org/rss/all",
        "type": "research",
        "language": "en",
        "region_focus": "middle_east",
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
# ステートメント（要人発言）設定
# ============================================================

# 発言トラッキング用ソース
STATEMENTS_DATA_SOURCES = [
    {
        "name": "White House Briefing Room",
        "url": "https://www.whitehouse.gov/briefing-room/feed/",
        "type": "government",
        "language": "en",
        "region_focus": "north_america",
    },
    {
        "name": "Federal Reserve - Press Releases",
        "url": "https://www.federalreserve.gov/feeds/press_all.xml",
        "type": "government",
        "language": "en",
        "region_focus": "north_america",
    },
    {
        "name": "European Council - Press Releases",
        "url": "https://www.consilium.europa.eu/en/press/press-releases/rss/",
        "type": "international_org",
        "language": "en",
        "region_focus": "europe",
    },
    {
        "name": "Japan PM Office - Speeches",
        "url": "https://www.kantei.go.jp/jp/r_koho/speech.xml",
        "type": "government",
        "language": "ja",
        "region_focus": "east_asia",
    },
    {
        "name": "Reuters - Politics",
        "url": "https://rsshub.app/reuters/world/politics",
        "type": "media",
        "language": "en",
        "region_focus": "global",
    },
    {
        "name": "Axios - Politics",
        "url": "https://api.axios.com/feed/politics/",
        "type": "media",
        "language": "en",
        "region_focus": "north_america",
    },
]

# 発言抽出用キーワード
STATEMENTS_KEYWORDS = [
    "said", "stated", "announced", "warned", "called for", "reiterated", "urged",
    "speech", "remarks", "testimony", "briefing", "press conference",
    "発言", "述べた", "表明", "発表", "指摘", "強調", "会見", "声明", "演説",
]

STATEMENTS_ANALYSIS_PROMPT = """あなたは政治・経済の要人発言を分析する専門アナリストです。
入力されるニュース情報から、大統領、政府高官、中央銀行総裁（FRB議長など）、主要企業CEOなどの「重要な発言」を抽出し、日本語でレポートを作成してください。

## 入力ニュース情報
{news_data}

## 出力形式（JSON）
以下のJSON形式で出力してください。マークダウンの```json```タグは不要です。

{{
  "date": "YYYY-MM-DD",
  "summary": "本日の要人発言の全体的な傾向、市場や政治への影響（150文字程度）",
  "statements": [
    {{
      "speaker": "発言者の氏名（例：ジョー・バイデン）",
      "title": "発言者の肩書き（例：米大統領）",
      "quote": "要約された発言の核心部分。直接話法に近い形式が望ましい",
      "context": "発言の背景や場所（例：ホワイトハウスでの記者会見、議会証言など）",
      "analysis": "この発言が持つ意味、政治的・経済的影響の分析（200文字程度）",
      "importance": "critical|high|medium|low",
      "tags": ["関連トピックのタグ"],
      "source_url": "ニュースのURL"
    }}
  ]
}}

## 分析ガイドライン
- 伝聞ではなく、本人の実際の発言内容を特定して抽出してください
- 発言の重要度（importance）を、世界情勢や市場への影響度に基づいて判定してください
- 最大8件の発言を抽出してください
- 発言者の肩書きは正確に記載してください
"""

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

COMBAT_LOG_ANALYSIS_PROMPT = """あなたは軍事・紛争分析の専門家（OSINTアナリスト）です。
入力されるニュース・レポートから、具体的な「戦闘事象（Combat events）」を抽出し、タイムライン形式のログとして日本語で出力してください。

## 入力情報
{news_data}

## 出力形式（JSON）
以下のJSON形式で１つのオブジェクトとして出力してください。

{{
  "date": "YYYY-MM-DD",
  "summary": "本日の戦闘概況（150文字程度）",
  "events": [
    {{
      "id": "一意の文字列",
      "timestamp": "ISO形式の時刻（不明な場合は日付のみ）",
      "location": "地名（例：ウクライナ・ドネツク州バフムト）",
      "region": "east_asia|middle_east|europe|etc",
      "title": "事象のタイトル（例：ロシア軍によるミサイル攻撃）",
      "content": "具体的な戦闘内容、損害状況、勢力の動きなど（200文字程度）",
      "involved_parties": ["ロシア軍", "ウクライナ軍"],
      "event_type": "bombing|clash|occupy|retreat|cyber|other",
      "urgency": "critical|high|medium|low",
      "source_name": "情報源名",
      "source_url": "URL"
    }}
  ]
}}

## 分析ガイドライン
- 噂や憶測ではなく、複数のソースや信頼できる機関が報じている「具体的な動き」を優先してください
- 攻撃、占領、撤退、停戦協定などの明確なイベントを抽出してください
- 最大15件の重要イベントを抽出してください
- 誇張を避け、淡々と事実関係を記述してください
"""

# ============================================================
# パニック状況分析用設定
# ============================================================

PANIC_DATA_SOURCES = [
    {
        "name": "Google News - Panic & Social Unrest",
        "url": "https://news.google.com/rss/search?q=panic+OR+unrest+OR+shortage+OR+bank+run+OR+riot+OR+protest+when:24h&hl=en-US&gl=US&ceid=US:en",
        "type": "media",
        "language": "en",
        "region_focus": "global",
    },
    {
        "name": "Google News - 食料不足・暴動",
        "url": "https://news.google.com/rss/search?q=食料不足+OR+暴動+OR+取り付け騒ぎ+OR+デモ+when:24h&hl=ja&gl=JP&ceid=JP:ja",
        "type": "media",
        "language": "ja",
        "region_focus": "global",
    }
]

PANIC_ANALYSIS_PROMPT = """あなたは社会心理学と危機管理の専門アナリストです。
世界各地で発生している「パニック」や「社会不安」に関する情報を分析し、各国のパニック状況を数値化・レポートしてください。
対象となる事象は、食料・エネルギー不足、銀行の取り付け騒ぎ、大規模な抗議デモ、略奪、買いだめ、逃避行などです。

## 入力ニュース情報
{news_data}

## 出力形式（JSON）
以下のJSON形式で出力してください。

{{
  "date": "YYYY-MM-DD",
  "summary": "世界全体のパニック・社会不安の概況（200文字程度）",
  "global_panic_index": 0-100の数値（世界全体の緊迫度）,
  "regions": [
    {{
      "region": "europe|north_america|east_asia|middle_east|africa|south_america|southeast_asia",
      "panic_index": 0-100の数値,
      "status": "normal|stable|unstable|volatile|critical(危険・パニック状態)",
      "main_cause": "パニックの主な原因（例：食料不足、金融不安など）",
      "incidents": [
        {{
          "title": "事象のタイトル",
          "location": "地名（国名・都市名）",
          "severity": 0-100の数値,
          "description": "具体的なパニック状況の説明（150文字程度）",
          "source": "情報源名"
        }}
      ]
    }}
  ]
}}

## 分析ガイドライン
- 事実に基づき、社会心理的なパニック度を客観的に評価してください
- 単なる「抗議」と、社会秩序が崩壊しかけている「パニック」を区別してください
- パニック指数(0-100)の目安:
  - 0-20: 安定（平時）
  - 21-40: 軽微な不安（噂や小規模なデモ） 
  - 41-60: 不安の増大（一部商品の中不足、全国的なデモ）
  - 61-80: 警戒状態（買いだめ、銀行への列、一部暴徒化）
  - 81-100: パニック（社会インフラのマヒ、略奪、無秩序な逃避）
- 各地域について最大5件の重要なパニック事象を抽出してください
"""
