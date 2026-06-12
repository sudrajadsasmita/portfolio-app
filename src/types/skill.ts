export type SkillFormState = {
  status?: "idle" | "success" | "error";
  errors?: {
    category?: string[];
    name?: string[];
    description?: string[];
    icon?: string[];
    sort_order?: string[];
    _form?: string[];
  };
};

export type PortfolioSkillRow = {
  id: string;
  category: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
