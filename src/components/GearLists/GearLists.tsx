import { useState, useEffect, useContext } from "react"
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router"
import type { GearList } from "../../types/gearTypes";
import { UserGearListsContext } from "../../providers/UserGearListsProvider";



export default function GearLists() {
    const {userGearLists, setUserGearLists} = useContext(UserGearListsContext)
    const { getAccessTokenSilently } = useAuth0();

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
    

    return (
        <div>
            MY GEAR LISTS GO HERE!
            
            
            { userGearLists.length < 1 ? <h1>Loading...</h1> : 
                <section>
                    <ul>
                        {userGearLists.map((list: GearList) => {
                            return (
                                <li key={list.listId}>
                                    <Link to={`/my-gear-lists/${list.listId}`}>
                                        <article>
                                            {list.listTitle}
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