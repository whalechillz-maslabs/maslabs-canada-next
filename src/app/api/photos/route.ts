import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let query = supabase
      .from('gallery_photos')
      .select('*')
      .order('uploaded_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`original_name.ilike.%${search}%,tags.cs.{${search}}`)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ photos: data })

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, tags, category } = body

    const { data, error } = await supabase
      .from('gallery_photos')
      .update({ tags, category })
      .eq('id', id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, photo: data[0] })

  } catch (error) {
    return NextResponse.json({ error: 'Failed to update photo' }, { status: 500 })
  }
}
