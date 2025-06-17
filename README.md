# TopMe - 自分の"好き"をランキングで伝えるSNS

## 🔍 サービス概要

TopMeは、ユーザーが自由にテーマを設定し、アイテムをランク付けして共有・交流できるSNS型Webアプリケーションです。従来のSNSやランキングサイトとは異なり、「自分で作るランキング」×「インタラクション型SNS」を融合させ、ユニークな好みや価値観を可視化・共有できる体験を提供します。

### 主な特徴

* **テーマ自由なランキング作成・並べ替え（DnD対応）**
* **画像・タグ付き投稿やランキング**
* **タイムライン・フォロー・リツイートなどSNS機能完備**
* **トレンド分析・集計（平均順位）**
* **プロフィールや通知、検索、いいね等で持続的なつながり形成**

🔗 [サービスURL](https://topme.jp)

## 🛠 技術スタック

| 分類         | 使用技術                                                      |
| ---------- | --------------------------------------------------------- |
| フレームワーク    | Next.js 15.3.0 (App Router)                               |
| 言語         | TypeScript 5 / React 19                                   |
| 認証         | Clerk (@clerk/nextjs)                                     |
| DB・ORM     | Supabase PostgreSQL / Prisma + Accelerate                 |
| UI / CSS   | Tailwind CSS 3.4.1, shadcn/ui, Lucide, dnd-kit            |
| 状態管理・データ取得 | SWR, Zod                                                  |
| その他        | Supabase Storage, Svix (Webhook), ESLint, Node.js 20.15.1 |

## 🚀 デプロイ環境

* **フロントエンド**：Vercel
* **バックエンド/DB/Storage**：Supabase

## 📁 ファイル構成（主要）

```
app/
├── api/...
├── feeds/[feedItemId]/page.tsx
├── follows/[username]/page.tsx
├── profile/[username]/...
├── rankings/...
├── search/page.tsx
└── trends/...

components/
├── feeds/
├── rankings/
├── profiles/
├── posts/
└── ui/

lib/
├── actions/
├── data/
├── prisma/
└── utils/

prisma/
├── schema.prisma
└── migrations/

supabase/functions/
└── calculate-trends/index.ts
```

## 🧩 データベース設計（主要モデル）

* **User**：プロフィール情報と全ての関連情報の基軸
* **Post**：画像付きテキスト投稿
* **RankingList / RankedItem**：ランキング本体とそのアイテム群
* **FeedItem**：タイムラインアクティビティモデル
* **Like / Follow / FollowRequest**：インタラクション
* **Trending**\*：トレンド集計結果

## ✅ 実装済み機能

* Clerk認証・プロフィール管理（画像付き）
* 投稿（画像＋テキスト）／ランキング作成・編集
* アイテムDnD並び替え、タグ付け、平均順位表示
* タイムライン（フォロー中＋自身の投稿）表示
* フォロー承認制・一覧／検索・トレンド機能
* いいね・RT・引用RT・下書き保存・フィード
* 検索（タグ・タイトル・アイテム）＋無限スクロール

## 🌏 TopMeが創り出す世界観

| 軸        | TopMeの特長           |
| -------- | ------------------ |
| 好みの価値化   | ランキング形式で推しや趣味を表現   |
| コミュニティ形成 | 同一テーマで繋がる“ミニSNS”体験 |
| データ活用    | 平均順位・トレンドなどの発見性    |
| 直感操作     | DnDで操作が楽しく、参加しやすい  |

## 📈 TopMeと他サービスの比較

| 比較軸    | SNS    | ランキングサイト | TopMe          |
| ------ | ------ | -------- | -------------- |
| 表現形式   | フィード   | 静的ランキング  | 動的ランキング×SNS    |
| 操作性    | 投稿入力   | 閲覧中心     | DnD操作・即時反映     |
| コミュニティ | フォロー   | 一方向      | 同一テーマで議論・発見    |
| 拡散性    | RT/いいね | 低い       | SNSライクなRT・引用RT |

---
