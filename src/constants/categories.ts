export const GEAR_CATEGORIES = [
  { id: 'shelter', label: 'Shelter & Sleep', order: 1 },
  { id: 'clothing', label: 'Clothing & Footwear', order: 2 },
  { id: 'weather', label: 'Weather Protection', order: 3 },
  { id: 'essentials', label: 'Wilderness Essentials', order: 4 },
  { id: 'cooking', label: 'Cooking', order: 5 },
  { id: 'food', label: 'Food & Snacks', order: 6 },
  { id: 'water', label: 'Water & Hydration', order: 7 },
  { id: 'toiletries', label: 'Toiletries & Hygiene', order: 8 },
  { id: 'navigation', label: 'Navigation', order: 9 },
  { id: 'safety', label: 'Safety & First Aid', order: 10 },
  { id: 'personal', label: 'Personal Items', order: 11 },
  { id: 'misc', label: 'Miscellaneous', order: 12 },
] as const;

export type GearCategoryId = string;

export const GEAR_CATEGORY_MAP: Record<string, string> = GEAR_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.id] = cat.label;
    return acc;
  },
  {} as Record<string, string>,
);

export type GearCategory = (typeof GEAR_CATEGORIES)[number];
