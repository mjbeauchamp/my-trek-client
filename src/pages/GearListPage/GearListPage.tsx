import { useEffect, useState, useContext, useMemo, useRef } from "react";
import { useParams } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import type { GearList, UserGearItem } from "../../types/gearTypes";
import { UserGearListsContext } from "../../providers/UserGearListsProvider";
import GearItemForm from "../../components/GearItemForm/GearItemForm";
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import { GEAR_CATEGORIES } from "../../constants/categories";
import type {GearCategoryId} from "../../constants/categories"


export default function GearListPage() {
    const { listId } = useParams();
    const {getGearListById, userGearLists} = useContext(UserGearListsContext);
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

    const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();

    const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});

    useEffect(() => {
        const list = getGearListById(listId);

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

        if (!listTitle) {
            //TODO: handle validation error here, prompt user to add a title
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
            setIsEditMetadataDialogOpen(false);
        }
        
        try {
            //TODO: Check that gear list data is formed correctly, and that the gear list contains all needed data
            // and isn't empty or something
            const token = await getAccessTokenSilently();
            // TODO: do error handling if there's no token or something
            const res = await fetch(`http://localhost:4000/api/gear-lists/gear-list/${listId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedGearListMetadata),
            })

            if (!res.ok) {
                // TODO: Handle error state
            }

            const data = await res.json();

            if (!data._id) {
                //TODO: hanlde this? Maybe show some kind of error or redirect back to GearLists page?
            } else {
                setUserGearList(data);
                setIsEditMetadataDialogOpen(false)
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div>
            <div>
                <h1>{userGearList?.listTitle}</h1>
                <p>{userGearList?.listDescription}</p>
                <button onClick={() => setIsEditMetadataDialogOpen(true)}>Edit</button>
            </div>
            
            <button onClick={() => openListItemDialog('create')}>
                Add Gear Item
            </button>

            <div>
                {GEAR_CATEGORIES.map((cat) => {
                    const items = categorizedList[cat.id];
                    if (!items || items.length === 0) return null; // skip empty categories

                    return (
                    <section key={cat.id}>
                        <h2>{cat.label}</h2>
                        <ul>
                        {items.map((item) => (
                            <li key={item._id} ref={(el) => (itemRefs.current[item._id] = el)}>
                            <span>{item.name}</span>
                            <div>
                                <button onClick={() => openListItemDialog('edit', item)}>
                                    Edit
                                </button>
                                <button onClick={(e) => openDeleteListDialog(e, item._id)}>DELETE</button>
                            </div>
                            </li>
                        ))}
                        </ul>
                    </section>
                    );
                })}
            </div>

            <ConfirmationModal 
                isOpen={isDeleteDialogOpen} 
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={deleteGearItem}
            />

            <Dialog open={isGearItemDialogOpen} onClose={closeListItemDialog} className="relative z-50">
                <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="bg-white p-6 rounded-lg max-w-md w-full shadow">
                    <DialogTitle className="text-lg font-semibold mb-4">
                        {itemDialogMode === "create" ? <span>Add Item</span> : <span>Edit Item</span>}
                    </DialogTitle>

                    <GearItemForm 
                        mode={itemDialogMode} 
                        listId={listId}
                        userGearListItems={userGearList?.items} 
                        setUserGearList={setUserGearList}
                        setNewItemId={setNewItemId}
                        closeListItemDialog={closeListItemDialog}
                        initialData={selectedItem}
                    />
                </DialogPanel>
                </div>
            </Dialog>

            <Dialog open={isEditMetadataDialogOpen} onClose={() => setIsEditMetadataDialogOpen(false)} className="relative z-50">
                <div>
                <DialogPanel>
                    <DialogTitle className="text-lg font-semibold mb-4">
                        Update List Info
                    </DialogTitle>

                    <form onSubmit={(e) => updateListMetadata(e)}>
                        <label>
                            <span>List Name</span>
                            <input type="text" value={listTitle} onChange={(e) => setListTitle(e.target.value)} />
                        </label>

                        <label>
                            <span>List Description (optional)</span>
                            <input type="text" value={listDescription} onChange={(e) => setListDescription(e.target.value)} />
                        </label>
                        <div>
                            <button type="button" onClick={() => setIsEditMetadataDialogOpen(false)}>Cancel</button>
                            <button type="submit">Update</button>
                        </div>
                    </form>
                </DialogPanel>
                </div>
            </Dialog>
        </div>
    );
}