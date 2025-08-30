import Link from 'next/link'

export default function ExpensesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          💰 휘슬러 여행 실제 비용
        </h1>
        <p className="text-xl text-gray-600">
          실제로 사용한 모든 비용을 상세히 정리했습니다
        </p>
      </header>

      {/* Navigation */}
      <nav className="flex justify-center mb-8">
        <div className="flex space-x-4">
          <Link 
            href="/" 
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            🏠 홈으로
          </Link>
          <Link 
            href="/gallery" 
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            📸 갤러리
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        {/* Total Cost Summary */}
        <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            📊 총 비용 요약
          </h2>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg text-center">
            <div className="text-5xl font-bold mb-2">CAD 244.50</div>
            <div className="text-xl">약 ₩245,000</div>
            <div className="text-sm mt-2 opacity-90">
              휘슬러 마운틴 바이킹 1일 여행
            </div>
          </div>
        </section>

        {/* Detailed Expense Breakdown */}
        <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            📋 상세 비용 내역
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left">항목</th>
                  <th className="border border-gray-300 px-4 py-3 text-left">설명</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">금액 (CAD)</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">금액 (₩)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-semibold">반나절권</td>
                  <td className="border border-gray-300 px-4 py-3">3:30-7:30 시간대 이용권</td>
                  <td className="border border-gray-300 px-4 py-3 text-right">94.50</td>
                  <td className="border border-gray-300 px-4 py-3 text-right">94,500</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-semibold">보호장비 렌탈</td>
                  <td className="border border-gray-300 px-4 py-3">헬멧, 장갑, 무릎, 팔꿈치 보호대</td>
                  <td className="border border-gray-300 px-4 py-3 text-right">45.00</td>
                  <td className="border border-gray-300 px-4 py-3 text-right">45,000</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-semibold">주차비</td>
                  <td className="border border-gray-300 px-4 py-3">휘슬러 주차장</td>
                  <td className="border border-gray-300 px-4 py-3 text-right">25.00</td>
                  <td className="border border-gray-300 px-4 py-3 text-right">25,000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-semibold">주유비</td>
                  <td className="border border-gray-300 px-4 py-3">밴쿠버-휘슬러 왕복</td>
                  <td className="border border-gray-300 px-4 py-3 text-right">60.00</td>
                  <td className="border border-gray-300 px-4 py-3 text-right">60,000</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 font-semibold">기타 비용</td>
                  <td className="border border-gray-300 px-4 py-3">음료, 간식 등</td>
                  <td className="border border-gray-300 px-4 py-3 text-right">20.00</td>
                  <td className="border border-gray-300 px-4 py-3 text-right">20,000</td>
                </tr>
                <tr className="bg-blue-100 font-bold">
                  <td className="border border-gray-300 px-4 py-3">총계</td>
                  <td className="border border-gray-300 px-4 py-3">휘슬러 마운틴 바이킹 1일</td>
                  <td className="border border-gray-300 px-4 py-3 text-right">244.50</td>
                  <td className="border border-gray-300 px-4 py-3 text-right">244,500</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Cost Analysis */}
        <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            📈 비용 분석
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">가장 큰 비용</h3>
              <p className="text-2xl font-bold text-blue-600">반나절권</p>
              <p className="text-sm text-blue-700 mt-1">CAD 94.50 (38.7%)</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">절약 가능</h3>
              <p className="text-2xl font-bold text-green-600">보호장비</p>
              <p className="text-sm text-green-700 mt-1">자체 장비 소지 시 절약</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">예상 비용</h3>
              <p className="text-2xl font-bold text-yellow-600">CAD 200-300</p>
              <p className="text-sm text-yellow-700 mt-1">1일 마운틴 바이킹</p>
            </div>
          </div>
        </section>

        {/* Credit Card Transactions */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            💳 신용카드 거래 내역
          </h2>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-gray-800">휘슬러 블랙콤</h4>
                  <p className="text-sm text-gray-600">2025-08-30 15:30</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">-CAD 139.50</p>
                  <p className="text-sm text-gray-500">반나절권 + 보호장비</p>
                </div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-gray-800">휘슬러 주차장</h4>
                  <p className="text-sm text-gray-600">2025-08-30 14:45</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">-CAD 25.00</p>
                  <p className="text-sm text-gray-500">주차비</p>
                </div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-gray-800">쉘 주유소</h4>
                  <p className="text-sm text-gray-600">2025-08-30 12:15</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">-CAD 60.00</p>
                  <p className="text-sm text-gray-500">주유비</p>
                </div>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-gray-800">휘슬러 상점</h4>
                  <p className="text-sm text-gray-600">2025-08-30 16:30</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">-CAD 20.00</p>
                  <p className="text-sm text-gray-500">음료, 간식</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center mt-12 py-8 border-t border-gray-200">
        <p className="text-gray-600">
          © 2025 휘슬러 마운틴 바이킹 가이드 - 실제 비용 내역
        </p>
        <div className="mt-4 space-x-4">
          <Link href="/" className="text-blue-500 hover:text-blue-600">
            🏠 홈으로
          </Link>
          <Link href="/gallery" className="text-green-500 hover:text-green-600">
            📸 갤러리
          </Link>
        </div>
      </footer>
    </div>
  )
}

