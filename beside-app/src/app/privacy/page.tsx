import Link from 'next/link'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white p-8 md:p-16">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-[#FF6B6B] font-medium mb-8 inline-block hover:underline">
          ← 回到首頁
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">隱私權政策</h1>
        
        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <p className="text-sm text-gray-500">最後更新日期：2025 年 5 月</p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. 引言</h2>
            <p>
              Beside（以下簡稱「我們」）非常重視您的隱私。本隱私權政策說明我們如何收集、使用、披露和保護您的個人資訊。
              使用我們的服務即表示您同意本政策中所述的做法。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. 我們收集的資訊</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>帳戶資訊：</strong> 當您註冊時，我們可能會收集您的電子郵件地址、用戶名稱和密碼。</li>
              <li><strong>個人資料：</strong> 您選擇提供的個人簡介、照片等資訊。</li>
              <li><strong>使用數據：</strong> 關於您如何與我們的應用程式互動的資訊，例如功能使用情況和時間戳記。</li>
              <li><strong>設備資訊：</strong> 設備類型、操作系統版本等技術數據。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. 我們如何使用您的資訊</h2>
            <p>我們使用收集的資訊來：</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>提供、維護和改進我們的服務。</li>
              <li>處理您的帳戶註冊和登入。</li>
              <li>回應您的評論、問題和請求。</li>
              <li>發送技術通知、更新、安全警報和支援訊息。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. 資訊共享</h2>
            <p>
              我們不會將您的個人資訊出售給第三方。我們僅在以下情況下共享資訊：
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>經您同意。</li>
              <li>為了遵守法律義務。</li>
              <li>保護我們的權利、隱私、安全或財產。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. 數據安全</h2>
            <p>
              我們採取合理的措施來保護您的資訊免受遺失、盜竊、濫用和未經授權的訪問。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. 聯絡我們</h2>
            <p>
              如果您對本隱私權政策有任何疑問，請聯繫我們：support@beside.app
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

