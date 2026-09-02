"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  name?: string | null;
  image?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const SIZES = {
  sm: { box: "h-7 w-7 text-[0.625rem]", img: 28 },
  md: { box: "h-8 w-8 text-[0.6875rem]", img: 32 },
  lg: { box: "h-10 w-10 text-[0.8125rem]", img: 40 },
  xl: { box: "h-12 w-12 text-[1rem]", img: 48 },
};

const getInitials = (name?: string | null) => {
  if (!name) return "U";
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "U"
  );
};

export default function UserAvatar({
  name,
  image,
  size = "md",
  className,
}: UserAvatarProps) {
  const currentSize = SIZES[size];

  if (image) {
    return (
      <span
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full border border-line bg-well shadow-sm inline-block",
          currentSize.box,
          className
        )}
      >
        <Image
          src={image}
          alt={name || "User avatar"}
          width={currentSize.img}
          height={currentSize.img}
          className="h-full w-full object-cover"
          unoptimized
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-accent-wash font-bold text-accent-deep border border-accent-edge shadow-sm select-none",
        currentSize.box,
        className
      )}
      title={name || "User"}
    >
      <span className="font-semibold">{getInitials(name)}</span>
    </span>
  );
}
