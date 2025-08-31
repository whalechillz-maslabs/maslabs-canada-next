import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import heic2any from 'heic2any'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type - support HEIC format
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp',
      'image/svg+xml',
      'image/heic',
      'image/heif'
    ]
    
    if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.heic')) {
      return NextResponse.json({ 
        error: 'File must be an image (JPEG, PNG, GIF, WebP, BMP, SVG, HEIC)' 
      }, { status: 400 })
    }

    // Validate file size (max 50MB for HEIC files)
    const maxSize = file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic') 
      ? 50 * 1024 * 1024 // 50MB for HEIC
      : 20 * 1024 * 1024 // 10MB for other formats
      
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File size must be less than ${maxSize / (1024 * 1024)}MB` 
      }, { status: 400 })
    }

    // Convert HEIC to JPEG if needed
    let processedFile = file
    let fileExtension = file.name.split('.').pop()
    let mimeType = file.type
    
    if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
      try {
        console.log('Converting HEIC to JPEG...')
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.8
        })
        
        processedFile = new File([convertedBlob as Blob], file.name.replace(/\.heic$/i, '.jpg'), {
          type: 'image/jpeg'
        })
        fileExtension = 'jpg'
        mimeType = 'image/jpeg'
        console.log('HEIC conversion successful')
      } catch (error) {
        console.error('HEIC conversion failed:', error)
        // Continue with original file if conversion fails
      }
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`
    const filePath = `photos/${filename}`
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('gallery')
      .upload(filePath, processedFile, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Storage upload error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath)

    // Extract image metadata
    const imageMetadata = await extractImageMetadata(processedFile)

    // Save metadata to database
    const { data: dbData, error: dbError } = await supabase
      .from('gallery_photos')
      .insert({
        filename: filename,
        original_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: mimeType,
        width: imageMetadata.width,
        height: imageMetadata.height,
        exif_data: imageMetadata.exif,
        location_data: imageMetadata.location,
        tags: imageMetadata.tags,
        category: imageMetadata.category,
        uploaded_at: new Date().toISOString()
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database insert error:', dbError)
      // Try to delete the uploaded file if database insert fails
      await supabase.storage.from('gallery').remove([filePath])
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      data: dbData,
      url: urlData.publicUrl 
    })

  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

async function extractImageMetadata(file: File) {
  const metadata = {
    width: undefined as number | undefined,
    height: undefined as number | undefined,
    exif: null as any,
    location: null as any,
    tags: [] as string[],
    category: undefined as string | undefined
  }

  try {
    // Create image element to get dimensions
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = objectUrl
    })

    metadata.width = img.naturalWidth
    metadata.height = img.naturalHeight
    
    // Clean up object URL
    URL.revokeObjectURL(objectUrl)

    // Extract tags from filename and add default tags for better categorization
    const filename = file.name.toLowerCase()
    const extractedTags = []
    
    // Location-based tags
    if (filename.includes('whistler') || filename.includes('휘슬러')) {
      extractedTags.push('휘슬러')
    }
    if (filename.includes('vancouver') || filename.includes('밴쿠버')) {
      extractedTags.push('밴쿠버')
    }
    if (filename.includes('canada') || filename.includes('캐나다')) {
      extractedTags.push('캐나다')
    }
    
    // Activity-based tags
    if (filename.includes('mountain') || filename.includes('마운틴')) {
      extractedTags.push('마운틴')
    }
    if (filename.includes('bike') || filename.includes('바이크') || filename.includes('cycling')) {
      extractedTags.push('바이킹')
    }
    if (filename.includes('park') || filename.includes('파크')) {
      extractedTags.push('바이크파크')
    }
    if (filename.includes('village') || filename.includes('빌리지')) {
      extractedTags.push('휘슬러빌리지')
    }
    if (filename.includes('lift') || filename.includes('리프트')) {
      extractedTags.push('리프트')
    }
    if (filename.includes('trail') || filename.includes('트레일')) {
      extractedTags.push('트레일')
    }
    
    // Content-based tags
    if (filename.includes('landscape') || filename.includes('풍경') || filename.includes('view')) {
      extractedTags.push('풍경')
      metadata.category = 'landscape'
    }
    if (filename.includes('action') || filename.includes('액션') || filename.includes('jump')) {
      extractedTags.push('액션')
      metadata.category = 'action'
    }
    if (filename.includes('portrait') || filename.includes('인물') || filename.includes('person')) {
      extractedTags.push('인물')
      metadata.category = 'portrait'
    }
    if (filename.includes('food') || filename.includes('음식') || filename.includes('restaurant')) {
      extractedTags.push('음식')
      metadata.category = 'food'
    }
    if (filename.includes('hotel') || filename.includes('호텔') || filename.includes('accommodation')) {
      extractedTags.push('숙박')
      metadata.category = 'accommodation'
    }
    
    // Time-based tags
    if (filename.includes('2024') || filename.includes('2025')) {
      extractedTags.push('2024-2025')
    }
    if (filename.includes('summer') || filename.includes('여름')) {
      extractedTags.push('여름')
    }
    if (filename.includes('winter') || filename.includes('겨울')) {
      extractedTags.push('겨울')
    }
    
    // Equipment tags
    if (filename.includes('helmet') || filename.includes('헬멧')) {
      extractedTags.push('헬멧')
    }
    if (filename.includes('bike') || filename.includes('자전거')) {
      extractedTags.push('자전거')
    }
    
    // Add default tags for better categorization
    if (extractedTags.length === 0) {
      extractedTags.push('휘슬러', '캐나다', '여행')
    }

    metadata.tags = extractedTags

    // Set default category if not determined
    if (!metadata.category) {
      metadata.category = 'general'
    }

  } catch (error) {
    console.error('Error extracting image metadata:', error)
    // Set default tags even if metadata extraction fails
    metadata.tags = ['휘슬러', '캐나다', '여행']
    metadata.category = 'general'
  }

  return metadata
}
