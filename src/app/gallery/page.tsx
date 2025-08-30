'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Photo {
  id: string
  filename: string
  original_name: string
  file_path: string
  file_size: number
  mime_type: string
  width?: number
  height?: number
  exif_data?: any
  location_data?: any
  tags?: string[]
  category?: string
  uploaded_at: string
  user_id?: string
}

export default function GalleryPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)

  // Sample photos for demonstration
  const samplePhotos: Photo[] = [
    {
      id: '1',
      filename: 'whistler-mountain-1.jpg',
      original_name: 'whistler-mountain-1.jpg',
      file_path: '/gallery/images/photos/whistler-mountain-1.jpg',
      file_size: 2048576,
      mime_type: 'image/jpeg',
      width: 1920,
      height: 1080,
      tags: ['휘슬러', '마운틴', '바이킹'],
      category: 'landscape',
      uploaded_at: '2025-08-30T15:30:00Z'
    },
    {
      id: '2',
      filename: 'bike-park-1.jpg',
      original_name: 'bike-park-1.jpg',
      file_path: '/gallery/images/photos/bike-park-1.jpg',
      file_size: 1536000,
      mime_type: 'image/jpeg',
      width: 1600,
      height: 1200,
      tags: ['바이크파크', '다운힐', '액션'],
      category: 'action',
      uploaded_at: '2025-08-30T16:45:00Z'
    },
    {
      id: '3',
      filename: 'village-view.jpg',
      original_name: 'village-view.jpg',
      file_path: '/gallery/images/photos/village-view.jpg',
      file_size: 1024000,
      mime_type: 'image/jpeg',
      width: 1280,
      height: 720,
      tags: ['휘슬러빌리지', '전경', '관광'],
      category: 'landscape',
      uploaded_at: '2025-08-30T17:15:00Z'
    }
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files)
    }
  }

  const handleUpload = async () => {
    if (!selectedFiles) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setUploadProgress(i)
    }

    setIsUploading(false)
    setSelectedFiles(null)
    setUploadProgress(0)
  }

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo)
  }

  const closeModal = () => {
    setSelectedPhoto(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          📸 휘슬러 갤러리
        </h1>
        <p className="text-xl text-gray-600">
          휘슬러 마운틴 바이킹 여행의 모든 순간을 담은 갤러리
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
            href="/expenses" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            💰 실제 비용
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto">
        {/* Statistics */}
        <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            📊 갤러리 통계
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
              <div className="text-gray-600">총 사진 수</div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">4.6MB</div>
              <div className="text-gray-600">총 용량</div>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
              <div className="text-gray-600">카테고리</div>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">8</div>
              <div className="text-gray-600">태그 수</div>
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            📤 사진 업로드
          </h2>
          <div className="space-y-6">
            {/* File Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사진 선택
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Upload Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">업로드 옵션</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm text-gray-700">자동 정렬 (날짜순)</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm text-gray-700">EXIF 메타데이터 추출</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm text-gray-700">위치 정보 추출</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm text-gray-700">썸네일 생성</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm text-gray-700">원본 백업</span>
                  </label>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">업로드 진행률</h3>
                {isUploading ? (
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600">{uploadProgress}% 완료</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">업로드 대기 중...</div>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!selectedFiles || isUploading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {isUploading ? '업로드 중...' : '사진 업로드'}
            </button>
          </div>
        </section>

        {/* Filters and Controls */}
        <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            🔍 필터 및 정렬
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="">모든 카테고리</option>
                <option value="landscape">풍경</option>
                <option value="action">액션</option>
                <option value="portrait">인물</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                정렬
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="date">날짜순</option>
                <option value="name">이름순</option>
                <option value="size">크기순</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                검색
              </label>
              <input
                type="text"
                placeholder="태그나 파일명으로 검색..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            🖼️ 사진 갤러리
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {samplePhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => handlePhotoClick(photo)}
                className="bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-500 text-center p-4">
                    <div className="text-4xl mb-2">📷</div>
                    <div className="text-sm">{photo.original_name}</div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {photo.original_name}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>크기: {(photo.file_size / 1024 / 1024).toFixed(2)} MB</div>
                    <div>해상도: {photo.width} x {photo.height}</div>
                    <div>업로드: {new Date(photo.uploaded_at).toLocaleDateString('ko-KR')}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {photo.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedPhoto.original_name}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="bg-gray-100 rounded-lg p-8 mb-4 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📷</div>
                  <div className="text-gray-600">사진 미리보기</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">파일 정보</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>파일명: {selectedPhoto.filename}</div>
                    <div>크기: {(selectedPhoto.file_size / 1024 / 1024).toFixed(2)} MB</div>
                    <div>타입: {selectedPhoto.mime_type}</div>
                    <div>해상도: {selectedPhoto.width} x {selectedPhoto.height}</div>
                    <div>업로드: {new Date(selectedPhoto.uploaded_at).toLocaleString('ko-KR')}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">태그</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPhoto.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center mt-12 py-8 border-t border-gray-200">
        <p className="text-gray-600">
          © 2025 휘슬러 마운틴 바이킹 가이드 - 갤러리
        </p>
        <div className="mt-4 space-x-4">
          <Link href="/" className="text-blue-500 hover:text-blue-600">
            🏠 홈으로
          </Link>
          <Link href="/expenses" className="text-green-500 hover:text-green-600">
            💰 실제 비용
          </Link>
        </div>
      </footer>
    </div>
  )
}

