import type { SkillFormState } from "@/types/skill";
import type { SkillForm } from "@/validations/skill-validation";

export const SKILL_TABLE_HEADER = [
  "No",
  "Skill",
  "Category",
  "Status",
  "Sort",
  "Action",
];

export const SKILL_CATEGORY_OPTIONS = [
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "AI",
];

export const INITIAL_SKILL_FORM: SkillForm = {
  category: "Frontend",
  name: "",
  description: "",
  icon: "",
  sort_order: 0,
  is_active: true,
};

export const INITIAL_STATE_SKILL_FORM: SkillFormState = {
  status: "idle",
  errors: {
    category: [],
    name: [],
    description: [],
    icon: [],
    sort_order: [],
    _form: [],
  },
};
