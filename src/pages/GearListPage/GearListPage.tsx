import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import type { CommonGearItem, GearList, UserGearItem } from "../../types/gearTypes";
import { UserGearListsContext } from "../../providers/UserGearListsProvider";
import GearItemForm from "../../components/GearItemForm/GearItemForm";
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';



export default function GearListPage() {
    const { listId } = useParams();
    const {getGearListById, userGearLists} = useContext(UserGearListsContext);
    const [userGearList, setUserGearList] = useState<GearList | null>(null);
    const [loadingUserGearList, setLoadingUserGearList] = useState(false);
    const [errorUserGearList, setErrorUserGearList] = useState('');

    // List item create and edit modal management
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemDialogMode, setItemDialogMode] = useState<'create' | 'edit'>('create');


    const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();

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
        
        setIsDialogOpen(true);
    }

    function closeListItemDialog() {
        setIsDialogOpen(false);
        setSelectedItem(null);
    }

    const deleteGearItem = async (itemId: string) => {
        if (!itemId) {
            //TODO: handle this
        }

        try {
            const token = await getAccessTokenSilently();
            const res = await fetch(`http://localhost:4000/api/gear-lists/gear-list/${listId}/items/${itemId}`, {
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
        } catch (error) {
            //TODO: Handle error
        }

    }

    return (
        <div>
            <h1>{userGearList?.listTitle}</h1>
            <p>{userGearList?.listDescription}</p>
            <button onClick={() => openListItemDialog('create')}>
                Add Gear Item
            </button>
            
            {userGearList?.items && userGearList.items.length > 0 ? 
                <ul>
                    {userGearList.items.map(item => (
                    <li key={item._id}>
                        {item.name} - {item.category}
                        {item.notes && ` (${item.notes})`}
                        <button onClick={() => openListItemDialog('edit', item)}>
                            Edit
                        </button>
                        <button onClick={() => deleteGearItem(item._id)}>DELETE</button>
                    </li>
                    ))}
                </ul> :
                null
            }

            <Dialog open={isDialogOpen} onClose={closeListItemDialog} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

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
                        closeListItemDialog={closeListItemDialog}
                        initialData={selectedItem}
                    />
                </DialogPanel>
                </div>
            </Dialog>
        </div>
    );
}