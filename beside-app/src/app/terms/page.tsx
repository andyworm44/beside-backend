import Link from 'next/link'

export default function Terms() {
  return (
    <div className="min-h-screen bg-white p-8 md:p-16">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-[#FF6B6B] font-medium mb-8 inline-block hover:underline">
          ← 回到首頁
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">使用者條款</h1>
        
        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <p className="text-sm text-gray-500">最後更新日期：2025 年 5 月</p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. 接受條款</h2>
            <p>
              通過訪問或使用 Beside 應用程式（以下簡稱「服務」），您同意受這些條款的約束。如果您不同意這些條款的任何部分，則不得使用服務。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. 帳戶註冊</h2>
            <p>
              為了使用服務的某些功能，您可能需要註冊帳戶。您同意提供準確、完整和最新的資訊，並對您的帳戶安全負責。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. 用戶行為</h2>
            <p>您同意不會：</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>使用服務進行任何非法目的。</li>
              <li>騷擾、虐待或傷害他人。</li>
              <li>發布虛假、誤導或詐欺性的內容。</li>
              <li>干擾服務的正常運作。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. 內容所有權</h2>
            <p>
              您在服務上發布的內容仍歸您所有。通過發布內容，您授予我們非獨家、免版稅的許可，以使用、複製和展示該內容以提供服務。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. 終止</h2>
            <p>
              我們保留隨時因任何原因（包括違反這些條款）暫停或終止您訪問服務的權利，恕不另行通知。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. 免責聲明</h2>
            <p>
              服務按「現狀」提供，不提供任何形式的保證。我們不保證服務將不中斷、安全或無錯誤。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. 變更</h2>
            <p>
              我們保留隨時修改這些條款的權利。繼續使用服務即表示您接受修改後的條款。
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

