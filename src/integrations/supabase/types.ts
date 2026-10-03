export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string
          name: string
          brand: string
          phone: string
          service: string
          budget: string
          status: string
          notes: string
          created_at: string
        }
        Insert: {
          id: string
          name: string
          brand: string
          phone: string
          service?: string
          budget?: string
          status?: string
          notes?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          brand?: string
          phone?: string
          service?: string
          budget?: string
          status?: string
          notes?: string
          created_at?: string
        }
      }
      reels: {
        Row: {
          id: string
          category: string
          title: string
          client: string
          tag: string
          views: string
          video_url: string
          thumbnail_url: string
          aspect_ratio: string
          created_at: string
        }
        Insert: {
          id: string
          category: string
          title: string
          client: string
          tag?: string
          views?: string
          video_url: string
          thumbnail_url: string
          aspect_ratio?: string
          created_at?: string
        }
        Update: {
          id?: string
          category?: string
          title?: string
          client?: string
          tag?: string
          views?: string
          video_url?: string
          thumbnail_url?: string
          aspect_ratio?: string
          created_at?: string
        }
      }
      models: {
        Row: {
          id: string
          name: string
          category: string
          height: string
          shoots: string
          image_url: string
          available: boolean
          created_at: string
        }
        Insert: {
          id: string
          name: string
          category: string
          height?: string
          shoots?: string
          image_url: string
          available?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          height?: string
          shoots?: string
          image_url?: string
          available?: boolean
          created_at?: string
        }
      }
    }
  }
}
