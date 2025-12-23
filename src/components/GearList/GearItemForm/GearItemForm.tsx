import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ErrorAlertBlock } from '../../SharedUi/ErrorAlertBlock/ErrorAlertBlock';
import CommonGearDropdown from '../CommonGearDropdown/CommonGearDropdown';
import { GEAR_CATEGORIES } from '../../../constants/categories';
import type { GearList, CommonGearItem, UserGearItem, UserNewGearItem } from '../../../types/gearTypes';
import { isGearList, isUserGearItem } from '../../../utils/validators/gearTypeValidators';
import { parseFetchError } from '../../../utils/parseFetchError';

interface PropTypes {
  userGearListItems: UserGearItem[] | undefined;
  setUserGearList: React.Dispatch<React.SetStateAction<GearList | null>>;
  setNewItemId: React.Dispatch<React.SetStateAction<string>>;
  closeListItemDialog: () => void;
  mode: 'create' | 'edit';
  initialData?: UserGearItem | null;
  listId?: string;
}

const apiUrl = import.meta.env.VITE_API_URL;

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

  // TODO: GIVE USER ABILITY TO UPDATE quantityToPack AND quantityToShop ONCE SHOPPING LIST
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

  const addGearListItem = async (itemData: UserNewGearItem) => {
    if (!listId) {
      setError('No gear list selected to update.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = await getAccessTokenSilently();

      if (!token) {
        console.error('No user token found');
        setError('There was a problem adding the new list item. User token not found.');
        return;
      }

      const res = await fetch(`${apiUrl}/gear-lists/gear-list/${listId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemData }),
      });

      if (!res.ok) {
        const message = await parseFetchError(res);
        console.error('Error adding item to list:', message);
        setError(`There was a problem adding item to the list: ${message}`);
        return;
      }

      const createdItem = await res.json();

      if (isUserGearItem(createdItem)) {
        setUserGearList((prev: GearList | null) => {
          if (prev === null) return prev;

          return {
            ...prev,
            items: [...prev.items, createdItem],
          };
        });
        setNewItemId(createdItem._id);
        closeListItemDialog();
      } else {
        setError('The server returned an unexpected response. Please try again.');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error adding gear item:', error.message);
        setError(error.message);
      } else {
        console.error('Error adding gear item:', error);
        setError('There was an error adding gear item');
      }
    } finally {
      setLoading(false);
    }
  };

  const editGearListItem = async (itemData: UserNewGearItem) => {
    if (!listId) {
      setError('No gear list selected to update.');
      return;
    }

    if (!initialData?._id) {
      setError('No list item selected to update.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = await getAccessTokenSilently();

      if (!token) {
        console.error('No user token found');
        setError('There was a problem editing the gear list. User token not found.');
        return;
      }

      const res = await fetch(`${apiUrl}/gear-lists/gear-list/${listId}/items/${initialData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemData }),
      });

      if (!res.ok) {
        const message = await parseFetchError(res);
        console.error('Error updating list item:', message);
        setError(message);
        return;
      }

      const updatedList: GearList = await res.json();

      if (isGearList(updatedList)) {
        setUserGearList(updatedList);
        closeListItemDialog();
      } else {
        setError('The server returned an unexpected response. Please try again.');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error updating gear item:', error.message);
        setError(error.message);
      } else {
        console.error('Error updating gear item:', error);
        setError('There was an error updating gear item');
      }
    } finally {
      setLoading(false);
    }
  };

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!listId) {
      console.error('List ID not present when submitting gear item');
      setError('There was a problem adding new list item. Please try again.');
      return;
    }

    const quantityNeededNum = Number(quantityNeeded);
    const quantityToPackNum = Number(quantityToPack);
    const quantityToShopNum = Number(quantityToShop);

    const trimmedName = itemName.trim();
    const trimmedNotes = notes.trim();

    if (!trimmedName) {
      setError('Gear item name value must be provided');
      return;
    }

    if (trimmedName.length > 60) {
      setError('Gear item name cannot exceed 60 characters.');
      return;
    }

    if (trimmedNotes.length > 500) {
      setError('Notes text cannot exceed 500 characters.');
      return;
    }

    const newItem: UserNewGearItem = {
      name: trimmedName,
      category,
      quantityNeeded: quantityNeededNum,
      quantityToPack: quantityToPackNum,
      quantityToShop: quantityToShopNum,
      notes: trimmedNotes,
    };

    if (mode === 'create') {
      addGearListItem(newItem);
    } else if (mode === 'edit') {
      editGearListItem(newItem);
    }
  };

  return (
    <>
      <p className="form-explanation">Select from common gear, or create your own custom gear item</p>

      {mode === 'create' ? (
        <div className="w-80">
          <CommonGearDropdown onCommonGearSelect={onCommonGearSelect} userGearListItems={userGearListItems} />
        </div>
      ) : null}

      <form onSubmit={(e) => submitForm(e)}>
        <div className="input-container">
          <label htmlFor="itemName" className="text-base">
            Item Name
          </label>
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
          <label htmlFor="category" className="text-base">
            Category
          </label>
          <select
            id="category"
            className="input-base select-base"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>
              Select a category
            </option>
            {GEAR_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="input-container">
          <label htmlFor="quantityNeeded" className="text-base">
            Quantity Needed
          </label>
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

        {/* TODO: UPDATE TO SHOW INPUTS WHEN PACKING/SHOPPING LIST IS IMPLEMENTED */}
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
          <label htmlFor="notes" className="text-base">
            Notes
          </label>
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
          <button type="button" onClick={closeListItemDialog} className="btn outline">
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
