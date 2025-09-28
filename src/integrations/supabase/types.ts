export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
        Tables: {
          users: {
            Row: {
              company: string | null
              created_at: string | null
              email: string
              id: string
              name: string | null
              plan: string
              trial_expires_at: string | null
              trial_started: boolean
              updated_at: string | null
            }
            Insert: {
              company?: string | null
              created_at?: string | null
              email: string
              id: string
              name?: string | null
              plan?: string
              trial_expires_at?: string | null
              trial_started?: boolean
              updated_at?: string | null
            }
            Update: {
              company?: string | null
              created_at?: string | null
              email?: string
              id?: string
              name?: string | null
              plan?: string
              trial_expires_at?: string | null
              trial_started?: boolean
              updated_at?: string | null
            }
            Relationships: []
          }
          admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          password_hash: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name: string
          password_hash: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          password_hash?: string
        }
        Relationships: []
      }
        email_leads: {
          Row: {
            created_at: string | null
            email: string
            id: string
            source: string
            status: string
            updated_at: string | null
          }
          Insert: {
            created_at?: string | null
            email: string
            id?: string
            source?: string
            status?: string
            updated_at?: string | null
          }
          Update: {
            created_at?: string | null
            email?: string
            id?: string
            source?: string
            status?: string
            updated_at?: string | null
          }
          Relationships: []
        }
        activation_tokens: {
          Row: {
            created_at: string | null
            email: string
            expires_at: string
            id: string
            token: string
            used: boolean
          }
          Insert: {
            created_at?: string | null
            email: string
            expires_at: string
            id?: string
            token: string
            used?: boolean
          }
          Update: {
            created_at?: string | null
            email?: string
            expires_at?: string
            id?: string
            token?: string
            used?: boolean
          }
          Relationships: []
        }
        consultation_requests: {
          Row: {
            id: string
            name: string
            email: string
            phone: string | null
            role: string | null
            experience: string | null
            goal: string | null
            success: string | null
            challenge: string | null
            time_commitment: string | null
            readiness: string | null
            budget: string | null
            start_time: string | null
            why_right: string | null
            status: string
            created_at: string | null
            updated_at: string | null
          }
          Insert: {
            id?: string
            name: string
            email: string
            phone?: string | null
            role?: string | null
            experience?: string | null
            goal?: string | null
            success?: string | null
            challenge?: string | null
            time_commitment?: string | null
            readiness?: string | null
            budget?: string | null
            start_time?: string | null
            why_right?: string | null
            status?: string
            created_at?: string | null
            updated_at?: string | null
          }
          Update: {
            id?: string
            name?: string
            email?: string
            phone?: string | null
            role?: string | null
            experience?: string | null
            goal?: string | null
            success?: string | null
            challenge?: string | null
            time_commitment?: string | null
            readiness?: string | null
            budget?: string | null
            start_time?: string | null
            why_right?: string | null
            status?: string
            created_at?: string | null
            updated_at?: string | null
          }
          Relationships: []
        }
      availability: {
        Row: {
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean
          start_time: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean
          start_time: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean
          start_time?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      "book a call": {
        Row: {}
        Insert: {}
        Update: {}
        Relationships: []
      }
      bookings: {
        Row: {
          booking_date: string
          booking_time: string
          created_at: string | null
          duration_minutes: number
          email: string
          google_calendar_event_id: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          booking_date: string
          booking_time: string
          created_at?: string | null
          duration_minutes?: number
          email: string
          google_calendar_event_id?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          booking_date?: string
          booking_time?: string
          created_at?: string | null
          duration_minutes?: number
          email?: string
          google_calendar_event_id?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_booking_conflict: {
        Args: {
          p_booking_date: string
          p_booking_id?: string
          p_booking_time: string
          p_duration_minutes?: number
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
