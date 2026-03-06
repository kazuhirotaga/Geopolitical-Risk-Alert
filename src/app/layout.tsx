import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GeoRisk Alert | 地政学リスク情報ダッシュボード",
  description: "AIエージェントが自動収集・分析する世界の地政学的リスク情報ダッシュボード。リアルタイムのリスクレベル評価と詳細分析レポートを提供します。",
  keywords: ["地政学", "リスク", "AI分析", "世界情勢", "安全保障", "geopolitical risk"],
  openGraph: {
    title: "GeoRisk Alert | 地政学リスク情報ダッシュボード",
    description: "AIが自動収集・分析する世界の地政学的リスク情報",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <header className="header">
          <div className="header-inner">
            <a href="/" className="header-logo">
              <span className="pulse-dot"></span>
              GeoRisk Alert
            </a>
            <nav>
              <ul className="header-nav">
                <li><a href="/">地政学リスク</a></li>
                <li><a href="/financial">金融リスク</a></li>
                <li><a href="/articles">記事一覧</a></li>
              </ul>
            </nav>
            <span className="header-updated">Powered by AI Agent</span>
          </div>
        </header>
        <main className="main-container">
          {children}
        </main>
        <footer className="footer">
          <p>GeoRisk Alert — AI駆動の地政学リスク分析プラットフォーム</p>
          <p>情報源: 各国政府機関、国際機関、主要メディアのRSSフィード</p>
          <p>© 2026 GeoRisk Alert. 本サイトの情報はAIによる自動生成です。</p>
        </footer>
      </body>
    </html>
  );
}
