import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🏔️ 휘슬러 마운틴 바이킹 가이드
        </h1>
        <p className="text-xl text-gray-600">
          캐나다 휘슬러 마운틴 바이킹 완벽 가이드 - Next.js + Supabase
        </p>
      </header>

      {/* Navigation */}
      <nav className="flex justify-center mb-8">
        <div className="flex space-x-4">
          <Link 
            href="/expenses" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            💰 실제 비용
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
        {/* Quick Links */}
        <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            🔗 빠른 링크
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/expenses"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              <h3 className="text-xl font-semibold mb-2">💰 실제 비용 내역</h3>
              <p className="opacity-90">휘슬러 여행에서 실제로 사용한 모든 비용을 확인하세요</p>
            </Link>
            <Link 
              href="/gallery"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
            >
              <h3 className="text-xl font-semibold mb-2">📸 사진 갤러리</h3>
              <p className="opacity-90">휘슬러의 아름다운 순간들을 갤러리에서 확인하세요</p>
            </Link>
          </div>
        </section>

        {/* Expense Summary */}
        <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            💰 비용 요약
          </h2>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-lg text-center">
            <div className="text-5xl font-bold mb-2">CAD 244.50</div>
            <div className="text-xl">약 ₩245,000</div>
            <div className="text-sm mt-2 opacity-90">
              휘슬러 마운틴 바이킹 1일 여행
            </div>
          </div>
        </section>

        {/* Key Information */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            📋 주요 정보
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">📍 위치</h3>
              <p className="text-blue-600">캐나다 브리티시 컬럼비아주 휘슬러</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">⏰ 운영시간</h3>
              <p className="text-green-600">3:30 PM - 7:30 PM (반나절권)</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">🚗 교통</h3>
              <p className="text-purple-600">밴쿠버에서 차량으로 약 2시간</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center mt-12 py-8 border-t border-gray-200">
        <p className="text-gray-600">
          © 2025 휘슬러 마운틴 바이킹 가이드 - Next.js + Supabase
        </p>
        <div className="mt-4 space-x-4">
          <Link href="/expenses" className="text-blue-500 hover:text-blue-600">
            💰 실제 비용
          </Link>
          <Link href="/gallery" className="text-green-500 hover:text-green-600">
            📸 갤러리
          </Link>
        </div>
      </footer>
    </div>
  )
}
