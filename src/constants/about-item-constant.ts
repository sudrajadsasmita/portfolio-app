import type { AboutItemFormState } from "@/types/about-item";
import type { AboutItemForm } from "@/validations/about-item-validation";

export const ABOUT_ITEM_TABLE_HEADER = [
  "No",
  "About Item",
  "Icon",
  "Status",
  "Sort",
  "Action",
];

export const INITIAL_ABOUT_ITEM_FORM: AboutItemForm = {
  title: "",
  description: "",
  icon: "",
  sort_order: 0,
  is_active: true,
};

export const INITIAL_STATE_ABOUT_ITEM_FORM: AboutItemFormState = {
  status: "idle",
  errors: {
    title: [],
    description: [],
    icon: [],
    sort_order: [],
    _form: [],
  },
};
