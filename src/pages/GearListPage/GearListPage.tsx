import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';
import type { GearList, UserGearItem } from '../../types/gearTypes';
import useUserGearLists from '../../hooks/useUserGearLists';
import GearItemForm from '../../components/GearList/GearItemForm/GearItemForm';
import ConfirmationModal from '../../components/SharedUi/ConfirmationModal/ConfirmationModal';
import EditListModal from '../../components/GearList/EditListModal/EditListModal';
import { ErrorAlertBlock } from '../../components/SharedUi/ErrorAlertBlock/ErrorAlertBlock';
import GearListByCategory from '../../components/GearList/GearListByCategory/GearListByCategory';
import styles from './GearListPage.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import LoadingMessage from '../../components/SharedUi/LoadingMessage/LoadingMessage';
import { isGearList } from '../../utils/validators/gearTypeValidators';
import { parseFetchError } from '../../utils/parseFetchError';

export default function GearListPage() {
  const { listId } = useParams();
  const { getGearListById, userGearLists } = useUserGearLists();
  const [userGearList, setUserGearList] = useState<GearList | null>(null);
  const [loadingUserGearList, setLoadingUserGearList] = useState(false);
  const [errorUserGearList, setErrorUserGearList] = useState('');

  // List item create and edit dialog management
  const [isGearItemDialogOpen, setIsGearItemDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UserGearItem | null>(null);
  const [itemDialogMode, setItemDialogMode] = useState<'create' | 'edit'>('create');
  const [newItemId, setNewItemId] = useState('');

  // Delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState('');

  // Edit metadata dialog
  const [isEditMetadataDialogOpen, setIsEditMetadataDialogOpen] = useState(false);

  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();

  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});

  const updateItemRef = (itemId: string, el: HTMLLIElement | null) => {
    itemRefs.current[itemId] = el;
  };

  useEffect(() => {
    // Checking for gear list in useUserGearLists provider state
    const list = listId && getGearListById(listId);

    const fetchUserGearList = async () => {
      setLoadingUserGearList(true);
      setErrorUserGearList('');
      try {
        const token = await getAccessTokenSilently();

        if (!token) {
          console.warn('No user token found');
          setErrorUserGearList('There was a problem fetching gear lists: User token not found');
          return;
        }

        if (!listId) {
          console.warn('No list ID found');
          setErrorUserGearList('There was a problem fetching gear lists. Please try again.');
          return;
        }

        const res = await fetch(`http://localhost:4000/api/gear-lists/gear-list/${listId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const error = await res.json();
          console.error('Error fetching list: ', error);
          setErrorUserGearList('There was a problem fetching the gear list.');
          return;
        }

        const data = await res.json();

        if (isGearList(data)) {
          setUserGearList(data);
        } else {
          console.error('Error fetching gear list');
          setErrorUserGearList('There was an error fetching list. Please try again.');
        }
      } catch (err) {
        console.error('Error fetching gear:', err);
        setErrorUserGearList('There was an error fetching gear list');
      } finally {
        setLoadingUserGearList(false);
      }
    };

    if (list) {
      setUserGearList(list);
    } else {
      fetchUserGearList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listId, userGearLists, getAccessTokenSilently, user, isAuthenticated]);

  useEffect(() => {
    if (!newItemId) return;
    const el = itemRefs.current[newItemId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [newItemId]);

  function openListItemDialog(mode: 'create' | 'edit', item?: UserGearItem) {
    setItemDialogMode(mode);
    if (item) {
      setSelectedItem(item);
    }

    setIsGearItemDialogOpen(true);
  }

  function closeListItemDialog() {
    setIsGearItemDialogOpen(false);
    setSelectedItem(null);
  }

  const deleteGearItem = async () => {
    if (!pendingDeleteId) {
      console.error('No item ID found for item to delete');
      throw new Error('No item ID found for item to delete');
    }

    try {
      const token = await getAccessTokenSilently();

      if (!token) {
        throw new Error('There was a problem deleting gear item. No user token found.');
      }

      const res = await fetch(`http://localhost:4000/api/gear-lists/gear-list/${listId}/items/${pendingDeleteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const message = await parseFetchError(res);
        console.error('Error deleting list item:', message);
        throw new Error(message);
      }

      const updatedList = await res.json();

      if (isGearList(updatedList)) {
        setUserGearList(updatedList);
      } else {
        console.error('Error fetching gear list');
        setErrorUserGearList('There was an error fetching list. Please try again.');
      }
    } catch (error: any) {
      console.error('Error deleting list item: ', error);
      if (error instanceof Error) throw error;
      throw new Error('There was a problem deleting the list item. Please try again.');
    }
  };

  const openDeleteItemDialog = (event: React.MouseEvent<HTMLButtonElement>, itemId: string) => {
    event.preventDefault();
    event.stopPropagation();

    setPendingDeleteId(itemId);
    setIsDeleteDialogOpen(true);
  };

  const gearListRenderContent = () => {
    if (loadingUserGearList) {
      return <LoadingMessage title="Loading list..." />;
    } else if (errorUserGearList) {
      return <ErrorAlertBlock message="Whoops! There was an error fetching gear list." />;
    } else if (userGearList?.items && userGearList.items.length > 0) {
      return (
        <>
          <GearListByCategory
            listId={listId}
            userGearList={userGearList}
            updateItemRef={updateItemRef}
            openDeleteItemDialog={openDeleteItemDialog}
            openListItemDialog={openListItemDialog}
            setUserGearList={setUserGearList}
          />
        </>
      );
    }

    return null;
  };

  return (
    <div className={`content-container ${styles['gear-list-container']}`}>
      <Link to="/my-gear-lists" className="back-link">
        <FontAwesomeIcon icon={faArrowLeft} size="sm" />
        <span>My Gear Lists</span>
      </Link>
      <header>
        <div className={styles['list-details']}>
          <h1 className={`fjord-one ${styles.title}`}>{userGearList?.listTitle}</h1>
          <button
            onClick={() => setIsEditMetadataDialogOpen(true)}
            aria-label="Edit list title and description"
            className={styles['edit-list-details']}
          >
            <FontAwesomeIcon icon={faEdit} size="lg" />
          </button>
        </div>

        {userGearList?.listDescription ? <p className={styles.description}>{userGearList?.listDescription}</p> : null}
      </header>

      <hr className={styles['gear-list-page-separator']} />

      <button onClick={() => openListItemDialog('create')} className="btn large dark">
        Add Gear Item
      </button>
      {gearListRenderContent()}

      <ConfirmationModal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={deleteGearItem}
        title="Delete List Item"
        description="Are you sure you want to delete this list item?"
        actionBtnText="DELETE"
      />

      <ConfirmationModal
        isOpen={isGearItemDialogOpen}
        onClose={closeListItemDialog}
        title={itemDialogMode === 'create' ? 'Add Item' : 'Edit Item'}
      >
        <GearItemForm
          mode={itemDialogMode}
          listId={listId}
          userGearListItems={userGearList?.items}
          setUserGearList={setUserGearList}
          setNewItemId={setNewItemId}
          closeListItemDialog={closeListItemDialog}
          initialData={selectedItem}
        />
      </ConfirmationModal>

      <EditListModal
        isEditMetadataDialogOpen={isEditMetadataDialogOpen}
        userGearList={userGearList}
        setIsEditMetadataDialogOpen={setIsEditMetadataDialogOpen}
        setUserGearList={setUserGearList}
        listId={listId}
      />
    </div>
  );
}
