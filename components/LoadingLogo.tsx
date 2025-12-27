"use client";

import Image from "next/image";

export default function LoadingLogo({
  size = 85,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className={`animate-spin ${className}`}>
        <Image
          src="/logo.png"
          alt="Loading Logo"
          width={size}
          height={size}
          priority
        />
      </div>
    </div>
  );
}
