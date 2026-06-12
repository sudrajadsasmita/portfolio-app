export type AboutItemFormState = {
  status?: "idle" | "success" | "error";
  errors?: {
    title?: string[];
    description?: string[];
    icon?: string[];
    sort_order?: string[];
    _form?: string[];
  };
};

export type PortfolioAboutItemRow = {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
