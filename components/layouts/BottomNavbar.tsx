// components/layouts/BottomNavbar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  SearchIcon,
  TrendingUpIcon,
  CrownIcon,
  BellIcon,
  UserIcon,
  UsersIcon,
} from "@/components/Icons";

interface NavItem {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // ← JSX.Element を使わない
  label: string;
  isProfile?: boolean;
  isFollows?: boolean;
}

interface UserData {
  id: string;
  username: string | null;
  image: string | null;
}

interface BottomNavbarProps {
  currentLoginUserData: UserData | null;
}

export default function BottomNavbar({
  currentLoginUserData,
}: BottomNavbarProps) {
  const pathname = usePathname();

  const profileHref = currentLoginUserData?.username
    ? `/profile/${currentLoginUserData.username}`
    : "/profile";
  const followsHref = currentLoginUserData?.username
    ? `/follows/${currentLoginUserData.username}`
    : "/follows";

  const navItems: NavItem[] = [
    { href: "/", icon: HomeIcon, label: "ホーム" },
    { href: "/trends", icon: TrendingUpIcon, label: "トレンド" },
    { href: "/rankings/create", icon: CrownIcon, label: "ランキング作成" },
    { href: "#", icon: BellIcon, label: "通知" },
    { href: followsHref, icon: UsersIcon, label: "フォロー", isFollows: true },
    { href: profileHref, icon: UserIcon, label: "プロフィール", isProfile: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t bg-background flex items-center justify-around md:hidden">
      {navItems.map((item) => {
        const isActive = item.isProfile
          ? pathname.startsWith("/profile")
          : item.isFollows
          ? pathname.startsWith("/follows")
          : pathname === item.href;

        const IconComponent = item.icon;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 p-2 h-full rounded-md transition-colors ${
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <IconComponent className={`h-6 w-6 ${isActive ? "fill-current" : ""}`} />
          </Link>
        );
      })}
    </nav>
  );
}
