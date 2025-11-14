import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, ComboboxButton  } from "@headlessui/react";
import { GEAR_CATEGORIES } from "../../constants/categories";

import type { GearList, CommonGearItem, UserGearItem } from "../../types/gearTypes";

interface PropTypes {
    userGearListItems: UserGearItem[] | undefined;
    setUserGearList: React.Dispatch<React.SetStateAction<GearList | null>>,
    setNewItemId: React.Dispatch<React.SetStateAction<string>>,
    closeListItemDialog: () => void,
    mode: 'create' | 'edit',
    initialData?: any,
    listId?: string,
}

export default function GearItemForm({ 
    userGearListItems,
    setUserGearList,
    setNewItemId,
    closeListItemDialog,
    listId,
    mode = 'create',
    initialData,
}: PropTypes) {
    // Gear list item form data
    const [itemName, setItemName] = useState(initialData?.name || '');
    const [category, setCategory] = useState(initialData?.category || '');
    const [quantityNeeded, setQuantityNeeded] = useState(initialData?.quantityNeeded || '1');
    const [quantityToPack, setQuantityToPack] = useState(initialData?.quantityToPack || '1');
    const [quantityToShop, setQuantityToShop] = useState(initialData?.quantityToShop || '0');
    const [notes, setNotes] = useState(initialData?.notes || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Common gear item list
    const [commonGear, setCommonGear] = useState<CommonGearItem[]>([]);
    const [loadingCommonGear, setLoadingCommonGear] = useState(true);
    const [errorCommonGear, setErrorCommonGear] = useState('');
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<CommonGearItem | null>(null);

  // Filter options based on query
  const filtered = query === ""
    ? commonGear
    : commonGear.filter(gear =>
        gear.name.toLowerCase().includes(query.toLowerCase())
      );

  // Group options by category
  const grouped: Record<string, CommonGearItem[]> = filtered.reduce((acc: any, gear: any) => {
    if (!acc[gear.category]) acc[gear.category] = [];
    acc[gear.category].push(gear);
    return acc;
  }, {} as Record<string, CommonGearItem[]>);

    const { getAccessTokenSilently } = useAuth0();


    useEffect(() => {
        const fetchCommonGear = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/commonGear");
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
    }, []);

    const onCommonGearSelect = (gear: CommonGearItem | null) => {
        if (gear?.name) {
            setItemName(gear?.name)
        }
        if (gear?.category) {
            setCategory(gear?.category)
        }
    }


    const addGearListItem = async (newItem: {itemData: { name: any; category: any; quantityNeededNum: number; quantityToPackNum: number; quantityToShopNum: number; notes: string; }}) => {
        
        try {
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
                throw new Error("Failed to add item");
            }
            const createdItem = await res.json();
            setLoading(false);
            setUserGearList((prev: any) => {
                return {
                    ...prev,
                    items: [...prev.items, createdItem]
                }
            })
            setNewItemId(createdItem._id)
        } catch (err: any) {
            //TODO: error handling
            setError(err.message || "Error");
            setLoading(false);
        } finally {
            closeListItemDialog();
        }
    }

    const editGearListItem = async (newItem: {itemData: { name: any; category: any; quantityNeededNum: number; quantityToPackNum: number; quantityToShopNum: number; notes: string; }}) => {
        if (!listId || !initialData._id) {
            // TODO: HANDLE ERROR, because if we don't have these we can't make the call
        }
        try {
            setLoading(true);
            setError(null);

            const token = await getAccessTokenSilently();
            const res = await fetch(`http://localhost:4000/api/gear-lists/gear-list/${listId}/items/${initialData._id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json" ,
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newItem),
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.message || "Failed to edit item");
            }
            const updatedList = await res.json();

            setUserGearList(updatedList);
            setLoading(false);
        } catch (err: any) {
            //TODO: error handling
            setError(err.message || "Error");
            setLoading(false);
        } finally {
            closeListItemDialog();
        }
    }

    const submitForm = async (event: React.FormEvent<HTMLFormElement>) =>  {
        event.preventDefault();

        // TODO: VALIDATE/SANITIZE ALL TEXT VALUES
        if (!listId) {
            // TODO: Error handling
            return;
        }

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

        if (mode === "create") {
            addGearListItem(newItem);
        } else if (mode === "edit") {
            editGearListItem(newItem);
        }
    }

    return (
        <>
            {mode === 'create' ? <div>
                <Combobox
                value={selected}
                onChange={gear => {
                    setSelected(gear);
                    onCommonGearSelect(gear);
                }}
                onClose={() => setQuery('')}
                immediate
                >
                    <div className="relative">
                        <ComboboxInput
                        placeholder="Select common gear"
                        aria-label="Common Gear Item"
                        onChange={e => setQuery(e.target.value)}
                        displayValue={(gear: CommonGearItem | null) => gear ? gear.name : ""}
                        />
                            <ComboboxButton>
                            ▼
                            </ComboboxButton>

                            <ComboboxOptions>
                                {Object.entries(grouped).map(([category, items]) => (
                                    <div key={category}>
                                    <div>{category}</div>
                                    {items.map(gear => {
                                        const alreadyAdded = userGearListItems?.some((item: UserGearItem) => item.name === gear.name);
                                        return (
                                        <ComboboxOption
                                            key={gear._id}
                                            value={gear}
                                            disabled={alreadyAdded}
                                            className={({disabled }) =>
                                                `${disabled ? "text-gray-400 cursor-not-allowed" : ""}`
                                            }
                                        >
                                            {gear.name}
                                            { alreadyAdded ? <span>Already in list</span> : null }
                                        </ComboboxOption>
                                        );
                                    })}
                                </div>
                            ))}
                            </ComboboxOptions>
                    </div>
                </Combobox>
            </div> : null}

            <form onSubmit={(e) => submitForm(e)}>
                <label>
                    <span>Item Name</span>
                    <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} />
                </label>
                <label>
                    <span>Category</span>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border rounded px-3 py-2"
                    >
                        <option value="">Select a category</option>
                        {GEAR_CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
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
                

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={closeListItemDialog}
                        className="px-4 py-2 border rounded"
                    >
                    Cancel
                    </button>

                    <button type="submit">
                        {mode === "create" ? <span>Add Item</span> : <span>Update Item</span>}
                    </button>
                </div>
            </form>
        </>
    )
}