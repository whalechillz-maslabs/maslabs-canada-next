'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

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
    console.log('File select event:', event.target.files)
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFiles(event.target.files)
      setUploadMessage('')
      console.log('Files selected:', event.target.files.length)
    }
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    console.log('Files dropped:', files.length)
    
    if (files && files.length > 0) {
      setSelectedFiles(files)
      setUploadMessage('')
    }
  }

  const handleUpload = async () => {
    if (!selectedFiles) {
      console.log('No files selected')
      return
    }

    console.log('Starting upload for', selectedFiles.length, 'files')
    setIsUploading(true)
    setUploadProgress(0)
    setUploadMessage('')

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        let file = selectedFiles[i]
        console.log('Uploading file:', file.name, file.type, file.size)
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setUploadMessage(`Error: ${file.name} is not an image file`)
          continue
        }

        // Convert HEIC to JPEG if needed
        if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
          try {
            console.log('Converting HEIC to JPEG...')
            const heic2any = (await import('heic2any')).default
            const convertedBlob = await heic2any({
              blob: file,
              toType: 'image/jpeg',
              quality: 0.8
            })
            
            file = new File([convertedBlob as Blob], file.name.replace(/\.heic$/i, '.jpg'), {
              type: 'image/jpeg'
            })
            console.log('HEIC conversion successful')
          } catch (error) {
            console.error('HEIC conversion failed:', error)
            setUploadMessage(`Error converting HEIC file ${file.name}: ${error}`)
            continue
          }
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
          console.error('Upload error:', error)
          setUploadMessage(`Error uploading ${file.name}: ${error.error}`)
          continue
        }

        const result = await response.json()
        console.log('Upload success:', result)
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

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm("🗑️ 이 사진을 삭제하시겠습니까?")) {
      return
    }

    try {
      const response = await fetch(`/api/photos?id=${photoId}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        const error = await response.json()
        setUploadMessage(`Error deleting photo: ${error.error}`)
        return
      }

      setUploadMessage("✅ 사진이 삭제되었습니다.")
      closeModal() // 모달 닫기
      await loadPhotos() // 갤러리 새로고침
    } catch (error) {
      console.error("Delete error:", error)
      setUploadMessage("❌ 삭제 중 오류가 발생했습니다.")
    }
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

  // Helper function to extract tags from filename
  const extractTagsFromFilename = (filename: string) => {
    const lowerFilename = filename.toLowerCase()
    const tags = []
    
    // Location-based tags
    if (lowerFilename.includes('whistler') || lowerFilename.includes('휘슬러')) {
      tags.push('휘슬러')
    }
    if (lowerFilename.includes('vancouver') || lowerFilename.includes('밴쿠버')) {
      tags.push('밴쿠버')
    }
    if (lowerFilename.includes('canada') || lowerFilename.includes('캐나다')) {
      tags.push('캐나다')
    }
    
    // Activity-based tags
    if (lowerFilename.includes('mountain') || lowerFilename.includes('마운틴')) {
      tags.push('마운틴')
    }
    if (lowerFilename.includes('bike') || lowerFilename.includes('바이크') || lowerFilename.includes('cycling')) {
      tags.push('바이킹')
    }
    if (lowerFilename.includes('park') || lowerFilename.includes('파크')) {
      tags.push('바이크파크')
    }
    if (lowerFilename.includes('village') || lowerFilename.includes('빌리지')) {
      tags.push('휘슬러빌리지')
    }
    if (lowerFilename.includes('lift') || lowerFilename.includes('리프트')) {
      tags.push('리프트')
    }
    if (lowerFilename.includes('trail') || lowerFilename.includes('트레일')) {
      tags.push('트레일')
    }
    
    // Content-based tags
    if (lowerFilename.includes('landscape') || lowerFilename.includes('풍경') || lowerFilename.includes('view')) {
      tags.push('풍경')
    }
    if (lowerFilename.includes('action') || lowerFilename.includes('액션') || lowerFilename.includes('jump')) {
      tags.push('액션')
    }
    if (lowerFilename.includes('portrait') || lowerFilename.includes('인물') || lowerFilename.includes('person')) {
      tags.push('인물')
    }
    if (lowerFilename.includes('food') || lowerFilename.includes('음식') || lowerFilename.includes('restaurant')) {
      tags.push('음식')
    }
    if (lowerFilename.includes('hotel') || lowerFilename.includes('호텔') || lowerFilename.includes('accommodation')) {
      tags.push('숙박')
    }
    
    // Time-based tags
    if (lowerFilename.includes('2024') || lowerFilename.includes('2025')) {
      tags.push('2024-2025')
    }
    if (lowerFilename.includes('summer') || lowerFilename.includes('여름')) {
      tags.push('여름')
    }
    if (lowerFilename.includes('winter') || lowerFilename.includes('겨울')) {
      tags.push('겨울')
    }
    
    // Equipment tags
    if (lowerFilename.includes('helmet') || lowerFilename.includes('헬멧')) {
      tags.push('헬멧')
    }
    if (lowerFilename.includes('bike') || lowerFilename.includes('자전거')) {
      tags.push('자전거')
    }
    
    // Default tags for Whistler photos
    if (tags.length === 0) {
      tags.push('휘슬러', '캐나다')
    }
    
    return [...new Set(tags)] // Remove duplicates
  }

  // Helper function to extract category from filename
  const extractCategoryFromFilename = (filename: string) => {
    const lowerFilename = filename.toLowerCase()
    
    if (lowerFilename.includes('landscape') || lowerFilename.includes('풍경') || lowerFilename.includes('view')) {
      return 'landscape'
    }
    if (lowerFilename.includes('action') || lowerFilename.includes('액션') || lowerFilename.includes('jump')) {
      return 'action'
    }
    if (lowerFilename.includes('portrait') || lowerFilename.includes('인물') || lowerFilename.includes('person')) {
      return 'portrait'
    }
    if (lowerFilename.includes('food') || lowerFilename.includes('음식') || lowerFilename.includes('restaurant')) {
      return 'food'
    }
    if (lowerFilename.includes('hotel') || lowerFilename.includes('호텔') || lowerFilename.includes('accommodation')) {
      return 'accommodation'
    }
    
    // Try to determine from tags
    const tags = extractTagsFromFilename(filename)
    if (tags.includes('풍경') || tags.includes('휘슬러')) {
      return 'landscape'
    }
    if (tags.includes('바이킹') || tags.includes('액션')) {
      return 'action'
    }
    if (tags.includes('인물')) {
      return 'portrait'
    }
    
    return 'general'
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
            {/* Drag and Drop Zone */}
            <div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="text-4xl mb-4">📁</div>
              <p className="text-lg text-gray-600 mb-2">
                사진을 여기에 드래그 앤 드롭하거나
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                파일 선택
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Selected Files Display */}
            {selectedFiles && selectedFiles.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">선택된 파일:</h3>
                <div className="space-y-2">
                  {Array.from(selectedFiles).map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
              
              {/* 삭제 버튼 */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => handleDeletePhoto(selectedPhoto.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  🗑️ 사진 삭제
                </button>
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
