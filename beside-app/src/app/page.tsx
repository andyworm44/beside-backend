import Link from 'next/link'
import { Heart, Shield, Smartphone } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <nav className="w-full px-6 py-6 flex justify-center items-center">
        <div className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <div className="w-10 h-10 bg-[#FF6B6B] rounded-xl flex items-center justify-center text-white text-xl">
            B
          </div>
          Beside
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="px-6 py-16 sm:py-24 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            在焦慮的時候，<br />
            <span className="text-[#FF6B6B]">總有人陪在你身邊</span>
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed mb-12 max-w-2xl mx-auto">
            Beside 是一個專注於陪伴與支持的社群。<br className="hidden sm:block" />
            我們相信簡單的陪伴，能帶來最溫暖的力量。
          </p>
          
          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20 text-left">
            <div className="p-8 rounded-3xl bg-gray-50">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-[#FF6B6B]">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">溫暖陪伴</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                無論何時何地，發出信號，就能收到來自他人的溫暖回應。
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-[#FF6B6B]">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">簡單易用</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                直覺的介面設計，不需要複雜的操作，只需專注於當下的感受。
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 text-[#FF6B6B]">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">隱私安全</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                我們嚴格保護您的個人隱私與數據安全，讓您可以安心使用。
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-6">
          <div className="flex gap-8 text-sm text-gray-500 font-medium">
            <Link href="/privacy" className="hover:text-[#FF6B6B] transition-colors">隱私權政策</Link>
            <Link href="/terms" className="hover:text-[#FF6B6B] transition-colors">使用者條款</Link>
          </div>
          <div className="text-xs text-gray-400">
            © {new Date().getFullYear()} Beside. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
