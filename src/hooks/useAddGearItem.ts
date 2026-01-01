import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import type { UserNewGearItem, UserGearItem } from '../types/gearTypes';
import { isUserGearItem } from '../utils/validators/gearTypeValidators';
import { parseFetchError } from '../utils/parseFetchError';

const apiUrl = import.meta.env.VITE_API_URL;

export default function useAddGearItem(
  listId?: string,
  options?: {
    onError?: (message: string) => void;
  },
) {
  const [isItemLoading, setIsItemLoading] = useState(false);
  const [addItemError, setAddItemError] = useState<string | null>(null);
  const { getAccessTokenSilently } = useAuth0();

  const handleError = (message: string) => {
    if (options?.onError) {
      options.onError(message);
    } else {
      setAddItemError(message);
    }
    console.error(message);
  };

  const addGearListItem = async (itemData: UserNewGearItem): Promise<UserGearItem | null> => {
    if (!listId) {
      handleError('List ID is missing, unable to add gear item.');
      return null;
    }
    try {
      setIsItemLoading(true);

      setAddItemError(null);

      const token = await getAccessTokenSilently();

      if (!token) {
        handleError('There was a problem adding the new list item. User token not found.');
        return null;
      }

      const res = await fetch(`${apiUrl}/gear-lists/gear-list/${listId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemData }),
      });

      if (!res.ok) {
        const message = await parseFetchError(res);
        handleError(`There was a problem adding item to the list: ${message}`);

        return null;
      }

      const createdItem = await res.json();

      if (isUserGearItem(createdItem)) {
        return createdItem;
      } else {
        handleError('The server returned an unexpected response. Please try again.');

        return null;
      }
    } catch (error) {
      if (error instanceof Error) {
        handleError(`Error adding gear item: ${error.message}`);
      } else {
        handleError('There was an error adding gear item');
      }
    } finally {
      setIsItemLoading(false);
    }

    return null;
  };

  return { addGearListItem, isItemLoading, addItemError };
}
