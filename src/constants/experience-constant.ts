import type { ExperienceFormState } from "@/types/experience";
import type { ExperienceForm } from "@/validations/experience-validation";

export const EXPERIENCE_TABLE_HEADER = [
  "No",
  "Experience",
  "Stack",
  "Status",
  "Sort",
  "Action",
];

export const INITIAL_EXPERIENCE_FORM: ExperienceForm = {
  year_label: "",
  title: "",
  description: "",
  stack: "",
  highlights: "",
  sort_order: 0,
  is_active: true,
};

export const INITIAL_STATE_EXPERIENCE_FORM: ExperienceFormState = {
  status: "idle",
  errors: {
    year_label: [],
    title: [],
    description: [],
    stack: [],
    highlights: [],
    sort_order: [],
    _form: [],
  },
};
