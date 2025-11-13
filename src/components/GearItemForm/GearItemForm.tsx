import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import type { GearList } from "../../types/gearTypes";

interface PropTypes {
    setUserGearList: React.Dispatch<React.SetStateAction<GearList | null>>,
    listId?: string
}


export default function GearItemForm({setUserGearList, listId}: PropTypes) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [itemName, setItemName] = useState('');
    const [category, setCategory] = useState('');
    const [quantityNeeded, setQuantityNeeded] = useState('1');
    const [quantityToPack, setQuantityToPack] = useState('1');
    const [quantityToShop, setQuantityToShop] = useState('0');
    const [notes, setNotes] = useState('');

    const { getAccessTokenSilently } = useAuth0();


    const addGearListItem = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // TODO: VALIDATE/SANITIZE ALL TEXT VALUES
        if (!listId) {
            // TODO: Error handling
            return;
        }
        
        try {
            const quantityNeededNum = Number(quantityNeeded);
            if (isNaN(quantityNeededNum)) {
                //TODO: Clean up error handlin for all of these
                alert("Please enter a valid 'Quantity Needed' number");
                return;
            }

            const quantityToPackNum = Number(quantityToPack);
            if (isNaN(quantityToPackNum)) {
                alert("Please enter a valid 'Quantity to Pack' number");
                return;
            }

            const quantityToShopNum = Number(quantityToShop);
            if (isNaN(quantityToShopNum)) {
                alert("Please enter a valid 'Quantity to Shop' number");
                return;
            }

            const newItem = {
                itemData: {
                    name: itemName.trim(),
                    category: category.trim(),
                    quantityNeededNum,
                    quantityToPackNum,
                    quantityToShopNum,
                    notes
                }
            }

            setLoading(true);
            setError(null);

            const token = await getAccessTokenSilently();
            const res = await fetch(`http://localhost:4000/api/gear-lists/gear-list/${listId}/items`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json" ,
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newItem),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.message || "Failed to add item");
            }
            const createdItem = await res.json();
            setLoading(false);
            setUserGearList((prev: any) => {
                return {
                    ...prev,
                    items: [...prev.items, createdItem]
                }
            })
        } catch (err: any) {
            //TODO: error handling
            setError(err.message || "Error");
            setLoading(false);
        }


    }

    return (
        <>
            <form onSubmit={(e) => addGearListItem(e)}>
                <label>
                    <span>Item Name</span>
                    <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} />
                </label>
                <label>
                    <span>Category</span>
                    <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
                </label>
                <label>
                    <span>Quantity Needed</span>
                    <input type="number" value={quantityNeeded} onChange={(e) => setQuantityNeeded(e.target.value)} />
                </label>
                <label>
                    <span>Quantity to Pack</span>
                    <input type="number" value={quantityToPack} onChange={(e) => setQuantityToPack(e.target.value)} />
                </label>
                <label>
                    <span>Quantity to Shop</span>
                    <input type="number" value={quantityToShop} onChange={(e) => setQuantityToShop(e.target.value)} />
                </label>
                <label>
                    <span>Notes</span>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
                </label>
                <button type="submit">Add Item</button>
            </form>
        </>
    )
}