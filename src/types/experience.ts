export type ExperienceFormState = {
  status?: "idle" | "success" | "error";
  errors?: {
    year_label?: string[];
    title?: string[];
    description?: string[];
    stack?: string[];
    highlights?: string[];
    sort_order?: string[];
    _form?: string[];
  };
};

export type PortfolioExperienceRow = {
  id: string;
  year_label: string;
  title: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  portfolio_experience_stacks?: {
    id: string;
    name: string;
    sort_order: number;
  }[];
  portfolio_experience_highlights?: {
    id: string;
    highlight: string;
    sort_order: number;
  }[];
};
