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
      lesson_plans: {
        Row: {
          activities_closing: string | null
          activities_core: string | null
          activities_opening: string | null
          assessment_formative: string | null
          assessment_initial: string | null
          assessment_summative: string | null
          capaian_pembelajaran: string
          created_at: string | null
          cross_disciplinary_integration: string | null
          duration_jp: number
          fase: string
          id: string
          is_draft: boolean | null
          jenjang: string
          joyfulness_level: number | null
          learning_approach: string[]
          learning_framework: Json | null
          learning_objectives: string
          learning_principles_description: string | null
          materi_characteristics: string
          meaningful_understanding: string | null
          meaningfulness_level: number | null
          mindfulness_level: number | null
          profil_pelajar_pancasila: string[]
          reflection_students: string | null
          reflection_teacher: string | null
          resources: string | null
          satuan_pendidikan: string
          semester: string
          special_considerations: string | null
          student_readiness: string
          student_social_emotional_context: string | null
          subject: string
          supporting_document_url: string | null
          teacher_expectations: string | null
          title: string
          topic: string
          trigger_questions: string | null
          updated_at: string | null
          user_id: string
          vibe_scores: Json | null
        }
        Insert: {
          activities_closing?: string | null
          activities_core?: string | null
          activities_opening?: string | null
          assessment_formative?: string | null
          assessment_initial?: string | null
          assessment_summative?: string | null
          capaian_pembelajaran: string
          created_at?: string | null
          cross_disciplinary_integration?: string | null
          duration_jp: number
          fase: string
          id?: string
          is_draft?: boolean | null
          jenjang: string
          joyfulness_level?: number | null
          learning_approach: string[]
          learning_framework?: Json | null
          learning_objectives: string
          learning_principles_description?: string | null
          materi_characteristics: string
          meaningful_understanding?: string | null
          meaningfulness_level?: number | null
          mindfulness_level?: number | null
          profil_pelajar_pancasila: string[]
          reflection_students?: string | null
          reflection_teacher?: string | null
          resources?: string | null
          satuan_pendidikan: string
          semester: string
          special_considerations?: string | null
          student_readiness: string
          student_social_emotional_context?: string | null
          subject: string
          supporting_document_url?: string | null
          teacher_expectations?: string | null
          title: string
          topic: string
          trigger_questions?: string | null
          updated_at?: string | null
          user_id: string
          vibe_scores?: Json | null
        }
        Update: {
          activities_closing?: string | null
          activities_core?: string | null
          activities_opening?: string | null
          assessment_formative?: string | null
          assessment_initial?: string | null
          assessment_summative?: string | null
          capaian_pembelajaran?: string
          created_at?: string | null
          cross_disciplinary_integration?: string | null
          duration_jp?: number
          fase?: string
          id?: string
          is_draft?: boolean | null
          jenjang?: string
          joyfulness_level?: number | null
          learning_approach?: string[]
          learning_framework?: Json | null
          learning_objectives?: string
          learning_principles_description?: string | null
          materi_characteristics?: string
          meaningful_understanding?: string | null
          meaningfulness_level?: number | null
          mindfulness_level?: number | null
          profil_pelajar_pancasila?: string[]
          reflection_students?: string | null
          reflection_teacher?: string | null
          resources?: string | null
          satuan_pendidikan?: string
          semester?: string
          special_considerations?: string | null
          student_readiness?: string
          student_social_emotional_context?: string | null
          subject?: string
          supporting_document_url?: string | null
          teacher_expectations?: string | null
          title?: string
          topic?: string
          trigger_questions?: string | null
          updated_at?: string | null
          user_id?: string
          vibe_scores?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_provider: string | null
          auto_save_enabled: boolean | null
          auto_save_interval: number | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          dashboard_view_preference: string | null
          date_format: string | null
          email: string
          email_notifications_enabled: boolean | null
          full_name: string
          id: string
          nip: string | null
          notifications_enabled: boolean | null
          school_address: string | null
          school_name: string | null
          school_phone: string | null
          school_website: string | null
          subjects_taught: string[] | null
          teaching_levels: string[] | null
          updated_at: string | null
          years_experience: number | null
        }
        Insert: {
          auth_provider?: string | null
          auto_save_enabled?: boolean | null
          auto_save_interval?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          dashboard_view_preference?: string | null
          date_format?: string | null
          email: string
          email_notifications_enabled?: boolean | null
          full_name: string
          id: string
          nip?: string | null
          notifications_enabled?: boolean | null
          school_address?: string | null
          school_name?: string | null
          school_phone?: string | null
          school_website?: string | null
          subjects_taught?: string[] | null
          teaching_levels?: string[] | null
          updated_at?: string | null
          years_experience?: number | null
        }
        Update: {
          auth_provider?: string | null
          auto_save_enabled?: boolean | null
          auto_save_interval?: number | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          dashboard_view_preference?: string | null
          date_format?: string | null
          email?: string
          email_notifications_enabled?: boolean | null
          full_name?: string
          id?: string
          nip?: string | null
          notifications_enabled?: boolean | null
          school_address?: string | null
          school_name?: string | null
          school_phone?: string | null
          school_website?: string | null
          subjects_taught?: string[] | null
          teaching_levels?: string[] | null
          updated_at?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
