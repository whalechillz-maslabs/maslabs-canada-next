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
        {/* Introduction */}
        <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🚀 프로젝트 개요
          </h2>
          <p className="text-gray-600 mb-4">
            이 프로젝트는 휘슬러 마운틴 바이킹 여행을 위한 종합 가이드 웹사이트입니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">주요 기능</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>📊 실제 사용 비용 상세 내역</li>
                <li>📸 여행 사진 갤러리 (업로드 기능)</li>
                <li>🗺️ 여행 정보 및 팁</li>
                <li>💰 비용 분석 및 절약 팁</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">기술 스택</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li><strong>Frontend:</strong> Next.js 14 (App Router)</li>
                <li><strong>Styling:</strong> Tailwind CSS</li>
                <li><strong>Database:</strong> Supabase</li>
                <li><strong>Deployment:</strong> Vercel</li>
                <li><strong>Language:</strong> TypeScript</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            🔗 빠른 링크
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link 
              href="/expenses"
              className="block bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
            >
              <h3 className="text-xl font-bold mb-2">💰 실제 비용</h3>
              <p className="text-blue-100">
                휘슬러 여행에서 실제로 사용한 모든 비용을 상세히 확인하세요.
              </p>
            </Link>
            <Link 
              href="/gallery"
              className="block bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
            >
              <h3 className="text-xl font-bold mb-2">📸 갤러리</h3>
              <p className="text-green-100">
                여행 사진들을 업로드하고 관리할 수 있는 갤러리입니다.
              </p>
            </Link>
          </div>
        </section>

        {/* Expense Summary */}
        <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            📊 실제 비용 요약
          </h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 text-2xl">💰</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>총 비용:</strong> CAD 340.84 (약 ₩341,000)
                </p>
                <p className="text-sm text-yellow-700">
                  <strong>주요 항목:</strong> 반나절권, 보호장비 렌탈, 주차비, 주유비
                </p>
              </div>
            </div>
          </div>
          <Link 
            href="/expenses"
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            상세 비용 보기 →
          </Link>
        </section>

        {/* Key Information */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            🗺️ 주요 정보
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🏔️</div>
              <h3 className="font-semibold text-gray-800 mb-2">휘슬러 블랙콤</h3>
              <p className="text-sm text-gray-600">
                북미 최대의 마운틴 바이크 파크
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🚗</div>
              <h3 className="font-semibold text-gray-800 mb-2">자동차 여행</h3>
              <p className="text-sm text-gray-600">
                밴쿠버에서 약 2시간 거리
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⏰</div>
              <h3 className="font-semibold text-gray-800 mb-2">반나절권</h3>
              <p className="text-sm text-gray-600">
                3:30-7:30 시간대 이용
              </p>
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
