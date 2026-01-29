"use client"

export function setAuthCookie(token: string) {
  if (typeof document !== "undefined") {
    document.cookie = `auth_token=${token}; path=/; max-age=86400; samesite=strict`
  }
}

export function getAuthCookie(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(/auth_token=([^;]+)/)
  return match ? match[1] : null
}

export function clearAuthCookie() {
  if (typeof document !== "undefined") {
    document.cookie = "auth_token=; path=/; max-age=0"
  }
}
