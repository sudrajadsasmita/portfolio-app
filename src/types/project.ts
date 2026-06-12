export type ProjectFormState = {
  status?: "idle" | "success" | "error";
  errors?: {
    title?: string[];
    slug?: string[];
    description?: string[];
    image_url?: string[];
    image_alt?: string[];
    mockup_label?: string[];
    demo_url?: string[];
    source_url?: string[];
    case_study_url?: string[];
    stack?: string[];
    highlights?: string[];
    sort_order?: string[];
    _form?: string[];
  };
};

export type PortfolioProjectRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string | null;
  image_alt: string | null;
  mockup_label: string | null;
  demo_url: string | null;
  source_url: string | null;
  case_study_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  portfolio_project_stacks?: { id: string; name: string; sort_order: number }[];
  portfolio_project_highlights?: {
    id: string;
    highlight: string;
    sort_order: number;
  }[];
};
