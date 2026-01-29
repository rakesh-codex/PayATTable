import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Store, Smartphone, Lock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(0,0,0,0))]" />
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      <div className="container relative mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Pay@Table ECR System</h1>
            <p className="text-xl text-gray-300">Powered by Geidea Payment Gateway - KSA</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-2 border-purple-500/50 backdrop-blur-xl bg-white/10 shadow-2xl hover:scale-[1.02] transition-transform">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                  <Store className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">Merchant ECR System</CardTitle>
                <CardDescription className="text-gray-300">Restaurant management & QR code generation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-gray-300">
                  <p className="flex items-center gap-2">
                    <span className="text-purple-400">✓</span> Manage tables & orders
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-purple-400">✓</span> Generate payment QR codes
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-purple-400">✓</span> Track payments & tips
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-purple-400">✓</span> View menu & pricing
                  </p>
                </div>
                <Link href="/auth/login">
                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
                    size="lg"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Login to Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500/50 backdrop-blur-xl bg-white/10 shadow-2xl hover:scale-[1.02] transition-transform">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 shadow-lg">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">Customer Payment App</CardTitle>
                <CardDescription className="text-gray-300">Scan QR & pay via secure link</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-gray-300">
                  <p className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Scan table QR code
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> View bill & split payment
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> Pay via secure payment link
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> No card details stored
                  </p>
                </div>
                <Link href="/customer/scan">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg" size="lg">
                    Open Customer App
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card className="backdrop-blur-xl bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Quick Demo Access</CardTitle>
              <CardDescription className="text-gray-300">
                Test the complete payment flow with sample data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/customer/pay/QR-T1-ALNAKHEEL">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20"
                  size="lg"
                >
                  <Smartphone className="mr-2 h-4 w-4" />
                  Customer: Pay at Table T1 (Active Order)
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20"
                  size="lg"
                >
                  <Store className="mr-2 h-4 w-4" />
                  Merchant: Login to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
