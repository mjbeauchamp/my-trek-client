import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ErrorAlertBlock } from '../../SharedUi/ErrorAlertBlock/ErrorAlertBlock';
import CommonGearDropdown from '../CommonGearDropdown/CommonGearDropdown';
import { GEAR_CATEGORIES } from '../../../constants/categories';

import type { GearList, CommonGearItem, UserGearItem, UserNewGearItem } from '../../../types/gearTypes';

interface PropTypes {
  userGearListItems: UserGearItem[] | undefined;
  setUserGearList: React.Dispatch<React.SetStateAction<GearList | null>>;
  setNewItemId: React.Dispatch<React.SetStateAction<string>>;
  closeListItemDialog: () => void;
  mode: 'create' | 'edit';
  initialData?: UserGearItem | null;
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
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO: GIVE USER ABILITY TO UPDATE THESE WHEN SHOPPING LIST
  // AND PACKING LIST TABS ARE SUPPORTED
  // eslint-disable-next-line
  const [quantityToPack, setQuantityToPack] = useState(initialData?.quantityToPack || '1');
  // eslint-disable-next-line
  const [quantityToShop, setQuantityToShop] = useState(initialData?.quantityToShop || '0');

  const { getAccessTokenSilently } = useAuth0();

  const onCommonGearSelect = (gear: CommonGearItem | null) => {
    if (gear?.name) {
      setItemName(gear?.name);
    }
    if (gear?.category) {
      setCategory(gear?.category);
    }
  };

  const addGearListItem = async (newItem: { itemData: UserNewGearItem }) => {
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

      setUserGearList((prev: GearList | null) => {
        if (prev === null) return prev;

        return {
          ...prev,
          items: [...prev.items, createdItem],
        };
      });
      setNewItemId(createdItem._id);
      closeListItemDialog();
    } catch (error) {
      console.error('Error adding gear item:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('There was an error adding gear item');
      }
    } finally {
      setLoading(false);
    }
  };

  const editGearListItem = async (newItem: { itemData: UserNewGearItem }) => {
    if (!listId || !initialData?._id) {
      // TODO: HANDLE ERROR, because if we don't have these we can't make the call
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const token = await getAccessTokenSilently();
      const res = await fetch(`http://localhost:4000/api/gear-lists/gear-list/${listId}/items/${initialData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to edit item');
      }
      const updatedList = await res.json();

      setUserGearList(updatedList);
      closeListItemDialog();
    } catch (error) {
      //TODO: error handling
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('There was an error updating gear item');
      }
    } finally {
      setLoading(false);
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

    const newItem: { itemData: UserNewGearItem } = {
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
          <CommonGearDropdown onCommonGearSelect={onCommonGearSelect} userGearListItems={userGearListItems} />
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

        {error && <ErrorAlertBlock message={error} />}

        <div className="action-container">
          <button type="button" onClick={closeListItemDialog} className="btn gray">
            CANCEL
          </button>

          <button type="submit" className="btn dark" disabled={loading}>
            {mode === 'create' ? <span>ADD</span> : <span>UPDATE</span>}
          </button>
        </div>
      </form>
    </>
  );
}
