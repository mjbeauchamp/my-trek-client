import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import { ClipLoader } from 'react-spinners';
import ConfirmationModal from '../../SharedUi/ConfirmationModal/ConfirmationModal';
import { ErrorAlertBlock } from '../../SharedUi/ErrorAlertBlock/ErrorAlertBlock';
import type { GearList } from '../../../types/gearTypes';
import { parseFetchError } from '../../../utils/parseFetchError';
import { isGearList } from '../../../utils/validators/gearTypeValidators';

interface EditListModalProps {
  isEditMetadataDialogOpen: boolean;
  userGearList: GearList | null;
  setIsEditMetadataDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUserGearList: React.Dispatch<React.SetStateAction<GearList | null>>;
  listId?: string;
}

export default function EditListModal({
  isEditMetadataDialogOpen,
  userGearList,
  setIsEditMetadataDialogOpen,
  setUserGearList,
  listId,
}: EditListModalProps) {
  const [listTitle, setListTitle] = useState('');
  const [listDescription, setListDescription] = useState('');
  const [editingError, setEditingError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (userGearList?.listTitle) setListTitle(userGearList.listTitle);
    if (userGearList?.listDescription) setListDescription(userGearList.listDescription);
  }, [userGearList]);

  const updateListMetadata = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = listTitle.trim();
    const trimmedDescription = listDescription.trim();

    if (!trimmedTitle) {
      console.warn('List name is required to create a gear list.');
      setEditingError('List name is required to create a gear list.');
      return;
    }

    if (trimmedTitle.length > 60) {
      setEditingError('List title cannot exceed 60 characters.');
      return;
    }
    if (trimmedDescription.length > 250) {
      setEditingError('List description cannot exceed 250 characters.');
      return;
    }

    const updatedGearListMetadata: { listTitle: string; listDescription: string } = {
      listTitle: trimmedTitle,
      listDescription: trimmedDescription,
    };

    if (
      !userGearList ||
      (userGearList?.listTitle === updatedGearListMetadata.listTitle &&
        userGearList.listDescription === updatedGearListMetadata.listDescription)
    ) {
      console.warn('Make a change to list name or description to update the selected list.');
      setEditingError('Make a change to list name or description to update the selected list.');
      return;
    }

    try {
      if (!listId) throw new Error('ListId required to update list.');

      const token = await getAccessTokenSilently();

      if (!token) {
        console.error('No user token found');
        setEditingError('There was a problem updating the gear list. User token not found.');
        return;
      }

      setEditLoading(true);

      const res = await fetch(`http://localhost:4000/api/gear-lists/gear-list/${listId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedGearListMetadata),
      });

      if (!res.ok) {
        const message = await parseFetchError(res);
        console.error('Error updating list:', message);
        setEditingError(`There was a problem updating the list: ${message}`);
        return;
      }

      const data = await res.json();

      if (!isGearList(data)) {
        setEditingError(`There was a problem fetching the updated list.`);
        console.error('Error updating list. Returned list data is incorrectly formatted');
        return;
      }

      setUserGearList(data);
      setIsEditMetadataDialogOpen(false);
    } catch (err) {
      console.error(err);
      setEditingError('There was a problem updating the gear list.');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <ConfirmationModal
      isOpen={isEditMetadataDialogOpen}
      onClose={() => setIsEditMetadataDialogOpen(false)}
      title="Update List"
    >
      <form onSubmit={(e) => updateListMetadata(e)}>
        <div className="input-container">
          <label htmlFor="listName">List Name</label>
          <input
            className="input-base"
            id="listName"
            type="text"
            value={listTitle}
            onChange={(e) => {
              setEditingError('');
              return setListTitle(e.target.value);
            }}
            maxLength={60}
            placeholder="e.g. Everest Trip"
            required
          />
        </div>

        <div className="input-container">
          <label htmlFor="listDescription">List Description (optional)</label>
          <input
            className="input-base"
            id="listDescription"
            type="text"
            value={listDescription}
            onChange={(e) => setListDescription(e.target.value)}
            maxLength={250}
          />
        </div>

        {editingError ? <ErrorAlertBlock message={editingError} /> : null}

        <div className="action-container">
          <button
            type="button"
            onClick={() => {
              setEditingError('');
              if (userGearList?.listTitle) setListTitle(userGearList.listTitle);
              if (userGearList?.listDescription) setListDescription(userGearList.listDescription);
              setIsEditMetadataDialogOpen(false);
            }}
            className="btn"
          >
            CANCEL
          </button>
          <button type="submit" className="btn dark" disabled={editLoading}>
            {editLoading ? <ClipLoader color="white" size="18px" speedMultiplier={0.7} /> : 'UPDATE'}
          </button>
        </div>
      </form>
    </ConfirmationModal>
  );
}
