import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import type { CommonGearItem, GearList, UserGearItem } from "../../types/gearTypes";
import { UserGearListsContext } from "../../providers/UserGearListsProvider";
import GearItemForm from "../../components/GearItemForm/GearItemForm";


export default function GearListPage() {
    const { listId } = useParams();
    const {getGearListById, userGearLists} = useContext(UserGearListsContext);

    const [commonGear, setCommonGear] = useState<CommonGearItem[]>([]);
    const [loadingCommonGear, setLoadingCommonGear] = useState(true);
    const [errorCommonGear, setErrorCommonGear] = useState('');
    const [userGearList, setUserGearList] = useState<GearList | null>(null);
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
    }, [userGearLists, getAccessTokenSilently])

    return (
        <div>
        <h1>{userGearList?.listTitle}</h1>
        <p>{userGearList?.listDescription}</p>

        <GearItemForm listId={listId} setUserGearList={setUserGearList} />
        
        {userGearList?.items && userGearList.items.length > 0 ? 
            <ul>
                {userGearList.items.map(item => (
                <li key={item._id}>
                    {item.name} - {item.category}
                    {item.notes && ` (${item.notes})`}
                </li>
                ))}
            </ul> :
            null
        }
        </div>
    );
}