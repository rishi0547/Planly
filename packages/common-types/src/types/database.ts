export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PriorityLevel = 'low' | 'medium' | 'high';

export interface Database {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string | null;
          is_completed: boolean;
          priority: string | null;
          deadline: string | null;
          summary: string | null;
          summarized_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content?: string | null;
          is_completed?: boolean;
          priority?: string | null;
          deadline?: string | null;
          summary?: string | null;
          summarized_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string | null;
          is_completed?: boolean;
          priority?: string | null;
          deadline?: string | null;
          summary?: string | null;
          summarized_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Task = Database['public']['Tables']['notes']['Row'];
export type InsertTask = Database['public']['Tables']['notes']['Insert'];
export type UpdateTask = Database['public']['Tables']['notes']['Update'];

// Backward compatibility aliases
export type Note = Task;
