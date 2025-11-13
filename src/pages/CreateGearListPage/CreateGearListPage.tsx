import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import { UserGearListsContext } from "../../providers/UserGearListsProvider";

export default function CreateGearListPage() {
    const [listTitle, setListTitle] = useState('');
    const [listDescription, setListDescription] = useState('');
    const {setUserGearLists} = useContext(UserGearListsContext);

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
        <div>
            <form onSubmit={(e) => createList(e)}>
                <label>
                    <span>List Name</span>
                    <input type="text" value={listTitle} onChange={(e) => setListTitle(e.target.value)} />
                </label>

                <label>
                    <span>List Description (optional)</span>
                    <input type="text" value={listDescription} onChange={(e) => setListDescription(e.target.value)} />
                </label>

                <button type="submit">CREATE LIST!</button>
            </form>
        </div>
    )
}