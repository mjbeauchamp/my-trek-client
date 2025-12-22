import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router';
import type { GearList } from '../../types/gearTypes';
import ConfirmationModal from '../SharedUi/ConfirmationModal/ConfirmationModal';
import LoadingMessage from '../SharedUi/LoadingMessage/LoadingMessage';
import { ErrorAlertBlock } from '../SharedUi/ErrorAlertBlock/ErrorAlertBlock';
import useUserGearLists from '../../hooks/useUserGearLists';
import styles from './GearLists.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { isArrayOfGearLists } from '../../utils/validators/gearTypeValidators';
import { parseFetchError } from '../../utils/parseFetchError';

const apiUrl = import.meta.env.VITE_API_URL;

export default function GearLists() {
  const { userGearLists, setUserGearLists, removeGearList } = useUserGearLists();
  const { getAccessTokenSilently } = useAuth0();
  const [loadingUserGearLists, setLoadingUserGearLists] = useState(false);
  const [errorUserGearLists, setErrorUserGearLists] = useState('');
  // Delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState('');

  useEffect(() => {
    const fetchGearLists = async () => {
      try {
        setLoadingUserGearLists(true);
        const token = await getAccessTokenSilently();
        if (!token) {
          console.error('No user token found');
          setErrorUserGearLists('There was a problem fetching gear lists: User token not found');
          return;
        }
        const res = await fetch(`${apiUrl}/gear-lists`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const message = await parseFetchError(res);
          console.error(`There was a problem fetching gear lists: ${message}`);
          setErrorUserGearLists(message);
          return;
        }

        const lists = await res.json();

        if (!isArrayOfGearLists(lists)) {
          const error = await res.json();
          console.error(error?.message || 'Gear lists returned an unexpected format');
          setErrorUserGearLists(
            error?.message || 'There was a problem fetching gear lists. List formatted incorrectly.',
          );
          return;
        }

        setUserGearLists(lists);
      } catch (error) {
        if (error instanceof Error && error.message) {
          console.error('Error updating gear item:', error.message);
          setErrorUserGearLists(`There was a problem fetching gear lists: ${error.message}`);
        } else {
          console.error('Error updating gear item:', error);
          setErrorUserGearLists('There was a problem fetching gear lists');
        }
      } finally {
        setLoadingUserGearLists(false);
      }
    };

    fetchGearLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openDeleteListDialog = (event: React.MouseEvent<HTMLButtonElement>, listId: string) => {
    event.preventDefault();
    event.stopPropagation();

    setPendingDeleteId(listId);
    setIsDeleteDialogOpen(true);
  };

  const deleteGearList = async () => {
    if (!pendingDeleteId) {
      console.error('No gear list selected to update.');
      throw new Error('No gear list selected to update.');
    }

    try {
      const token = await getAccessTokenSilently();

      if (!token) {
        console.error('No user token found');
        throw new Error('There was a problem deleting gear item. No user token found.');
      }

      const res = await fetch(`${apiUrl}/gear-lists/gear-list/${pendingDeleteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const message = await parseFetchError(res);
        console.error('Error deleting list:', message);
        throw new Error(message);
      }

      removeGearList(pendingDeleteId);
    } catch (error) {
      console.error('Error deleting list: ', error);
      if (error instanceof Error) throw error;
      throw new Error('There was a problem deleting the list. Please try again.');
    }
  };

  const getDescriptionPreview = (description: string) => {
    return description.length <= 90 ? description : `${description.slice(0, 90).trim()}...`;
  };

  const listSectionContent = () => {
    if (loadingUserGearLists) {
      return <LoadingMessage title="Loading Gear Lists..." />;
    } else if (errorUserGearLists) {
      return <ErrorAlertBlock message={errorUserGearLists} />;
    } else if (userGearLists.length > 0) {
      return (
        <ul>
          {userGearLists.map((list: GearList) => {
            return (
              <li key={list._id} className={styles['gear-list']}>
                <article>
                  <Link to={`/my-gear-lists/${list._id}`}>
                    <h2 className="fjord-one">{list.listTitle}</h2>
                    {list.listDescription && (
                      <p className={styles.description}>{getDescriptionPreview(list.listDescription)}</p>
                    )}
                  </Link>

                  <button
                    onClick={(e) => openDeleteListDialog(e, list._id)}
                    className={styles['list-delete-button']}
                    aria-label="Delete gear list"
                  >
                    <FontAwesomeIcon icon={faTrash} size="lg" />
                  </button>
                </article>
              </li>
            );
          })}
        </ul>
      );
    }

    return null;
  };

  return (
    <>
      <section className={styles['gear-lists-list']}>{listSectionContent()}</section>
      <ConfirmationModal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={deleteGearList}
        title="Delete Gear List"
        description="This action can't be undone. Are you sure you want to permanently delete this gear list?"
        actionBtnText="DELETE"
      />
    </>
  );
}
