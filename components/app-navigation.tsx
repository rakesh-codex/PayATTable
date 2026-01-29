"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface AppNavigationProps {
  showBack?: boolean
  showHome?: boolean
  title?: string
}

export function AppNavigation({ showBack = true, showHome = true, title }: AppNavigationProps) {
  const router = useRouter()

  return (
    <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {showBack && (
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Go back</span>
            </Button>
          )}
          {title && <h1 className="text-lg font-semibold truncate">{title}</h1>}
        </div>

        {showHome && (
          <Link href="/">
            <Button variant="ghost" size="icon">
              <Home className="h-5 w-5" />
              <span className="sr-only">Go home</span>
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
