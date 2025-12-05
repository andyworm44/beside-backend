import Link from 'next/link'
import { Heart, Shield, Smartphone, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="w-full px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-sm fixed top-0 z-50 border-b border-gray-100">
        <div className="text-2xl font-bold text-[#FF6B6B] flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B6B] to-[#FF8E8E] rounded-lg flex items-center justify-center text-white">
            B
          </div>
          Beside
        </div>
        <div className="flex gap-6 items-center">
          <Link href="/demo" className="text-gray-600 hover:text-[#FF6B6B] font-medium transition-colors hidden sm:block">
            體驗 Demo
          </Link>
          <Link 
            href="/demo" 
            className="bg-[#FF6B6B] text-white px-6 py-2 rounded-full font-medium hover:bg-[#ff5252] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            立即開始
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow pt-24">
        <section className="relative overflow-hidden px-6 py-20 sm:py-32">
          <div className="absolute inset-0 -z-10 gradient-bg opacity-50" />
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-8">
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
                在焦慮的時候，<br />
                <span className="text-gradient">總有人陪在你身邊</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                簡單的陪伴，溫暖的力量。Beside 是一個專注於陪伴與支持的社群，讓你在需要的時候，不再感到孤單。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/demo" 
                  className="bg-[#FF6B6B] text-white px-8 py-4 rounded-full font-bold text-lg text-center hover:bg-[#ff5252] transition-all shadow-lg hover:shadow-[#ff6b6b]/30 flex items-center justify-center gap-2"
                >
                  免費開始使用 <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="bg-white text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-full font-bold text-lg hover:border-[#FF6B6B] hover:text-[#FF6B6B] transition-all">
                  了解更多
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-[#FF6B6B]/20 to-purple-500/20 rounded-full blur-3xl -z-10" />
              <img 
                src="/file.svg" 
                alt="App Screenshot" 
                className="w-full max-w-sm mx-auto drop-shadow-2xl rounded-[40px] border-8 border-white bg-white h-[600px] object-cover bg-gray-100"
                style={{ content: "url('https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')" }} 
                // Placeholder image for concept
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">為什麼選擇 Beside？</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">我們致力於打造一個安全、溫暖的空間，讓每一份焦慮都能被溫柔接住。</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
              <div className="p-8 rounded-2xl bg-gray-50 hover:bg-[#FFF5F5] transition-colors group">
                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-[#FF6B6B]">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">溫暖陪伴</h3>
                <p className="text-gray-600 leading-relaxed">
                  無論何時何地，發出信號，就能收到來自他人的溫暖回應。讓孤單不再是常態。
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-gray-50 hover:bg-[#FFF5F5] transition-colors group">
                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-[#FF6B6B]">
                  <Smartphone className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">簡單易用</h3>
                <p className="text-gray-600 leading-relaxed">
                  直覺的介面設計，專注於最重要的連結。不需要複雜的操作，只需專注於當下的感受。
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-gray-50 hover:bg-[#FFF5F5] transition-colors group">
                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-[#FF6B6B]">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">隱私安全</h3>
                <p className="text-gray-600 leading-relaxed">
                  我們嚴格保護您的個人隱私與數據安全。在這裡，您可以安心地展現真實的自己。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[#FF6B6B] opacity-10 pattern-dots" />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl font-bold mb-6">準備好開始了嗎？</h2>
            <p className="text-xl text-gray-300 mb-10">加入 Beside，體驗前所未有的溫暖連結。</p>
            <Link 
              href="/demo" 
              className="inline-block bg-white text-gray-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              立即體驗 Demo
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-xl">
             <div className="w-6 h-6 bg-[#FF6B6B] rounded flex items-center justify-center text-white text-xs">B</div>
             Beside
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-[#FF6B6B] transition-colors">隱私權政策</Link>
            <Link href="/terms" className="hover:text-[#FF6B6B] transition-colors">使用者條款</Link>
            <Link href="/demo" className="hover:text-[#FF6B6B] transition-colors">產品預覽</Link>
          </div>
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} Beside. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
