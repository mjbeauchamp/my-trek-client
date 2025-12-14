import { useEffect, useState, useMemo, useRef } from 'react';
import { useParams } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';
import type { GearList, UserGearItem } from '../../types/gearTypes';
import useUserGearLists from '../../hooks/useUserGearLists';
import GearItemForm from '../../components/GearList/GearItemForm/GearItemForm';
import ConfirmationModal from '../../components/SharedUi/ConfirmationModal/ConfirmationModal';
import EditListModal from '../../components/GearList/EditListModal/EditListModal';
import { ErrorAlertBlock } from '../../components/SharedUi/ErrorAlertBlock/ErrorAlertBlock';
import { GEAR_CATEGORIES } from '../../constants/categories';
import type { GearCategoryId } from '../../constants/categories';
import styles from './GearListPage.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faCampground,
  faShirt,
  faCloudRain,
  faFireBurner,
  faTree,
  faUtensils,
  faBurger,
  faDroplet,
  faToiletPaper,
  faCompass,
  faBriefcaseMedical,
  faGlasses,
  faBinoculars,
} from '@fortawesome/free-solid-svg-icons';
import ListItem from '../../components/GearList/ListItem/ListItem';
import LoadingMessage from '../../components/SharedUi/LoadingMessage/LoadingMessage';

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

  const fetchUserGearList = async () => {
    setLoadingUserGearList(true);
    setErrorUserGearList('');
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`http://localhost:4000/api/gear-lists/gear-list/${listId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        //TODO: handle error
      }

      const data = await res.json();

      setUserGearList(data);
    } catch (err) {
      console.error('Error fetching gear:', err);
      setErrorUserGearList('There was an error fetching gear list');
    } finally {
      setLoadingUserGearList(false);
    }
  };

  useEffect(() => {
    const list = listId && getGearListById(listId);

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

  const categorizedList = useMemo(() => {
    if (!userGearList?.items || userGearList.items.length < 1) return {};

    const categories: Record<GearCategoryId, UserGearItem[]> = GEAR_CATEGORIES.reduce(
      (acc, cat) => {
        acc[cat.id] = [];
        return acc;
      },
      {} as Record<GearCategoryId, UserGearItem[]>,
    );

    userGearList.items.forEach((item) => {
      const catId: GearCategoryId = item.category || 'misc';
      categories[catId]?.push(item);
    });

    const result: Record<GearCategoryId, UserGearItem[]> = {};

    for (const [key, items] of Object.entries(categories) as [GearCategoryId, UserGearItem[]][]) {
      if (items.length > 0) result[key] = items;
    }

    return result;
  }, [userGearList]);

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
      //TODO: handle this
    }

    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`http://localhost:4000/api/gear-lists/gear-list/${listId}/items/${pendingDeleteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        //TODO: handle error
      }

      fetchUserGearList();
    } catch (error) {
      //TODO: Handle error
      console.error('There was a problem deleting gear item:', error);
    }
  };

  const openDeleteListDialog = (event: React.MouseEvent<HTMLButtonElement>, itemId: string) => {
    event.preventDefault();
    event.stopPropagation();

    setPendingDeleteId(itemId);
    setIsDeleteDialogOpen(true);
  };

  const startListMetadataEdit = () => {
    setIsEditMetadataDialogOpen(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'shelter':
        return faCampground;
      case 'clothing':
        return faShirt;
      case 'weather':
        return faCloudRain;
      case 'essentials':
        return faFireBurner;
      case 'cooking':
        return faUtensils;
      case 'food':
        return faBurger;
      case 'water':
        return faDroplet;
      case 'toiletries':
        return faToiletPaper;
      case 'navigation':
        return faCompass;
      case 'safety':
        return faBriefcaseMedical;
      case 'personal':
        return faGlasses;
      case 'misc':
        return faBinoculars;
      default:
        return faTree;
    }
  };

  const gearListRenderContent = () => {
    if (loadingUserGearList) {
      return <LoadingMessage title="Loading list..." />;
    } else if (errorUserGearList) {
      return <ErrorAlertBlock message="Whoops! There was an error fetching gear list." />;
    } else if (userGearList?.items && userGearList.items.length > 0) {
      return (
        <>
          <div className={styles['items-list-container']}>
            {GEAR_CATEGORIES.map((cat, i) => {
              const items = categorizedList[cat.id];
              // skip empty categories
              if (!items || items.length === 0) return null;

              return (
                <div key={cat.id}>
                  {i > 0 ? <hr /> : null}

                  <section className={styles['category-section']}>
                    <div className={styles['category-title']}>
                      <FontAwesomeIcon icon={getCategoryIcon(cat.id)} size="2xl" />
                      <h2>{cat.label}</h2>
                    </div>

                    <ul className={styles['items-list']}>
                      {items.map((item) => (
                        <ListItem
                          key={item._id}
                          item={item}
                          updateItemRef={updateItemRef}
                          openDeleteListDialog={openDeleteListDialog}
                          openListItemDialog={openListItemDialog}
                          listId={listId}
                          setUserGearList={setUserGearList}
                        />
                      ))}
                    </ul>
                  </section>
                </div>
              );
            })}
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div className={`content-container ${styles['gear-list-container']}`}>
      <header>
        <div className={styles['list-details']}>
          <h1 className={`merriweather ${styles.title}`}>{userGearList?.listTitle}</h1>
          <button
            onClick={startListMetadataEdit}
            aria-label="Edit list title and description"
            className={styles['edit-list-details']}
          >
            <FontAwesomeIcon icon={faEdit} size="lg" />
          </button>
        </div>

        {userGearList?.listDescription ? <p className={styles.description}>{userGearList?.listDescription}</p> : null}
      </header>

      <hr />

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
