export const GEAR_CATEGORIES = [
  { id: "shelter", label: "Shelter & Sleep", order: 1 },
  { id: "clothing", label: "Clothing & Footwear", order: 2 },
  { id: "food", label: "Food & Cooking", order: 3 },
  { id: "water", label: "Water & Hydration", order: 4 },
  { id: "navigation", label: "Navigation", order: 5 },
  { id: "safety", label: "Safety & First Aid", order: 6 },
  { id: "toiletries", label: "Toiletries & Hygiene", order: 7 },
  { id: "electronics", label: "Electronics", order: 8 },
  { id: "personal", label: "Personal Items", order: 9 },
  { id: "misc", label: "Miscellaneous", order: 10 },
] as const;

export type GearCategoryId = string;

export const GEAR_CATEGORY_MAP: Record<string, string> = GEAR_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.id] = cat.label;
    return acc;
  },
  {} as Record<string, string>
);

export type GearCategory = (typeof GEAR_CATEGORIES)[number];