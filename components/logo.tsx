"use client"

import Link from "next/link"
import Image from "next/image"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <Image
        src="/images/logo.png"
        alt="Goroada"
        width={240}
        height={70}
        className="h-20 md:h-24"
        style={{ width: "auto" }}
        priority
      />
    </Link>
  )
}

export function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/images/logo.png"
      alt="Goroada"
      width={32}
      height={32}
      className={className}
    />
  )
}
