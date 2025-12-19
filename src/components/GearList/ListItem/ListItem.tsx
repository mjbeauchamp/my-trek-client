import { useState, Fragment } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Checkbox } from '@headlessui/react';
import styles from './ListItem.module.scss';
import type { UserGearItem } from '../../../types/gearTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import type { GearList } from '../../../types/gearTypes';
import { Toaster, toast } from 'react-hot-toast';
import { isUserGearItem } from '../../../utils/validators/gearTypeValidators';

interface ListItemProps {
  openListItemDialog: (mode: 'create' | 'edit', item?: UserGearItem) => void;
  openDeleteItemDialog: (event: React.MouseEvent<HTMLButtonElement>, itemId: string) => void;
  updateItemRef: (itemId: string, el: HTMLLIElement | null) => void;
  setUserGearList: React.Dispatch<React.SetStateAction<GearList | null>>;
  item: UserGearItem;
  listId?: string;
}

export default function ListItem({
  openListItemDialog,
  openDeleteItemDialog,
  updateItemRef,
  setUserGearList,
  item,
  listId,
}: ListItemProps) {
  const [checked, setChecked] = useState(item?.quantityToPack === 0);
  const [showCheckAnimation, setShowCheckAnimation] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [itemLoading, setItemLoading] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  const updateItem = async (checkboxValue: boolean) => {
    if (!listId) {
      console.error('List ID not present when editing gear item');
      toast.error('There was a problem updating list item. Please try again');
      return;
    }

    if (!item?._id) {
      console.error('Item ID not present when editing gear item');
      toast.error('No list item selected to update. Please try again');
      return;
    }

    let quantityToPack = 0;

    if (!checkboxValue) {
      const quantityNeededNum = Number(item.quantityNeeded);

      if (isNaN(quantityNeededNum)) {
        console.error('Quantity needed not a valid number');
        toast.error('Please update Quantity Needed to a valid number');
        return;
      }

      quantityToPack = quantityNeededNum;
    }

    const newItemData = {
      itemData: {
        quantityToPack,
      },
    };

    try {
      setItemLoading(true);

      const token = await getAccessTokenSilently();

      if (!token) {
        console.error('No user token found');
        throw new Error('There was a problem updating gear item. User token not found.');
      }

      const res = await fetch(`http://localhost:4000/api/gear-lists/gear-list/${listId}/items/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newItemData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.message || 'Failed to update item');
      }

      const updatedList = await res.json();

      if (
        updatedList.listTitle &&
        Array.isArray(updatedList.items) &&
        updatedList.items.every((item: unknown) => isUserGearItem(item))
      ) {
        setChecked(checkboxValue);
        setShowCheckAnimation(checkboxValue);
        setUserGearList(updatedList);
      } else {
        toast('The server returned an unexpected response. Please try again.');
      }
    } catch (err: unknown) {
      console.error('There was an error updating item: ', err);
      toast('The server returned an unexpected response. Please try again.');
    } finally {
      setItemLoading(false);
    }
  };

  return (
    <li
      ref={(el) => {
        updateItemRef(item._id, el);
      }}
      className={`w-full ${styles['list-item-container']} ${showCheckAnimation ? styles.flash : ''}`}
    >
      <article>
        <div
          className={`${styles['list-item']} ${checked ? styles.checked : ''} ${showCheckAnimation ? styles.flash : ''}`}
        >
          <div className={`flex-align-start ${styles['item-info']}`}>
            <div className={`flex-align-start ${styles['item-header']}`}>
              <Checkbox checked={checked} onChange={() => updateItem(!checked)} as={Fragment} disabled={itemLoading}>
                <span className={`${styles['checkbox']} ${itemLoading ? styles['disabled'] : ''}`}>
                  <svg className={styles.check} viewBox="0 0 14 14" fill="none">
                    <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Checkbox>
              <div className={styles['header-text']}>
                <h3>{item.name}</h3>
                {item?.quantityNeeded && item.quantityNeeded > 1 && (
                  <p className={styles.quantity}>QTY: {item.quantityNeeded}</p>
                )}
              </div>
            </div>

            {item.notes && (
              <button onClick={() => setShowNotes((prev) => !prev)} className={`${styles['notes-toggle-btn']} btn`}>
                {showNotes ? 'Hide Notes' : 'View Notes'}
              </button>
            )}
          </div>

          <div className={styles['item-buttons']}>
            <button
              onClick={() => openListItemDialog('edit', item)}
              aria-label="Edit list item"
              className={styles['edit-button']}
              disabled={itemLoading}
            >
              <FontAwesomeIcon icon={faEdit} size="xl" />
            </button>
            <button
              onClick={(e) => openDeleteItemDialog(e, item._id)}
              aria-label="Delete list item"
              className={styles['delete-button']}
              disabled={itemLoading}
            >
              <FontAwesomeIcon icon={faTrash} size="xl" />
            </button>
          </div>
        </div>

        {item.notes ? (
          <div className={`${styles['notes-container']} ${showNotes ? styles.visible : ''}`}>
            {showNotes && <p className={styles.notes}>{item.notes}</p>}
          </div>
        ) : null}
      </article>
      <Toaster />
    </li>
  );
}
