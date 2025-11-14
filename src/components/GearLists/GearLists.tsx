import { useState, useEffect, useContext } from "react"
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router"
import type { GearList } from "../../types/gearTypes";
import { UserGearListsContext } from "../../providers/UserGearListsProvider";



export default function GearLists() {
    const {userGearLists, setUserGearLists} = useContext(UserGearListsContext)
    const { getAccessTokenSilently } = useAuth0();
    const [loadingUserGearLists, setLoadingUserGearLists] = useState(false);
    const [errorUserGearLists, setErrorUserGearLists] = useState('');

    useEffect(() => {
            const fetchGearLists = async () => {
                try {
                    const token = await getAccessTokenSilently();
                    const res = await fetch("http://localhost:4000/api/gear-lists", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const lists = await res.json();
                    setUserGearLists(lists);

                } catch (error) {
                    console.error(error)
                }

            }

            fetchGearLists();
    }, []);

    const deleteGearList = async (event: React.MouseEvent<HTMLButtonElement>, listId: string) => {
        event.preventDefault();
        event.stopPropagation();
        if (!listId) {
            //TODO: handle this
        }

        try {
            const token = await getAccessTokenSilently();
            const res = await fetch(`http://localhost:4000/api/gear-lists/gear-list/${listId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!res.ok) {
                //TODO: handle error
            }

            setLoadingUserGearLists(true);
            setErrorUserGearLists('');
            try {
                const token = await getAccessTokenSilently();
                    const res = await fetch("http://localhost:4000/api/gear-lists", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (!res.ok) {
                        //TODO: handle error
                    }

                    const lists = await res.json();
                    setUserGearLists(lists);

                

            } catch (err) {
                console.error("Error fetching gear:", err);
                setErrorUserGearLists('There was an error fetching gear list');
            } finally {
                setLoadingUserGearLists(false);
            }
        } catch (error) {
            //TODO: Handle error
        }

    }
    

    return (
        <div>
            MY GEAR LISTS GO HERE!
            
            
            { userGearLists.length < 1 || loadingUserGearLists ? <h1>Loading...</h1> : 
                <section>
                    <ul>
                        {userGearLists.map((list: GearList) => {
                            return (
                                <li key={list._id}>
                                    <Link to={`/my-gear-lists/${list._id}`}>
                                        <article>
                                            {list.listTitle}
                                            <button onClick={(e) => deleteGearList(e, list._id)}>DELETE</button>
                                        </article>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </section>
            } 
        </div>
    )
}