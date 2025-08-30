'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

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
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadMessage, setUploadMessage] = useState('')

  // Load photos from database
  useEffect(() => {
    loadPhotos()
  }, [])

  const loadPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_photos')
        .select('*')
        .order('uploaded_at', { ascending: false })

      if (error) {
        console.error('Error loading photos:', error)
        return
      }

      setPhotos(data || [])
    } catch (error) {
      console.error('Error loading photos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files)
      setUploadMessage('')
    }
  }

  const handleUpload = async () => {
    if (!selectedFiles) return

    setIsUploading(true)
    setUploadProgress(0)
    setUploadMessage('')

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setUploadMessage(`Error: ${file.name} is not an image file`)
          continue
        }

        // Create form data
        const formData = new FormData()
        formData.append('file', file)

        // Upload file
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const error = await response.json()
          setUploadMessage(`Error uploading ${file.name}: ${error.error}`)
          continue
        }

        const result = await response.json()
        setUploadMessage(`Successfully uploaded ${file.name}`)
        
        // Update progress
        setUploadProgress(((i + 1) / selectedFiles.length) * 100)
      }

      // Reload photos after upload
      await loadPhotos()
      
    } catch (error) {
      console.error('Upload error:', error)
      setUploadMessage('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
      setSelectedFiles(null)
      setUploadProgress(0)
    }
  }

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo)
  }

  const closeModal = () => {
    setSelectedPhoto(null)
  }

  const getImageUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath)
    return data.publicUrl
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
              <div className="text-3xl font-bold text-blue-600 mb-2">{photos.length}</div>
              <div className="text-gray-600">총 사진 수</div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatFileSize(photos.reduce((total, photo) => total + photo.file_size, 0))}
              </div>
              <div className="text-gray-600">총 용량</div>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {new Set(photos.map(p => p.category).filter(Boolean)).size}
              </div>
              <div className="text-gray-600">카테고리</div>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {photos.reduce((total, photo) => total + (photo.tags?.length || 0), 0)}
              </div>
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

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600">{uploadProgress.toFixed(0)}% 완료</div>
              </div>
            )}

            {/* Upload Message */}
            {uploadMessage && (
              <div className={`p-4 rounded-lg ${
                uploadMessage.includes('Error') 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {uploadMessage}
              </div>
            )}

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
          
          {loading ? (
            <div className="text-center py-12">
              <div className="text-2xl mb-4">🔄</div>
              <p className="text-gray-600">사진을 불러오는 중...</p>
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📷</div>
              <p className="text-gray-600 mb-4">아직 업로드된 사진이 없습니다.</p>
              <p className="text-sm text-gray-500">위의 업로드 섹션에서 사진을 추가해보세요!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => handlePhotoClick(photo)}
                  className="bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center">
                    <img
                      src={getImageUrl(photo.file_path)}
                      alt={photo.original_name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.parentElement!.innerHTML = `
                          <div class="text-center p-4">
                            <div class="text-4xl mb-2">📷</div>
                            <div class="text-sm text-gray-500">${photo.original_name}</div>
                          </div>
                        `
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 truncate">
                      {photo.original_name}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>크기: {formatFileSize(photo.file_size)}</div>
                      <div>업로드: {new Date(photo.uploaded_at).toLocaleDateString('ko-KR')}</div>
                      {photo.tags && photo.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {photo.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                <img
                  src={getImageUrl(selectedPhoto.file_path)}
                  alt={selectedPhoto.original_name}
                  className="max-w-full max-h-96 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = `
                      <div class="text-center">
                        <div class="text-6xl mb-4">📷</div>
                        <div class="text-gray-600">사진을 불러올 수 없습니다</div>
                      </div>
                    `
                  }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">파일 정보</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>파일명: {selectedPhoto.filename}</div>
                    <div>크기: {formatFileSize(selectedPhoto.file_size)}</div>
                    <div>타입: {selectedPhoto.mime_type}</div>
                    <div>업로드: {new Date(selectedPhoto.uploaded_at).toLocaleString('ko-KR')}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">태그</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPhoto.tags && selectedPhoto.tags.length > 0 ? (
                      selectedPhoto.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">태그가 없습니다</span>
                    )}
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

