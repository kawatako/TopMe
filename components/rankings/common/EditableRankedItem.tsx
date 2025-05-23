// components/rankings/common/EditableRankedItem.tsx
"use client";

import React, { useRef, useState, ChangeEvent, FC } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  ImagePlus,
  TrashIcon,
  XIcon,
  GripVertical,
  ChevronsUpDown,
} from "@/components/Icons";
import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Combobox } from "@headlessui/react";
import { useItemSuggestions } from "@/lib/hooks/useItemSuggestions";

// EditableItem: アイテム編集時に必要なフィールド型
export type EditableItem = {
  clientId: string;
  id?: string;
  itemName: string;
  itemDescription?: string | null;
  imagePath?: string | null;
  previewUrl?: string | null;
  imageFile?: File | null;
};

interface Props {
  subject: string;
  clientId: string;
  item: EditableItem;
  index: number;
  handleItemChange: (
    clientId: string,
    field: keyof Omit<
      EditableItem,
      "clientId" | "id" | "imageFile" | "previewUrl" | "imagePath"
    >,
    value: string | null
  ) => void;
  handleDeleteItem: (clientId: string) => void;
  handleItemImageChange: (clientId: string, file: File | null) => void;
  isSaving: boolean;
}

// EditableRankedItem: 各ランキングアイテム行の編集・削除・並び替えハンドラを提供するコンポーネント
export const EditableRankedItem: FC<Props> = ({
  subject,
  clientId,
  item,
  index,
  handleItemChange,
  handleDeleteItem,
  handleItemImageChange,
  isSaving,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: clientId });

  // 入力中クエリ、候補取得フラグ、エラー状態
  const [itemQuery, setItemQuery] = useState(item.itemName);
  const [suggestEnabled, setSuggestEnabled] = useState(false);
  const [itemNameError, setItemNameError] = useState<string | null>(null);

  // suggestEnabledがtrueのときのみフェッチ
  const { options: itemOptions, isLoading: isItemLoading } =
    useItemSuggestions(subject, itemQuery, suggestEnabled);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };
  const itemImageInputRef = useRef<HTMLInputElement>(null);

  // ファイル選択時にプレビューを更新
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleItemImageChange(clientId, file);
    e.target.value = "";
  };
  // 画像削除時に呼ばれる
  const onRemoveImage = () => {
    handleItemImageChange(clientId, null);
    if (itemImageInputRef.current) itemImageInputRef.current.value = "";
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex flex-col sm:flex-row items-start gap-3 p-3 bg-secondary/50 dark:bg-secondary/30 rounded relative border"
    >
      {/* 1行目：ドラッグ＆順位＆画像 */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          {...listeners}
          className="cursor-grab p-1 text-muted-foreground hover:text-foreground"
          title="ドラッグして並び替え"
          type="button"
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <span className="font-semibold w-8 text-center text-muted-foreground">
          {`${index + 1}位`}
        </span>
        <div className="flex-shrink-0">
          {item.previewUrl ? (
            <div className="relative w-20 h-20 rounded border bg-muted">
              <Image
                src={item.previewUrl}
                alt={`${item.itemName || "Item"} preview`}
                fill
                className="object-cover rounded"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full z-10"
                onClick={onRemoveImage}
                disabled={isSaving}
                title="画像削除"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-20 h-20 flex flex-col items-center justify-center text-muted-foreground bg-background"
              onClick={() => itemImageInputRef.current?.click()}
              disabled={isSaving}
            >
              <ImagePlus className="h-6 w-6 mb-1" />
              <span className="text-xs">画像選択</span>
            </Button>
          )}
          <input
            type="file"
            accept="image/*"
            ref={itemImageInputRef}
            onChange={onFileChange}
            className="hidden"
            disabled={isSaving}
          />
        </div>
      </div>

      {/* 2行目：アイテム名＆説明＆削除ボタン */}
      <div className="flex flex-col sm:flex-row items-start gap-3 w-full">
        <div className="flex-1 space-y-1">
          <Combobox
            value={item.itemName}
            onChange={(val: string) => {
              // 直接選択時にもエラーリセット
              if (val.length > 50) {
                setItemNameError("アイテム名は50字以内で入力してください。");
              } else {
                setItemNameError(null);
              }
              handleItemChange(clientId, "itemName", val);
              setItemQuery(val);
            }}
          >
            <div className="relative">
              <Combobox.Input
                className="w-full bg-background font-medium"
                placeholder={`${index + 1}位のアイテム名*`}
                value={itemQuery}
                maxLength={50}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v.length > 50) {
                    setItemNameError("アイテム名は50字以内で入力してください。");
                  } else {
                    setItemNameError(null);
                  }
                  setItemQuery(v);
                  handleItemChange(clientId, "itemName", v);
                }}
                displayValue={() => item.itemName}
                disabled={isSaving}
                onFocus={() => subject && setSuggestEnabled(true)}
              />
              {itemNameError && (
                <p className="text-xs text-red-500 mt-1">{itemNameError}</p>
              )}
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronsUpDown className="h-5 w-5 text-muted-foreground" />
              </Combobox.Button>
              <Combobox.Options className="absolute z-10 mt-1 w-full bg-popover shadow-md max-h-60 overflow-auto rounded-md">
                {isItemLoading && <div className="p-2">読み込み中…</div>}
                {!isItemLoading && itemOptions.length === 0 && (
                  <div className="p-2 text-muted-foreground">該当なし</div>
                )}
                {itemOptions.map((opt) => (
                  <Combobox.Option
                    key={opt}
                    value={opt}
                    className={({ active }) =>
                      `cursor-pointer select-none p-2 ${
                        active ? "bg-primary text-primary-foreground" : ""
                      }`
                    }
                  >
                    {opt}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            </div>
          </Combobox>
          <Textarea
            value={item.itemDescription ?? ""}
            onChange={(e) =>
              handleItemChange(clientId, "itemDescription", e.target.value)
            }
            placeholder="アイテムの説明・コメント（任意）"
            rows={2}
            maxLength={300}
            className="text-sm bg-background"
            disabled={isSaving}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDeleteItem(clientId)}
          disabled={isSaving}
          className="self-start mt-1 text-muted-foreground hover:text-destructive"
          title="アイテム削除"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
};
