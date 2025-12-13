import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router';
import type { GearList } from '../../types/gearTypes';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import LoadingMessage from '../LoadingMessage/LoadingMessage';
import { ErrorAlertBlock } from '../ErrorAlertBlock/ErrorAlertBlock';
import useUserGearLists from '../../hooks/useUserGearLists';
import styles from './GearLists.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function GearLists() {
  const { userGearLists, setUserGearLists } = useUserGearLists();
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
        const res = await fetch('http://localhost:4000/api/gear-lists', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const lists = await res.json();
        setUserGearLists(lists);
      } catch (error) {
        console.error(error);
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
      //TODO: handle this
    }

    try {
      const token = await getAccessTokenSilently();
      const res = await fetch(`http://localhost:4000/api/gear-lists/gear-list/${pendingDeleteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        //TODO: handle error
      }

      setLoadingUserGearLists(true);
      setErrorUserGearLists('');
      try {
        const token = await getAccessTokenSilently();
        const res = await fetch('http://localhost:4000/api/gear-lists', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          //TODO: handle error
        }

        const lists = await res.json();

        setUserGearLists(lists);
      } catch (err) {
        console.error('Error fetching gear:', err);
        setErrorUserGearLists('There was an error fetching gear list');
      } finally {
        setLoadingUserGearLists(false);
      }
    } catch (error) {
      //TODO: Handle error

      console.error(error);
    }
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
                    <h2>{list.listTitle}</h2>
                    {list.listDescription && <p className={styles.description}>{list.listDescription}</p>}
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
        description="This action cannot be undone. Are you sure you want to permanently delete this gear list?"
        actionBtnText="DELETE"
      />
    </>
  );
}
