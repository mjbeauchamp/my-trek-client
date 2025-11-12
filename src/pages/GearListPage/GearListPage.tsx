import { useEffect, useState, useContext, useMemo } from "react";
import { useParams } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import type { CommonGearItem, UserGearItem } from "../../types/gearTypes";
import { UserGearListsContext } from "../../providers/UserGearListsProvider";


export default function GearListPage() {
    const { listId } = useParams();
    const {getGearListById, userGearLists} = useContext(UserGearListsContext);

    const [commonGear, setCommonGear] = useState<CommonGearItem[]>([]);
    const [loadingCommonGear, setLoadingCommonGear] = useState(true);
    const [errorCommonGear, setErrorCommonGear] = useState('');
    const [newGearList, setNewGearlist] = useState<{listTitle: String, items: UserGearItem[]}>({
        listTitle: "MY AWESOME LIST",
        items: [
            { name: "Tent", quantityNeeded: 1 },
            { name: "Sleeping Bag", quantityNeeded: 1 },
        ]
    });

    const [userGearList, setUserGearList] = useState<{listTitle?: String, items?: UserGearItem[]}>({});
    const [loadingUserGearList, setLoadingUserGearList] = useState(false);
    const [errorUserGearList, setErrorUserGearList] = useState('');


    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const fetchCommonGear = async () => {
            try {
                const token = await getAccessTokenSilently();
                const res = await fetch("http://localhost:4000/api/commonGear", {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    //TODO: handle error
                }
                const data = await res.json();

                setCommonGear(data);
            } catch (err) {
                console.error("Error fetching gear:", err);
            } finally {
                setLoadingCommonGear(false);
            }
        };
        fetchCommonGear();
    }, [getAccessTokenSilently]);

    useEffect(() => {
        const list = getGearListById(listId);
        console.log('LISTID:', listId)

        if (list) {
            setUserGearList(list);
        } else {
            const fetchGearList = async () => {
                setLoadingUserGearList(true);
                setErrorUserGearList('');
                try {
                    const token = await getAccessTokenSilently();
                    const res = await fetch(`http://localhost:4000/api/gear-lists/gear-list/${listId}`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!res.ok) {
                        //TODO: handle error
                    }

                    const data = await res.json();

                    setUserGearList(data);

                    console.log(data)
                } catch (err) {
                    console.error("Error fetching gear:", err);
                    setErrorUserGearList('There was an error fetching gear list');
                } finally {
                    setLoadingUserGearList(false);
                }
            };
            fetchGearList();
        }
    }, [userGearLists, getAccessTokenSilently])

    const createList = async () => {
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

        console.log(data)

    }

    return (
        <div>
        <h1>{userGearList.listTitle}</h1>
        <button onClick={createList}>CREATE LIST!!</button>
        <ul>
            {commonGear.map(item => (
            <li key={item._id}>
                {item.name} - {item.category}
                {item.notes && ` (${item.notes})`}
            </li>
            ))}
        </ul>
        </div>
    );
}