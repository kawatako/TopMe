// components/rankings/RankingDetailView.tsx
"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import type { RankingListViewData } from "@/lib/types";
import { UsersIcon, CrownIcon, Trophy } from "@/components/Icons";
import Link from "next/link";
import CommentSection from "./CommentSection";
import { ShareButton } from "@/components/rankings/ShareButton";
import { RankingLikeButton } from "@/components/likes/rankingLikeButton";

interface Props {
  ranking: RankingListViewData;
  isOwner: boolean;
}

export function RankingDetailView({ ranking, isOwner }: Props) {
  const [tab, setTab] = useState<string>("ranking");
  const pathname = usePathname();
  const shareUrl =
    typeof window !== "undefined" ? window.location.origin + pathname : "";

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h2 className='text-2xl md:text-3xl font-bold mb-4 text-center sm:text-left'>
        {ranking.subject}{" "}
        <span className='text-xl font-normal text-muted-foreground'>
          TOP {ranking._count?.items ?? 0}
        </span>
      </h2>
      {/* 説明 */}
      {ranking.description && (
        <p className='mb-6 text-muted-foreground'>{ranking.description}</p>
      )}

      {/* エンゲージメント */}
      <div className='flex gap-4 mb-8 items-center'>
        <RankingLikeButton
          listId={ranking.id}
          likeCount={ranking.likeCount}
          initialLiked={ranking.isLikedByCurrentUser}
          title="いいね"
       />
        <Link href={`/trends/average/${encodeURIComponent(ranking.subject)}`} title="みんなのランキングを見る">
          <UsersIcon className='h-5 w-5' />
        </Link>
        <Link href={`/rankings/create`} title="ランキングを作成する">
          <CrownIcon className='h-5 w-5' />
        </Link>
        <ShareButton
          subject={ranking.subject}
          tags={ranking.rankingListTags}
          url={shareUrl}
          title='ランキングをシェア'
        />
      </div>

      {/* タブ */}
      <Tabs value={tab} onValueChange={setTab} className='w-full'>
        <TabsList className='grid grid-cols-2 mb-6'>
          <TabsTrigger value='ranking'>ランキング</TabsTrigger>
          <TabsTrigger value='comments'>コメント</TabsTrigger>
        </TabsList>

        {/* ランキングタブ */}
        <TabsContent value='ranking'>
          <div className='space-y-4'>
            {ranking.items.map((item) => (
              <Card
                key={item.id}
                className='rounded-lg shadow-md overflow-hidden'
              >
                <CardContent className='flex items-center p-4'>
                  {/* ①🏆＋順位 */}
                  <div className='flex items-center justify-center w-12'>
                    <Trophy
                      className={`h-6 w-6 ${
                        item.rank === 1
                          ? "text-yellow-500"
                          : item.rank === 2
                          ? "text-gray-400"
                          : item.rank === 3
                          ? "text-amber-600"
                          : "text-gray-500"
                      }`}
                    />
                    <span className='ml-1 font-bold'>{item.rank}</span>
                  </div>

                  {/* ②アイテム画像エリア（画像がなくてもスペースは確保） */}
                  <div className='relative w-16 h-16 mx-4 flex-shrink-0'>
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.itemName}
                        fill
                        className='object-cover rounded'
                      />
                    ) : (
                      /* 何も表示しないか、グレーのプレースホルダーにする */
                      <div className='w-full h-full bg-gray-100 rounded' />
                    )}
                  </div>

                  {/* ③タイトル＋説明 */}
                  <div className='flex-1'>
                    <h4 className='font-semibold'>{item.itemName}</h4>
                    {item.itemDescription && (
                      <p className='text-sm text-muted-foreground'>
                        {item.itemDescription}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* タグ */}
          {ranking.rankingListTags.length > 0 && (
            <div className='mt-8'>
              <h3 className='font-medium mb-2'>タグ</h3>
              <div className='flex flex-wrap gap-2'>
                {ranking.rankingListTags.map((t) => (
                  <Badge key={t.tag.id} variant='outline'>
                    {t.tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* コメントタブ */}
        <TabsContent value='comments'>
          <CommentSection listId={ranking.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
