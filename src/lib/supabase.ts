import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Photo {
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

export interface UserPreferences {
  id: string
  user_id: string
  auto_sort: boolean
  extract_location: boolean
  extract_metadata: boolean
  create_thumbnails: boolean
  backup_original: boolean
}
