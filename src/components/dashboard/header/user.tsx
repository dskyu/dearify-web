"use client";

import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Link } from "@/i18n/navigation";
import { User } from "@/types/user";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { NavItem } from "@/types/blocks/base";

export default function SignUser({ user }: { user: User }) {
  const t = useTranslations();

  const dropdownItems: NavItem[] = [
    {
      title: user.nickname,
    },
    {
      title: t("user.user_center"),
      url: "/my-orders",
    },
    {
      title: t("user.admin_system"),
      url: "/admin/users",
    },
    {
      title: t("user.sign_out"),
      onClick: () => signOut(),
    },
  ];

  // Default avatar image
  const defaultAvatar = "/imgs/users/2.png";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer h-8 w-8">
          <AvatarImage src={user.avatar_url || defaultAvatar} alt={user.nickname} />
          <AvatarFallback className="text-xs">{user.nickname}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-background" align="end">
        {dropdownItems.map((item, index) => (
          <React.Fragment key={index}>
            <DropdownMenuItem className="cursor-pointer">
              {item.url ? (
                <Link href={item.url as any} target={item.target} className="w-full">
                  {item.title}
                </Link>
              ) : (
                <button onClick={item.onClick} className="w-full text-left">
                  {item.title}
                </button>
              )}
            </DropdownMenuItem>
            {index !== dropdownItems.length - 1 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
