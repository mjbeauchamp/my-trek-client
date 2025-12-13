import { useState, Fragment } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import { Checkbox } from '@headlessui/react';
import styles from './ListItem.module.scss';
import type { UserGearItem } from '../../../types/gearTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import type { GearList } from '../../../types/gearTypes';

interface ListItemProps {
  openListItemDialog: (mode: 'create' | 'edit', item?: any) => void;
  openDeleteListDialog: (event: React.MouseEvent<HTMLButtonElement>, itemId: string) => void;
  updateItemRef: (itemId: string, el: HTMLLIElement | null) => void;
  setUserGearList: React.Dispatch<React.SetStateAction<GearList | null>>;
  item: UserGearItem;
  listId?: string;
}

export default function ListItem({
  openListItemDialog,
  openDeleteListDialog,
  updateItemRef,
  setUserGearList,
  item,
  listId,
}: ListItemProps) {
  const [checked, setChecked] = useState(item?.quantityToPack === 0);
  const [showCheckAnimation, setShowCheckAnimation] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  const updateItem = async (checkValueUpdate: boolean) => {
    setChecked(checkValueUpdate);
    setShowCheckAnimation(checkValueUpdate);

    // TODO: VALIDATE/SANITIZE TEXT VALUES
    if (!listId) {
      // TODO: Error handling
      return;
    }

    if (!item?._id) {
      // TODO: HANDLE ERROR, because if we don't have these we can't make the call
    }

    let quantityToPack = item.quantityNeeded;

    if (checkValueUpdate) {
      quantityToPack = 0;
    }

    const newItem = {
      itemData: {
        quantityToPack,
      },
    };

    try {
      // setLoading(true);
      // setError(null);

      const token = await getAccessTokenSilently();
      const res = await fetch(`http://localhost:4000/api/gear-lists/gear-list/${listId}/items/${item._id}`, {
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
      // setLoading(false);
    } catch (err: unknown) {
      //TODO: error handling
      // Re-load the list
      // setError(err.message || "Error");
      // setLoading(false);
      console.error('There was an error updating item: ', err);
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
              <Checkbox checked={checked} onChange={() => updateItem(!checked)} as={Fragment}>
                <span className={styles['checkbox']}>
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
            >
              <FontAwesomeIcon icon={faEdit} size="xl" />
            </button>
            <button
              onClick={(e) => openDeleteListDialog(e, item._id)}
              aria-label="Delete list item"
              className={styles['delete-button']}
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
    </li>
  );
}
