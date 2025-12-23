import { useState, useEffect, useRef } from 'react';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Field, Label } from '@headlessui/react';
import type { CommonGearItem, UserGearItem } from '../../../types/gearTypes';
import { GEAR_CATEGORIES } from '../../../constants/categories';
import { parseFetchError } from '../../../utils/parseFetchError';

interface PropTypes {
  onCommonGearSelect: (gear: CommonGearItem | null) => void;
  userGearListItems: UserGearItem[] | undefined;
}

const apiUrl = import.meta.env.VITE_API_URL;

export default function CommonGearDropdown({ onCommonGearSelect, userGearListItems }: PropTypes) {
  const [commonGear, setCommonGear] = useState<CommonGearItem[]>([]);
  const [query, setQuery] = useState('');
  const [selectedCommonGear, setSelectedCommonGear] = useState<CommonGearItem | null>(null);
  const [hideComboBox, setHideComboBox] = useState(false);

  const commonGearInputRef = useRef<HTMLInputElement>(null);

  const categoryMetaById = Object.fromEntries(GEAR_CATEGORIES.map((cat) => [cat.id, cat]));
  const categoryMetaByLabel = Object.fromEntries(GEAR_CATEGORIES.map((cat) => [cat.label, cat]));

  // Filter "Common Gear" options based on query
  const filtered =
    query === '' ? commonGear : commonGear.filter((gear) => gear.name.toLowerCase().includes(query.toLowerCase()));

  // Group "Common Gear" options by category
  const groupedCategories = filtered.reduce<Record<string, CommonGearItem[]>>((acc, gearItem) => {
    if (!gearItem.category) return acc;

    const categoryMeta = categoryMetaById[gearItem.category];
    const categoryTitle = categoryMeta?.label ?? gearItem.category;

    acc[categoryTitle] ??= [];
    acc[categoryTitle].push(gearItem);

    return acc;
  }, {});

  const sortedCategories = Object.entries(groupedCategories).toSorted(([labelA], [labelB]) => {
    // Categories are sorted by order
    // In the event there is no order value, category is given a high number so it will be included last
    const orderA = categoryMetaByLabel[labelA]?.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = categoryMetaByLabel[labelB]?.order ?? Number.MAX_SAFE_INTEGER;

    return orderA - orderB;
  });

  useEffect(() => {
    const fetchCommonGear = async () => {
      try {
        const res = await fetch(`${apiUrl}/commonGear`);

        if (!res.ok) {
          const message = await parseFetchError(res);
          console.error('Error fetching common gear items:', message);
          setHideComboBox(true);
          return;
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error('Common gear formatting incorrect');
          setHideComboBox(true);
          return;
        }

        setCommonGear(data);
      } catch (err) {
        console.error('Failed to fetch common gear items:', err);
        setHideComboBox(true);
      }
    };
    fetchCommonGear();
  }, []);

  return (
    <>
      {hideComboBox ? null : (
        <Field className="combobox-field">
          <Label className="combobox-label">Select from Common Items</Label>
          <Combobox
            value={selectedCommonGear}
            onChange={(gear) => {
              setSelectedCommonGear(gear);
              onCommonGearSelect(gear);
            }}
            onClose={() => setQuery('')}
            immediate
          >
            <div className="combobox-container">
              <ComboboxInput
                ref={commonGearInputRef}
                placeholder="Search & select common gear"
                onChange={(e) => setQuery(e.target.value)}
                onClick={() => {
                  commonGearInputRef.current?.blur();
                  commonGearInputRef.current?.focus();
                }}
                displayValue={(gear: CommonGearItem | null) => (gear ? gear.name : '')}
                className="input-base select-base"
              />

              <ComboboxOptions className="combobox-options">
                {sortedCategories.map(([category, items]) => (
                  <div key={category} role="presentation" className="combobox-group">
                    <h3 className="combobox-group-label" aria-hidden="true">
                      {category}
                    </h3>
                    {items.map((gear) => {
                      const alreadyAdded = userGearListItems?.some((item: UserGearItem) => item.name === gear.name);
                      return (
                        <ComboboxOption
                          key={gear._id}
                          value={gear}
                          disabled={alreadyAdded}
                          className={({ disabled }) =>
                            `combobox-option
                                                    ${disabled ? 'disabled' : ''}`
                          }
                        >
                          {gear.name}
                          {alreadyAdded ? <span className="combobox-badge">Already in list</span> : null}
                        </ComboboxOption>
                      );
                    })}
                  </div>
                ))}
              </ComboboxOptions>
            </div>
          </Combobox>
        </Field>
      )}
    </>
  );
}
