import { useState, useEffect, useRef } from 'react';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import type { CommonGearItem, UserGearItem } from '../../../types/gearTypes';

interface PropTypes {
    onCommonGearSelect: (gear: CommonGearItem | null) => void;
    userGearListItems: UserGearItem[] | undefined;
}

export default function CommonGearDropdown({ onCommonGearSelect, userGearListItems }: PropTypes) {
    const [commonGear, setCommonGear] = useState<CommonGearItem[]>([]);
    const [query, setQuery] = useState('');
    const [selectedCommonGear, setSelectedCommonGear] = useState<CommonGearItem | null>(null);
    const commonGearInputRef = useRef<HTMLInputElement>(null);

    // Filter "Common Gear" options based on query
    const filtered =
        query === '' ? commonGear : commonGear.filter((gear) => gear.name.toLowerCase().includes(query.toLowerCase()));

    // Group "Common Gear" options by category
    const grouped: Record<string, CommonGearItem[]> = filtered.reduce(
        (acc: Record<string, CommonGearItem[]>, gear: CommonGearItem) => {
            if (gear.category) {
                if (!acc[gear.category]) acc[gear.category] = [];
                acc[gear.category].push(gear);
            }
            return acc;
        },
        {} as Record<string, CommonGearItem[]>,
    );

    useEffect(() => {
        const fetchCommonGear = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/commonGear');
                if (!res.ok) {
                    //TODO: handle error
                }
                const data = await res.json();

                // TODO: Only set common gear if data is an array of the correct types of objects

                setCommonGear(data);
            } catch (err) {
                console.error('Error fetching common gear items:', err);
            }
        };
        fetchCommonGear();
    }, []);

    return (
        <>
            <Combobox
                value={selectedCommonGear}
                onChange={(gear) => {
                    setSelectedCommonGear(gear);
                    onCommonGearSelect(gear);
                }}
                onClose={() => setQuery('')}
                immediate
            >
                <div className="combobox-container">
                    <ComboboxInput
                        ref={commonGearInputRef}
                        placeholder="Select common items"
                        aria-label="Select Common Gear Item"
                        onChange={(e) => setQuery(e.target.value)}
                        onClick={() => {
                            commonGearInputRef.current?.blur();
                            commonGearInputRef.current?.focus();
                        }}
                        displayValue={(gear: CommonGearItem | null) => (gear ? gear.name : '')}
                        className="input-base select-base"
                    />

                    <ComboboxOptions className="combobox-options">
                        {Object.entries(grouped).map(([category, items]) => (
                            <div key={category} className="combobox-group">
                                <h3 className="combobox-group-label">{category}</h3>
                                {items.map((gear) => {
                                    const alreadyAdded = userGearListItems?.some(
                                        (item: UserGearItem) => item.name === gear.name,
                                    );
                                    return (
                                        <ComboboxOption
                                            key={gear._id}
                                            value={gear}
                                            disabled={alreadyAdded}
                                            className={({ disabled }) =>
                                                `combobox-option
                                                    ${disabled ? 'disabled' : ''}`
                                            }
                                        >
                                            {gear.name}
                                            {alreadyAdded ? (
                                                <span className="combobox-badge">Already in list</span>
                                            ) : null}
                                        </ComboboxOption>
                                    );
                                })}
                            </div>
                        ))}
                    </ComboboxOptions>
                </div>
            </Combobox>
        </>
    );
}
