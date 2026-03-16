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
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          organization_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          organization_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          organization_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_assessments: {
        Row: {
          assessed_at: string | null
          assessed_by: string | null
          checklist_progress: Json | null
          created_at: string
          deadline: string | null
          framework_id: string | null
          id: string
          model_id: string | null
          notes: string | null
          organization_id: string | null
          score: number | null
          status: string
          updated_at: string
        }
        Insert: {
          assessed_at?: string | null
          assessed_by?: string | null
          checklist_progress?: Json | null
          created_at?: string
          deadline?: string | null
          framework_id?: string | null
          id?: string
          model_id?: string | null
          notes?: string | null
          organization_id?: string | null
          score?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          assessed_at?: string | null
          assessed_by?: string | null
          checklist_progress?: Json | null
          created_at?: string
          deadline?: string | null
          framework_id?: string | null
          id?: string
          model_id?: string | null
          notes?: string | null
          organization_id?: string | null
          score?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_assessments_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "compliance_frameworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_assessments_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_assessments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_frameworks: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          region: string
          short_name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          region: string
          short_name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          region?: string
          short_name?: string
        }
        Relationships: []
      }
      framework_checklists: {
        Row: {
          category: string | null
          created_at: string
          framework_id: string
          id: string
          item_text: string
          sort_order: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          framework_id: string
          id?: string
          item_text: string
          sort_order?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          framework_id?: string
          id?: string
          item_text?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "framework_checklists_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "compliance_frameworks"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string | null
          id: string
          investigation_notes: string | null
          model_id: string | null
          organization_id: string | null
          reported_by: string | null
          resolution_notes: string | null
          resolved_at: string | null
          severity: Database["public"]["Enums"]["incident_severity"]
          status: Database["public"]["Enums"]["incident_status"]
          title: string
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          id?: string
          investigation_notes?: string | null
          model_id?: string | null
          organization_id?: string | null
          reported_by?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["incident_severity"]
          status?: Database["public"]["Enums"]["incident_status"]
          title: string
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          id?: string
          investigation_notes?: string | null
          model_id?: string | null
          organization_id?: string | null
          reported_by?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["incident_severity"]
          status?: Database["public"]["Enums"]["incident_status"]
          title?: string
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidents_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incidents_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      models: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          organization_id: string | null
          provider: string | null
          risk_level: Database["public"]["Enums"]["risk_level"] | null
          security_assessment: boolean | null
          status: Database["public"]["Enums"]["model_status"]
          updated_at: string
          vendor_id: string | null
          version: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          organization_id?: string | null
          provider?: string | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          security_assessment?: boolean | null
          status?: Database["public"]["Enums"]["model_status"]
          updated_at?: string
          vendor_id?: string | null
          version?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          provider?: string | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          security_assessment?: boolean | null
          status?: Database["public"]["Enums"]["model_status"]
          updated_at?: string
          vendor_id?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "models_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "models_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          organization_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          organization_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          organization_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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
          role?: Database["public"]["Enums"]["app_role"]
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
      vendors: {
        Row: {
          contact_email: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          organization_id: string | null
          risk_score: number | null
          security_assessment: boolean | null
          updated_at: string
          website: string | null
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          organization_id?: string | null
          risk_score?: number | null
          security_assessment?: boolean | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          risk_score?: number | null
          security_assessment?: boolean | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendors_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          id: string
          organization_id: string
          title: string
          description: string | null
          status: Database["public"]["Enums"]["task_status"]
          priority: Database["public"]["Enums"]["task_priority"]
          category: string | null
          assignee_id: string | null
          due_date: string | null
          model_id: string | null
          vendor_id: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id?: string
          title: string
          description?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          priority?: Database["public"]["Enums"]["task_priority"]
          category?: string | null
          assignee_id?: string | null
          due_date?: string | null
          model_id?: string | null
          vendor_id?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          title?: string
          description?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          priority?: Database["public"]["Enums"]["task_priority"]
          category?: string | null
          assignee_id?: string | null
          due_date?: string | null
          model_id?: string | null
          vendor_id?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      risks: {
        Row: {
          id: string
          organization_id: string
          title: string
          description: string | null
          category: string | null
          severity: Database["public"]["Enums"]["risk_severity"]
          likelihood: Database["public"]["Enums"]["risk_likelihood"]
          impact: string | null
          mitigation_status: Database["public"]["Enums"]["mitigation_status"]
          mitigation_plan: string | null
          owner_id: string | null
          model_id: string | null
          vendor_id: string | null
          identified_date: string | null
          review_date: string | null
          created_at: string
          updated_at: string
          source: string | null
          regulation: string | null
          affected_framework: string | null
          recommended_action: string | null
          auto_generated: boolean
        }
        Insert: {
          id?: string
          organization_id?: string
          title: string
          description?: string | null
          category?: string | null
          severity?: Database["public"]["Enums"]["risk_severity"]
          likelihood?: Database["public"]["Enums"]["risk_likelihood"]
          impact?: string | null
          mitigation_status?: Database["public"]["Enums"]["mitigation_status"]
          mitigation_plan?: string | null
          owner_id?: string | null
          model_id?: string | null
          vendor_id?: string | null
          identified_date?: string | null
          review_date?: string | null
          created_at?: string
          updated_at?: string
          source?: string | null
          regulation?: string | null
          affected_framework?: string | null
          recommended_action?: string | null
          auto_generated?: boolean
        }
        Update: {
          id?: string
          organization_id?: string
          title?: string
          description?: string | null
          category?: string | null
          severity?: Database["public"]["Enums"]["risk_severity"]
          likelihood?: Database["public"]["Enums"]["risk_likelihood"]
          impact?: string | null
          mitigation_status?: Database["public"]["Enums"]["mitigation_status"]
          mitigation_plan?: string | null
          owner_id?: string | null
          model_id?: string | null
          vendor_id?: string | null
          identified_date?: string | null
          review_date?: string | null
          created_at?: string
          updated_at?: string
          source?: string | null
          regulation?: string | null
          affected_framework?: string | null
          recommended_action?: string | null
          auto_generated?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "risks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risks_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risks_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risks_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence: {
        Row: {
          id: string
          organization_id: string
          name: string
          description: string | null
          file_url: string | null
          file_type: string | null
          file_size: number | null
          evidence_type: Database["public"]["Enums"]["evidence_type"]
          category: string | null
          model_id: string | null
          vendor_id: string | null
          assessment_id: string | null
          uploaded_by: string | null
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id?: string
          name: string
          description?: string | null
          file_url?: string | null
          file_type?: string | null
          file_size?: number | null
          evidence_type?: Database["public"]["Enums"]["evidence_type"]
          category?: string | null
          model_id?: string | null
          vendor_id?: string | null
          assessment_id?: string | null
          uploaded_by?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          description?: string | null
          file_url?: string | null
          file_type?: string | null
          file_size?: number | null
          evidence_type?: Database["public"]["Enums"]["evidence_type"]
          category?: string | null
          model_id?: string | null
          vendor_id?: string | null
          assessment_id?: string | null
          uploaded_by?: string | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "compliance_assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      policies: {
        Row: {
          id: string
          organization_id: string
          title: string
          description: string | null
          content: string | null
          category: string | null
          version: string | null
          status: Database["public"]["Enums"]["policy_status"]
          owner_id: string | null
          effective_date: string | null
          review_date: string | null
          approved_by: string | null
          approved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id?: string
          title: string
          description?: string | null
          content?: string | null
          category?: string | null
          version?: string | null
          status?: Database["public"]["Enums"]["policy_status"]
          owner_id?: string | null
          effective_date?: string | null
          review_date?: string | null
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          title?: string
          description?: string | null
          content?: string | null
          category?: string | null
          version?: string | null
          status?: Database["public"]["Enums"]["policy_status"]
          owner_id?: string | null
          effective_date?: string | null
          review_date?: string | null
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "policies_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policies_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policies_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          type: Database["public"]["Enums"]["notification_type"]
          title: string
          message: string | null
          link: string | null
          is_read: boolean
          entity_type: string | null
          entity_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id?: string
          user_id: string
          type: Database["public"]["Enums"]["notification_type"]
          title: string
          message?: string | null
          link?: string | null
          is_read?: boolean
          entity_type?: string | null
          entity_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          type?: Database["public"]["Enums"]["notification_type"]
          title?: string
          message?: string | null
          link?: string | null
          is_read?: boolean
          entity_type?: string | null
          entity_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          theme: string | null
          email_notifications: boolean | null
          push_notifications: boolean | null
          notification_frequency: string | null
          dashboard_layout: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: string | null
          email_notifications?: boolean | null
          push_notifications?: boolean | null
          notification_frequency?: string | null
          dashboard_layout?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: string | null
          email_notifications?: boolean | null
          push_notifications?: boolean | null
          notification_frequency?: string | null
          dashboard_layout?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bias_tests: {
        Row: {
          id: string
          organization_id: string
          model_id: string
          test_type: string
          protected_attribute: string
          result: string
          score: number | null
          threshold: number | null
          details: Json | null
          tested_by: string | null
          test_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id?: string
          model_id: string
          test_type: string
          protected_attribute: string
          result: string
          score?: number | null
          threshold?: number | null
          details?: Json | null
          tested_by?: string | null
          test_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          model_id?: string
          test_type?: string
          protected_attribute?: string
          result?: string
          score?: number | null
          threshold?: number | null
          details?: Json | null
          tested_by?: string | null
          test_date?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bias_tests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bias_tests_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bias_tests_tested_by_fkey"
            columns: ["tested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      use_cases: {
        Row: {
          id: string
          organization_id: string
          name: string
          description: string | null
          status: Database["public"]["Enums"]["use_case_status"]
          progress: number
          risk_level: Database["public"]["Enums"]["use_case_risk"]
          department: string | null
          owner_id: string | null
          owner_name: string | null
          model_id: string | null
          vendor_id: string | null
          business_justification: string | null
          target_completion_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id?: string
          name: string
          description?: string | null
          status?: Database["public"]["Enums"]["use_case_status"]
          progress?: number
          risk_level?: Database["public"]["Enums"]["use_case_risk"]
          department?: string | null
          owner_id?: string | null
          owner_name?: string | null
          model_id?: string | null
          vendor_id?: string | null
          business_justification?: string | null
          target_completion_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          description?: string | null
          status?: Database["public"]["Enums"]["use_case_status"]
          progress?: number
          risk_level?: Database["public"]["Enums"]["use_case_risk"]
          department?: string | null
          owner_id?: string | null
          owner_name?: string | null
          model_id?: string | null
          vendor_id?: string | null
          business_justification?: string | null
          target_completion_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "use_cases_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "use_cases_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "use_cases_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "use_cases_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_organization_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "viewer"
      incident_severity: "critical" | "high" | "medium" | "low"
      incident_status: "open" | "investigating" | "mitigated" | "closed"
      model_status: "approved" | "restricted" | "pending" | "blocked"
      risk_level: "high" | "medium" | "low"
      task_status: "todo" | "in_progress" | "review" | "completed"
      task_priority: "low" | "medium" | "high" | "critical"
      risk_severity: "negligible" | "minor" | "moderate" | "major" | "critical"
      risk_likelihood: "very_low" | "low" | "medium" | "high" | "very_high"
      mitigation_status: "not_started" | "in_progress" | "completed" | "accepted"
      policy_status: "draft" | "under_review" | "published" | "archived"
      evidence_type: "document" | "screenshot" | "audit_report" | "certification" | "test_result" | "other"
      notification_type: "task_assigned" | "deadline_approaching" | "incident_reported" | "assessment_required" | "policy_updated" | "system"
      use_case_status: "not_started" | "in_progress" | "completed" | "on_hold"
      use_case_risk: "low" | "medium" | "high"
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
      app_role: ["admin", "user", "viewer"],
      incident_severity: ["critical", "high", "medium", "low"],
      incident_status: ["open", "investigating", "mitigated", "closed"],
      model_status: ["approved", "restricted", "pending", "blocked"],
      risk_level: ["high", "medium", "low"],
      task_status: ["todo", "in_progress", "review", "completed"],
      task_priority: ["low", "medium", "high", "critical"],
      risk_severity: ["negligible", "minor", "moderate", "major", "critical"],
      risk_likelihood: ["very_low", "low", "medium", "high", "very_high"],
      mitigation_status: ["not_started", "in_progress", "completed", "accepted"],
      policy_status: ["draft", "under_review", "published", "archived"],
      evidence_type: ["document", "screenshot", "audit_report", "certification", "test_result", "other"],
      notification_type: ["task_assigned", "deadline_approaching", "incident_reported", "assessment_required", "policy_updated", "system"],
      use_case_status: ["not_started", "in_progress", "completed", "on_hold"],
      use_case_risk: ["low", "medium", "high"],
    },
  },
} as const
