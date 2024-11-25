export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      Category: {
        Row: {
          created_at: string
          icon: string | null
          id: number
          title: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: number
          title: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: number
          title?: string
        }
        Relationships: []
      }
      Comment: {
        Row: {
          comment: string
          created_at: string
          created_by: string
          id: number
          post_id: number
        }
        Insert: {
          comment: string
          created_at?: string
          created_by: string
          id?: number
          post_id: number
        }
        Update: {
          comment?: string
          created_at?: string
          created_by?: string
          id?: number
          post_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Comment_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "Posts"
            referencedColumns: ["id"]
          },
        ]
      }
      Likes: {
        Row: {
          created_at: string
          id: number
          liked_by: string
          post: number
        }
        Insert: {
          created_at?: string
          id?: number
          liked_by: string
          post: number
        }
        Update: {
          created_at?: string
          id?: number
          liked_by?: string
          post?: number
        }
        Relationships: [
          {
            foreignKeyName: "Likes_post_fkey"
            columns: ["post"]
            isOneToOne: false
            referencedRelation: "Posts"
            referencedColumns: ["id"]
          },
        ]
      }
      Posts: {
        Row: {
          category: number
          created_at: string
          created_by: string
          description: string
          id: number
          image: string | null
          title: string
        }
        Insert: {
          category: number
          created_at?: string
          created_by: string
          description: string
          id?: number
          image?: string | null
          title: string
        }
        Update: {
          category?: number
          created_at?: string
          created_by?: string
          description?: string
          id?: number
          image?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "Posts_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "Category"
            referencedColumns: ["id"]
          },
        ]
      }
      Roles: {
        Row: {
          created_at: string
          id: number
          role_name: string
        }
        Insert: {
          created_at?: string
          id?: number
          role_name: string
        }
        Update: {
          created_at?: string
          id?: number
          role_name?: string
        }
        Relationships: []
      }
      Users: {
        Row: {
          created_at: string
          display_name: string
          email: string
          id: string
          role: number
        }
        Insert: {
          created_at?: string
          display_name: string
          email: string
          id: string
          role?: number
        }
        Update: {
          created_at?: string
          display_name?: string
          email?: string
          id?: string
          role?: number
        }
        Relationships: [
          {
            foreignKeyName: "Users_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "Roles"
            referencedColumns: ["id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
