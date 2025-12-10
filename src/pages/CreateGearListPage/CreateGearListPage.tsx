import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import useUserGearLists from "../../hooks/useUserGearLists";
import ActionPanel from "../../components/ActionPanel/ActionPanel";
import { ErrorAlertBlock } from "../../components/ErrorAlertBlock/ErrorAlertBlock";
import styles from "./CreateGearListPage.module.scss"
import type { GearList } from "../../types/gearTypes";
import {ClipLoader} from 'react-spinners'


export default function CreateGearListPage() {
    const [listTitle, setListTitle] = useState('');
    const [listDescription, setListDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { setUserGearLists } = useUserGearLists();

    let navigate = useNavigate();
    const { getAccessTokenSilently } = useAuth0();

    const createList = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError('');

        if (!listTitle || !listTitle.trim()) {
            console.warn("List name is required to create a gear list.");
            setError("List name is required to create a gear list.")
            return;
        }

        if (listTitle.trim().length > 100) {
            setError("List title cannot exceed 100 characters.");
            return;
        }
        if (listDescription.trim().length > 250) {
            setError("List description cannot exceed 250 characters.");
            return;
        }

        const newGearList = {
            listTitle: listTitle.trim(),
            listDescription: listDescription.trim(),
            items: []
        }
        
        try {
            const token = await getAccessTokenSilently();

            if (!token) {
                console.error("No user token found");
                setError("There was a problem creating the gear list. User token not found.");
                return;
            }

            setLoading(true);

            const res = await fetch("http://localhost:4000/api/gear-lists/gear-list", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newGearList),
            })

            if (!res.ok) {
                const serverError = await res.json();
                console.error("Server error: ", serverError);
                setError("There was a problem creating the gear list.");
                return;
            }

            const data = await res.json();

            if (!data._id) {
                console.error("There was a problem fetching the gear list.");
                setError("There was a problem fetching the gear list.");
            } else {
                setUserGearLists((prev: GearList[]) => [...prev, data])
                navigate(`/my-gear-lists/${data._id}`)
            }
        } catch (err) {
            console.error(err);
            setError("There was a problem creating the gear list.");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className={`content-container ${styles['create-gear-list']}`}>
            <ActionPanel headingTag="h1" title="Create Your Gear List">
                <form onSubmit={(e) => createList(e)}>
                    <div className={styles['input-container']}>
                        <label htmlFor="listName">List Name</label>
                        <input 
                            className="input-base"
                            id="listName" 
                            type="text" 
                            value={listTitle} 
                            onChange={(e) => {
                                setError('');
                                return setListTitle(e.target.value)
                            }}
                            maxLength={100}
                            placeholder="e.g. Everest Trip"
                            required
                        />
                    </div>

                    <div className={styles['input-container']}>
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

                    {error ? <ErrorAlertBlock message={error} /> : null
                    }

                    <button type="submit" className="btn dark large" disabled={loading}>
                        { loading ? <ClipLoader color="white" speedMultiplier={0.7} />  : 'CREATE LIST'}
                    </button>
                </form>
            </ActionPanel>
        </div>
    )
}