import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import useUserGearLists from "../../hooks/useUserGearLists";
import ActionPanel from "../../components/ActionPanel/ActionPanel";
import styles from "./CreateGearListPage.module.scss"


export default function CreateGearListPage() {
    const [listTitle, setListTitle] = useState('');
    const [listDescription, setListDescription] = useState('');
    const { setUserGearLists } = useUserGearLists();

    let navigate = useNavigate();
    const { getAccessTokenSilently } = useAuth0();

    const createList = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!listTitle) {
            //TODO: handle validation error here, prompt user to add a title
            return;
        }
        const newGearList = {
            listTitle: listTitle.trim(),
            listDescription: listDescription.trim(),
            items: []
        }
        
        try {
            //TODO: Check that gear list data is formed correctly, and that the gear list contains all needed data
            // and isn't empty or something
            const token = await getAccessTokenSilently();
            // TODO: do error handling if there's no token or something
            const res = await fetch("http://localhost:4000/api/gear-lists/gear-list", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newGearList),
            })

            if (!res.ok) {
                // TODO: Handle error state
            }

            const data = await res.json();

            if (!data._id) {
                //TODO: hanlde this? Maybe show some kind of error or redirect back to GearLists page?
            } else {
                setUserGearLists((prev: any) => [...prev, data])
                navigate(`/my-gear-lists/${data._id}`)
            }
        } catch (err) {
            console.error(err)
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
                            onChange={(e) => setListTitle(e.target.value)}
                            required
                            maxLength={100}
                            placeholder="e.g. Everest Trip"
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

                    <button type="submit" className="btn dark large">CREATE LIST</button>
                </form>
            </ActionPanel>
        </div>
    )
}