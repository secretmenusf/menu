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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          billing_email: string
          billing_contact_name: string | null
          billing_method: Database["public"]["Enums"]["billing_method"]
          ramp_customer_id: string | null
          stripe_customer_id: string | null
          notes: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          billing_email: string
          billing_contact_name?: string | null
          billing_method?: Database["public"]["Enums"]["billing_method"]
          ramp_customer_id?: string | null
          stripe_customer_id?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          billing_email?: string
          billing_contact_name?: string | null
          billing_method?: Database["public"]["Enums"]["billing_method"]
          ramp_customer_id?: string | null
          stripe_customer_id?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      organization_members: {
        Row: {
          id: string
          organization_id: string
          user_id: string | null
          email: string
          name: string | null
          role: Database["public"]["Enums"]["org_member_role"]
          can_place_orders: boolean
          can_customize_orders: boolean
          can_view_invoices: boolean
          invite_token: string | null
          invite_expires_at: string | null
          joined_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id?: string | null
          email: string
          name?: string | null
          role?: Database["public"]["Enums"]["org_member_role"]
          can_place_orders?: boolean
          can_customize_orders?: boolean
          can_view_invoices?: boolean
          invite_token?: string | null
          invite_expires_at?: string | null
          joined_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string | null
          email?: string
          name?: string | null
          role?: Database["public"]["Enums"]["org_member_role"]
          can_place_orders?: boolean
          can_customize_orders?: boolean
          can_view_invoices?: boolean
          invite_token?: string | null
          invite_expires_at?: string | null
          joined_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_credits: {
        Row: {
          id: string
          organization_id: string
          credit_type: Database["public"]["Enums"]["credit_type"]
          credits_amount_cents: number
          credits_remaining_cents: number
          valid_from: string
          valid_until: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          credit_type?: Database["public"]["Enums"]["credit_type"]
          credits_amount_cents?: number
          credits_remaining_cents?: number
          valid_from: string
          valid_until?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          credit_type?: Database["public"]["Enums"]["credit_type"]
          credits_amount_cents?: number
          credits_remaining_cents?: number
          valid_from?: string
          valid_until?: string | null
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_credits_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_invoices: {
        Row: {
          id: string
          organization_id: string
          invoice_number: string
          amount_cents: number
          status: Database["public"]["Enums"]["invoice_status"]
          payment_method: string | null
          payment_reference: string | null
          due_date: string | null
          paid_at: string | null
          description: string | null
          line_items: Json | null
          notes: string | null
          sent_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          invoice_number: string
          amount_cents: number
          status?: Database["public"]["Enums"]["invoice_status"]
          payment_method?: string | null
          payment_reference?: string | null
          due_date?: string | null
          paid_at?: string | null
          description?: string | null
          line_items?: Json | null
          notes?: string | null
          sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          invoice_number?: string
          amount_cents?: number
          status?: Database["public"]["Enums"]["invoice_status"]
          payment_method?: string | null
          payment_reference?: string | null
          due_date?: string | null
          paid_at?: string | null
          description?: string | null
          line_items?: Json | null
          notes?: string | null
          sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          label: string
          street_address: string
          apt_suite: string | null
          city: string
          state: string
          zip_code: string
          delivery_instructions: string | null
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          label: string
          street_address: string
          apt_suite?: string | null
          city: string
          state: string
          zip_code: string
          delivery_instructions?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          label?: string
          street_address?: string
          apt_suite?: string | null
          city?: string
          state?: string
          zip_code?: string
          delivery_instructions?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          created_at: string
          day_number: number
          description: string | null
          gluten_free: boolean
          id: string
          meal_type: string
          menu_week_id: string
          name: string
          ritual: string | null
          symbol: string | null
          vegetarian: boolean
        }
        Insert: {
          created_at?: string
          day_number: number
          description?: string | null
          gluten_free?: boolean
          id?: string
          meal_type?: string
          menu_week_id: string
          name: string
          ritual?: string | null
          symbol?: string | null
          vegetarian?: boolean
        }
        Update: {
          created_at?: string
          day_number?: number
          description?: string | null
          gluten_free?: boolean
          id?: string
          meal_type?: string
          menu_week_id?: string
          name?: string
          ritual?: string | null
          symbol?: string | null
          vegetarian?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_menu_week_id_fkey"
            columns: ["menu_week_id"]
            isOneToOne: false
            referencedRelation: "menu_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_weeks: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          price_cents: number
          updated_at: string
          week_start_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          price_cents?: number
          updated_at?: string
          week_start_date: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          price_cents?: number
          updated_at?: string
          week_start_date?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          delivery_notes: string | null
          id: string
          menu_week_id: string | null
          payment_method: string
          payment_status: string
          status: string
          stripe_payment_id: string | null
          total_cents: number
          updated_at: string
          user_id: string | null
          wallet_tx_hash: string | null
          organization_id: string | null
          order_notes: string | null
          admin_notes: string | null
          line_items: Json | null
          invoice_id: string | null
        }
        Insert: {
          created_at?: string
          delivery_notes?: string | null
          id?: string
          menu_week_id?: string | null
          payment_method: string
          payment_status?: string
          status?: string
          stripe_payment_id?: string | null
          total_cents: number
          updated_at?: string
          user_id?: string | null
          wallet_tx_hash?: string | null
          organization_id?: string | null
          order_notes?: string | null
          admin_notes?: string | null
          line_items?: Json | null
          invoice_id?: string | null
        }
        Update: {
          created_at?: string
          delivery_notes?: string | null
          id?: string
          menu_week_id?: string | null
          payment_method?: string
          payment_status?: string
          status?: string
          stripe_payment_id?: string | null
          total_cents?: number
          updated_at?: string
          user_id?: string | null
          wallet_tx_hash?: string | null
          organization_id?: string | null
          order_notes?: string | null
          admin_notes?: string | null
          line_items?: Json | null
          invoice_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_menu_week_id_fkey"
            columns: ["menu_week_id"]
            isOneToOne: false
            referencedRelation: "menu_weeks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "organization_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone: string | null
          updated_at: string
          wallet_address: string | null
          referral_code: string | null
          referred_by: string | null
          invites_remaining: number
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          phone?: string | null
          updated_at?: string
          wallet_address?: string | null
          referral_code?: string | null
          referred_by?: string | null
          invites_remaining?: number
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          updated_at?: string
          wallet_address?: string | null
          referral_code?: string | null
          referred_by?: string | null
          invites_remaining?: number
        }
        Relationships: []
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referred_id: string | null
          referral_code: string
          status: Database["public"]["Enums"]["referral_status"]
          created_at: string
          signed_up_at: string | null
          first_order_at: string | null
        }
        Insert: {
          id?: string
          referrer_id: string
          referred_id?: string | null
          referral_code: string
          status?: Database["public"]["Enums"]["referral_status"]
          created_at?: string
          signed_up_at?: string | null
          first_order_at?: string | null
        }
        Update: {
          id?: string
          referrer_id?: string
          referred_id?: string | null
          referral_code?: string
          status?: Database["public"]["Enums"]["referral_status"]
          created_at?: string
          signed_up_at?: string | null
          first_order_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          cancelled_at: string | null
          created_at: string
          id: string
          payment_method: string
          status: string
          stripe_subscription_id: string | null
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string
          id?: string
          payment_method: string
          status?: string
          stripe_subscription_id?: string | null
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string
          id?: string
          payment_method?: string
          status?: string
          stripe_subscription_id?: string | null
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      admin_orders_summary: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          status: string
          payment_status: string
          payment_method: string
          total_cents: number
          delivery_notes: string | null
          admin_notes: string | null
          organization_name: string | null
          billing_contact_name: string | null
          billing_email: string | null
          invoice_number: string | null
          invoice_status: string | null
          customer_name: string | null
          customer_email: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      referral_status: "pending" | "signed_up" | "first_order" | "active"
      billing_method: "stripe" | "ramp" | "ach" | "invoice"
      org_member_role: "owner" | "admin" | "member"
      credit_type: "weekly" | "one_time" | "rollover"
      invoice_status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
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
    Enums: {
      app_role: ["admin", "user"],
      referral_status: ["pending", "signed_up", "first_order", "active"],
      billing_method: ["stripe", "ramp", "ach", "invoice"],
      org_member_role: ["owner", "admin", "member"],
      credit_type: ["weekly", "one_time", "rollover"],
      invoice_status: ["draft", "sent", "paid", "overdue", "cancelled"],
    },
  },
} as const
