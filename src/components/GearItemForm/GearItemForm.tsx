import { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { GEAR_CATEGORIES } from '../../constants/categories';

import type { GearList, CommonGearItem, UserGearItem } from '../../types/gearTypes';

interface PropTypes {
  userGearListItems: UserGearItem[] | undefined;
  setUserGearList: React.Dispatch<React.SetStateAction<GearList | null>>;
  setNewItemId: React.Dispatch<React.SetStateAction<string>>;
  closeListItemDialog: () => void;
  mode: 'create' | 'edit';
  initialData?: any;
  listId?: string;
}

export default function GearItemForm({
  userGearListItems,
  setUserGearList,
  setNewItemId,
  closeListItemDialog,
  listId,
  mode = 'create',
  initialData,
}: PropTypes) {
  // Gear list item form data
  const [itemName, setItemName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [quantityNeeded, setQuantityNeeded] = useState(initialData?.quantityNeeded || '1');
  const [quantityToPack, setQuantityToPack] = useState(initialData?.quantityToPack || '1');
  const [quantityToShop, setQuantityToShop] = useState(initialData?.quantityToShop || '0');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Common gear item list
  const [commonGear, setCommonGear] = useState<CommonGearItem[]>([]);
  const [loadingCommonGear, setLoadingCommonGear] = useState(true);
  const [errorCommonGear, setErrorCommonGear] = useState('');
  const [query, setQuery] = useState('');
  const [selectedCommonGear, setSelectedCommonGear] = useState<CommonGearItem | null>(null);
  const commonGearInputRef = useRef<HTMLInputElement>(null);

  // Filter "Common Gear" options based on query
  const filtered =
    query === ''
      ? commonGear
      : commonGear.filter((gear) => gear.name.toLowerCase().includes(query.toLowerCase()));

  // Group "Common Gear" options by category
  const grouped: Record<string, CommonGearItem[]> = filtered.reduce(
    (acc: any, gear: any) => {
      if (!acc[gear.category]) acc[gear.category] = [];
      acc[gear.category].push(gear);
      return acc;
    },
    {} as Record<string, CommonGearItem[]>,
  );

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchCommonGear = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/commonGear');
        if (!res.ok) {
          //TODO: handle error
        }
        const data = await res.json();

        setCommonGear(data);
      } catch (err) {
        console.error('Error fetching gear:', err);
      } finally {
        setLoadingCommonGear(false);
      }
    };
    fetchCommonGear();
  }, []);

  const onCommonGearSelect = (gear: CommonGearItem | null) => {
    if (gear?.name) {
      setItemName(gear?.name);
    }
    if (gear?.category) {
      setCategory(gear?.category);
    }
  };

  const addGearListItem = async (newItem: {
    itemData: {
      name: any;
      category: any;
      quantityNeeded: number;
      quantityToPack: number;
      quantityToShop: number;
      notes: string;
    };
  }) => {
    try {
      setLoading(true);
      setError(null);

      const token = await getAccessTokenSilently();
      const res = await fetch(`http://localhost:4000/api/gear-lists/gear-list/${listId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) {
        throw new Error('Failed to add item');
      }
      const createdItem = await res.json();
      setLoading(false);
      setUserGearList((prev: any) => {
        return {
          ...prev,
          items: [...prev.items, createdItem],
        };
      });
      setNewItemId(createdItem._id);
    } catch (err: any) {
      //TODO: error handling
      setError(err.message || 'Error');
      setLoading(false);
    } finally {
      closeListItemDialog();
    }
  };

  const editGearListItem = async (newItem: {
    itemData: {
      name: any;
      category: any;
      quantityNeeded: number;
      quantityToPack: number;
      quantityToShop: number;
      notes: string;
    };
  }) => {
    if (!listId || !initialData._id) {
      // TODO: HANDLE ERROR, because if we don't have these we can't make the call
    }
    try {
      setLoading(true);
      setError(null);

      const token = await getAccessTokenSilently();
      const res = await fetch(
        `http://localhost:4000/api/gear-lists/gear-list/${listId}/items/${initialData._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newItem),
        },
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to edit item');
      }
      const updatedList = await res.json();

      setUserGearList(updatedList);
      setLoading(false);
    } catch (err: any) {
      //TODO: error handling
      setError(err.message || 'Error');
      setLoading(false);
    } finally {
      closeListItemDialog();
    }
  };

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO: VALIDATE/SANITIZE ALL TEXT VALUES
    if (!listId) {
      // TODO: Error handling
      return;
    }

    const quantityNeededNum = Number(quantityNeeded);
    if (isNaN(quantityNeededNum)) {
      //TODO: Clean up error handlin for all of these
      alert("Please enter a valid 'Quantity Needed' number");
      return;
    }

    const quantityToPackNum = Number(quantityToPack);
    if (isNaN(quantityToPackNum)) {
      alert("Please enter a valid 'Quantity to Pack' number");
      return;
    }

    const quantityToShopNum = Number(quantityToShop);
    if (isNaN(quantityToShopNum)) {
      alert("Please enter a valid 'Quantity to Shop' number");
      return;
    }

    const newItem = {
      itemData: {
        name: itemName.trim(),
        category: category.trim(),
        quantityNeeded: quantityNeededNum,
        quantityToPack: quantityToPackNum,
        quantityToShop: quantityToShopNum,
        notes,
      },
    };

    if (mode === 'create') {
      addGearListItem(newItem);
    } else if (mode === 'edit') {
      editGearListItem(newItem);
    }
  };

  return (
    <>
      {mode === 'create' ? (
        <div className="w-80">
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
                placeholder="Select common items"
                aria-label="Select Common Gear Item"
                onChange={(e) => setQuery(e.target.value)}
                onClick={() => {
                  commonGearInputRef.current?.blur();
                  commonGearInputRef.current?.focus();
                }}
                displayValue={(gear: CommonGearItem | null) => (gear ? gear.name : '')}
                className="input-base select-base"
              />

              <ComboboxOptions className="combobox-options">
                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category} className="combobox-group">
                    <h3 className="combobox-group-label">{category}</h3>
                    {items.map((gear) => {
                      const alreadyAdded = userGearListItems?.some(
                        (item: UserGearItem) => item.name === gear.name,
                      );
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
                          {alreadyAdded ? (
                            <span className="combobox-badge">Already in list</span>
                          ) : null}
                        </ComboboxOption>
                      );
                    })}
                  </div>
                ))}
              </ComboboxOptions>
            </div>
          </Combobox>
        </div>
      ) : null}

      <form onSubmit={(e) => submitForm(e)}>
        <div className="input-container">
          <label htmlFor="itemName">Item Name</label>
          <input
            className="input-base"
            id="itemName"
            type="text"
            value={itemName}
            onChange={(e) => {
              return setItemName(e.target.value);
            }}
            maxLength={60}
            placeholder="e.g. Sleeping Bag"
            required
          />
        </div>

        <div className="input-container">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            className="input-base select-base"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {GEAR_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="input-container">
          <label htmlFor="quantityNeeded">Quantity Needed</label>
          <input
            id="quantityNeeded"
            type="number"
            value={quantityNeeded}
            onChange={(e) => setQuantityNeeded(e.target.value)}
            className="input-base"
            min="1"
            max="100"
          />
        </div>

        {/* TODO: UPDATE WHEN PACKING LIST IS IMPLEMENTED */}
        {/* <div className="input-container">
                    <label htmlFor="quantityToPack">Quantity to Pack</label>
                    <input
                        id="quantityToPack"
                        type="number" 
                        value={quantityToPack} 
                        onChange={(e) => setQuantityToPack(e.target.value)}
                        className="input-base"
                        min="0"
                    />
                </div> */}

        {/* TODO: UPDATE WHEN SHOPPING LIST IS IMPLEMENTED */}
        {/* <div className="input-container">
                    <label htmlFor="quantityToShop">Quantity to Shop</label>
                    <input
                        id="quantityToShop"
                        type="number" 
                        value={quantityToShop} 
                        onChange={(e) => setQuantityToShop(e.target.value)}
                        className="input-base"
                        min="0"
                    />
                </div> */}

        <div className="input-container">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input-base"
            maxLength={500}
          />
        </div>

        <div className="action-container">
          <button type="button" onClick={closeListItemDialog} className="btn gray">
            CANCEL
          </button>

          <button type="submit" className="btn dark">
            {mode === 'create' ? <span>ADD</span> : <span>UPDATE</span>}
          </button>
        </div>
      </form>
    </>
  );
}
