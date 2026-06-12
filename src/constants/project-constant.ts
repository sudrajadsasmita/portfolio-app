import type { ProjectFormState } from "@/types/project";
import type { ProjectForm } from "@/validations/project-validation";

export const PROJECT_TABLE_HEADER = [
  "No",
  "Project",
  "Stack",
  "Status",
  "Sort",
  "Action",
];

export const INITIAL_PROJECT_FORM: ProjectForm = {
  title: "",
  slug: "",
  description: "",
  image_url: "",
  image_alt: "",
  mockup_label: "",
  demo_url: "",
  source_url: "",
  case_study_url: "",
  stack: "",
  highlights: "",
  is_featured: false,
  is_published: true,
  sort_order: 0,
};

export const INITIAL_STATE_PROJECT_FORM: ProjectFormState = {
  status: "idle",
  errors: {
    title: [],
    slug: [],
    description: [],
    image_url: [],
    image_alt: [],
    mockup_label: [],
    demo_url: [],
    source_url: [],
    case_study_url: [],
    stack: [],
    highlights: [],
    sort_order: [],
    _form: [],
  },
};
