import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface GearItem {
  _id: string;
  name: string;
  category?: string;
  weight?: number;
  notes?: string;
}

export default function GearListPage() {
    const [gear, setGear] = useState<GearItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const fetchGear = async () => {
        try {
            const token = await getAccessTokenSilently();
            const res = await fetch("http://localhost:4000/api/commonGear", {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();

            setGear(data);
        } catch (err) {
            console.error("Error fetching gear:", err);
        } finally {
            setLoading(false);
        }
        };
        fetchGear();
    }, [getAccessTokenSilently]);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
        <h1>Common Backpacking Gear</h1>
        <ul>
            {gear.map(item => (
            <li key={item._id}>
                {item.name} - {item.category} - {item.weight} kg
                {item.notes && ` (${item.notes})`}
            </li>
            ))}
        </ul>
        </div>
    );
}