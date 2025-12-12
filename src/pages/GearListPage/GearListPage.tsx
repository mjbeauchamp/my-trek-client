import { useEffect, useState, useContext, useMemo, useRef } from "react";
import { useParams } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import type { GearList, UserGearItem } from "../../types/gearTypes";
import useUserGearLists from "../../hooks/useUserGearLists";
import GearItemForm from "../../components/GearItemForm/GearItemForm";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import { ErrorAlertBlock } from "../../components/ErrorAlertBlock/ErrorAlertBlock";
import { GEAR_CATEGORIES } from "../../constants/categories";
import type {GearCategoryId} from "../../constants/categories";
import styles from "./GearListPage.module.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
    faBinoculars
} from '@fortawesome/free-solid-svg-icons';
import { ClipLoader } from "react-spinners";
import ListItem from "../../components/GearList/ListItem/ListItem";

export default function GearListPage() {
    const { listId } = useParams();
    const { getGearListById,  userGearLists} = useUserGearLists();
    const [userGearList, setUserGearList] = useState<GearList | null>(null);
    const [loadingUserGearList, setLoadingUserGearList] = useState(false);
    const [errorUserGearList, setErrorUserGearList] = useState('');

    // List item create and edit dialog management
    const [isGearItemDialogOpen, setIsGearItemDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemDialogMode, setItemDialogMode] = useState<'create' | 'edit'>('create');
    const [newItemId, setNewItemId] = useState('');

    // Delete dialog
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState('');

    // Edit list metadata dialog
    const [isEditMetadataDialogOpen, setIsEditMetadataDialogOpen] = useState(false);
    const [listTitle, setListTitle] = useState('');
    const [listDescription, setListDescription] = useState('');
    const [editingError, setEditingError] = useState('');
    const [editLoading, setEditLoading] = useState(false);

    const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();

    const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});

    const updateItemRef = (itemId: string, el: HTMLLIElement | null) => {
        itemRefs.current[itemId] = el;
    }

    useEffect(() => {
        const list = listId && getGearListById(listId);

        if (list) {
            setUserGearList(list);
        } else {
            const fetchGearList = async () => {
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
                    console.error("Error fetching gear:", err);
                    setErrorUserGearList('There was an error fetching gear list');
                } finally {
                    setLoadingUserGearList(false);
                }
            };
            fetchGearList();
        }
    }, [userGearLists, getAccessTokenSilently, user, isAuthenticated]);

    useEffect(() => {
        if (!newItemId) return;
        const el = itemRefs.current[newItemId];
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [newItemId]);

    const categorizedList = useMemo(() => {
        if (!userGearList?.items || userGearList.items.length < 1) return {};

        const categories: Record<GearCategoryId, UserGearItem[]> = GEAR_CATEGORIES.reduce(
            (acc, cat) => {
            acc[cat.id] = [];
            return acc;
            },
            {} as Record<GearCategoryId, UserGearItem[]>
        );

        userGearList.items.forEach((item) => {
            const catId: GearCategoryId = item.category || "misc";
            categories[catId]?.push(item);
        });

         const result: Record<GearCategoryId, UserGearItem[]> = {};
         
        for (const [key, items] of Object.entries(categories) as [GearCategoryId, UserGearItem[]][]) {
            if (items.length > 0) result[key] = items;
        }

        return result;
    }, [userGearList]);

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
            console.error("Error fetching gear:", err);
            setErrorUserGearList('There was an error fetching gear list');
        } finally {
            setLoadingUserGearList(false);
        }
    }

    function openListItemDialog(mode: 'create' | 'edit', item?: any) {
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
                    'Content-Type': 'application/json'
                },
            });

            if (!res.ok) {
                //TODO: handle error
            }

            fetchUserGearList();
            return "Item deleted successfully!"
        } catch (error) {
            //TODO: Handle error
        }

    }

    const openDeleteListDialog = (event: React.MouseEvent<HTMLButtonElement>, itemId: string) => {
        event.preventDefault();
        event.stopPropagation();

        setPendingDeleteId(itemId);
        setIsDeleteDialogOpen(true);
    }

    const updateListMetadata = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!listTitle || !listTitle.trim()) {
            console.warn("List name is required to create a gear list.");
            setEditingError("List name is required to create a gear list.")
            return;
        }

        if (listTitle.trim().length > 100) {
            setEditingError("List title cannot exceed 100 characters.");
            return;
        }
        if (listDescription.trim().length > 250) {
            setEditingError("List description cannot exceed 250 characters.");
            return;
        }

        const updatedGearListMetadata: any = {
            listTitle: listTitle.trim(),
            listDescription: listDescription.trim(),
        }

        if (
            !userGearList || (userGearList?.listTitle === updatedGearListMetadata[listTitle] &&
                userGearList.listDescription === updatedGearListMetadata[listDescription]
            )
        ) {
            setEditingError("There was an issue updating list.");
            return;
        }
        
        try {
            const token = await getAccessTokenSilently();
           
            if (!token) {
                console.error("No user token found");
                setEditingError("There was a problem updating the gear list. User token not found.");
                return;
            }

            setEditLoading(true);

            const res = await fetch(`http://localhost:4000/api/gear-lists/gear-list/${listId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedGearListMetadata),
            })

            if (!res.ok) {
                const serverError = await res.json();
                console.error("Server error: ", serverError);
                setEditingError("There was a problem updating the gear list.");
                return;
            }

            const data = await res.json();

            if (!data._id) {
                console.error("There was a problem fetching the gear list.");
                setEditingError("There was a problem fetching the gear list.");
            } else {
                setUserGearList(data);
                setIsEditMetadataDialogOpen(false)
            }
        } catch (err) {
            console.error(err);
            setEditingError("There was a problem updating the gear list.");
        }
        finally {
            setEditLoading(false);
        }
    }

    const startListMetadataEdit = () => {
        setListTitle(userGearList?.listTitle || '')
        setListDescription(userGearList?.listDescription || '')
        setIsEditMetadataDialogOpen(true);
    }

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "shelter":
                return faCampground;
            case "clothing":
                return faShirt;
            case "weather":
                return faCloudRain;
            case "essentials":
                return faFireBurner;
            case "cooking":
                return faUtensils;
            case "food":
                return faBurger;
            case "water":
                return faDroplet;
            case "toiletries":
                return faToiletPaper;
            case "navigation":
                return faCompass;
            case "safety":
                return faBriefcaseMedical;
            case "personal":
                return faGlasses;
            case "misc":
                return faBinoculars;
            default:
                return faTree;
        }
    }

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

            <div className={styles['items-list-container']}>
                {GEAR_CATEGORIES.map((cat, i) => {
                    const items = categorizedList[cat.id];
                    // skip empty categories
                    if (!items || items.length === 0) return null;

                    return (
                        <div key={cat.id} >
                            {i > 0? <hr /> : null}

                            <section className={styles['category-section']}>
                                <div className={styles['category-title']}>
                                    <FontAwesomeIcon icon={getCategoryIcon(cat.id)} size="xl" />
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
                title={itemDialogMode === "create" ? "Add Item" : "Edit Item"}
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
                                return setListTitle(e.target.value)
                            }}
                            maxLength={100}
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

                    {editingError ? <ErrorAlertBlock message={editingError} /> : null
                                        }
    
                    <div className="action-container">
                        <button type="button" onClick={() => setIsEditMetadataDialogOpen(false)} className="btn">CANCEL</button>
                        <button type="submit" className="btn dark" disabled={editLoading}>
                            { editLoading ? <ClipLoader color="white" size="18px" speedMultiplier={0.7} />  : 'UPDATE'}
                        </button>
                    </div>
                </form>
            </ConfirmationModal>
        </div>
    );
}