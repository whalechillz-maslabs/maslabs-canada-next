import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name}`
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('gallery')
      .upload(`photos/${filename}`, file)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('gallery')
      .getPublicUrl(`photos/${filename}`)

    // Save metadata to database
    const { data: dbData, error: dbError } = await supabase
      .from('gallery_photos')
      .insert({
        filename: filename,
        original_name: file.name,
        file_path: `photos/${filename}`,
        file_size: file.size,
        mime_type: file.type,
        uploaded_at: new Date().toISOString()
      })

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      filename: filename,
      url: urlData.publicUrl 
    })

  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
