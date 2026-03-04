# 🚀 運用・デプロイ ガイド (GeoRisk Alert)

本ドキュメントでは、AIエージェントによる地政学リスク情報ダッシュボードを自動運用するための、APIキーの取得方法からGitHubおよびVercelへの設定手順を解説します。

---

## 🔑 1. Gemini APIキーの取得

システムの中核を担うAI分析には、Googleの「Gemini API」を使用します。

1. **Google AI Studio にアクセス**
   - [Google AI Studio](https://aistudio.google.com/) にGoogleアカウントでログインします。
2. **APIキーの作成**
   - 左側のメニューから「Get API key」をクリックします。
   - 「Create API key」ボタンを押し、新しいプロジェクトでAPIキーを生成します。
3. **APIキーのコピー**
   - 生成された文字列（例: `AIzaSy...`）をコピーし、安全な場所に保管してください。
   - （※このキーは誰にも教えないでください）

---

## ⚙️ 2. GitHub Actions (自動データ更新) の設定

収集スクリプトを毎日自動実行させるために、GitHubリポジトリのSecretsにAPIキーを登録します。

1. **GitHubリポジトリの設定画面へ**
   - 自分のリポジトリ（`kazuhirotaga/Geopolitical-Risk-Alert`）を開きます。
   - 上部タブの右側にある **「Settings（歯車アイコン）」** をクリックします。
2. **Secretsの追加画面を開く**
   - 左側サイドバーを下にスクロールし、**「Secrets and variables」** > **「Actions」** を選びます。
3. **APIキーを登録**
   - 「New repository secret」という緑色のボタンをクリックします。
   - **Name:** `GEMINI_API_KEY` と入力（大文字・アンダースコア完全一致）
   - **Secret:** 先ほどコピーしたGeminiのAPIキーを貼り付けます
   - 「Add secret」をクリックして保存します。
4. **初回データ生成（手動実行）**
   - 上部タブの **「Actions」** をクリックします。
   - 左側メニューの「Geopolitical Risk Collection & AI Report」をクリックします。
   - 画面右側の「Run workflow」ボタンを押し、そのまま実行します。
   - （約1〜2分でデータ収集とAI執筆が完了し、新しいデータがリポジトリに保存されます）

---

## 🌐 3. Vercel へのデプロイ手順

Next.jsフロントエンドをインターネット上に公開するための手順です。

1. **Vercel にログイン**
   - [Vercel](https://vercel.com/) にGitHubアカウントを使ってログイン（無料のHobbyプランでOK）します。
2. **プロジェクトの追加**
   - ダッシュボード右上の「Add New...」>「Project」をクリックします。
3. **リポジトリのインポート**
   - GitHubリポジトリ一覧から `Geopolitical-Risk-Alert` を見つけて「Import」をクリックします。
4. **デプロイ設定**
   - プロジェクト名: そのままでOK（例: `geopolitical-risk-alert`）
   - Framework Preset: **Next.js** が自動選択されていることを確認
   - その他はデフォルトのままで問題ありません。**（※フロントエンドビルドにはGemini APIキーは不要なので、Environment Variablesの追加は不要です）**
5. **デプロイの実行**
   - 「Deploy」ボタンをクリックします。
   - 約1分ほどでビルドと公開が完了します！

---

### 💡 運用について
- 以降は、毎日JST 9:00と21:00にGitHub Actionsが自動でニュースを収集・分析し、データ（JSON）を更新してGitHubにプッシュされます。
- GitHubにプッシュされると、Vercelがそれを検知して**自動的に最新のサイトを再ビルド・再公開**します。
- そのため、一度設定を完了すれば**完全自動の運用（放置）**が可能になります。
