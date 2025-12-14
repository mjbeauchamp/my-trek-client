import { useMemo } from 'react';
import { GEAR_CATEGORIES } from '../../../constants/categories';
import type { GearCategoryId } from '../../../constants/categories';
import ListItem from '../ListItem/ListItem';
import type { GearList, UserGearItem } from '../../../types/gearTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCampground,
  faShirt,
  faCloudRain,
  faFireBurner,
  faTree,
  faUtensils,
  faBurger,
  faDroplet,
  faToiletPaper,
  faCompass,
  faBriefcaseMedical,
  faGlasses,
  faBinoculars,
} from '@fortawesome/free-solid-svg-icons';
import styles from './GearListByCategory.module.scss';

interface Props {
  listId: string | undefined;
  userGearList: GearList | null;
  updateItemRef: (itemId: string, el: HTMLLIElement | null) => void;
  openDeleteItemDialog: (event: React.MouseEvent<HTMLButtonElement>, itemId: string) => void;
  openListItemDialog: (mode: 'create' | 'edit', item?: UserGearItem | undefined) => void;
  setUserGearList: React.Dispatch<React.SetStateAction<GearList | null>>;
}

export default function GearListByCategory({
  listId,
  userGearList,
  updateItemRef,
  openDeleteItemDialog,
  openListItemDialog,
  setUserGearList,
}: Props) {
  const categorizedList = useMemo(() => {
    if (!userGearList?.items || userGearList.items.length < 1) return {};

    const categories: Record<GearCategoryId, UserGearItem[]> = GEAR_CATEGORIES.reduce(
      (acc, cat) => {
        acc[cat.id] = [];
        return acc;
      },
      {} as Record<GearCategoryId, UserGearItem[]>,
    );

    userGearList.items.forEach((item) => {
      const catId: GearCategoryId = item.category || 'misc';
      categories[catId]?.push(item);
    });

    const result: Record<GearCategoryId, UserGearItem[]> = {};

    for (const [key, items] of Object.entries(categories) as [GearCategoryId, UserGearItem[]][]) {
      if (items.length > 0) result[key] = items;
    }

    return result;
  }, [userGearList]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'shelter':
        return faCampground;
      case 'clothing':
        return faShirt;
      case 'weather':
        return faCloudRain;
      case 'essentials':
        return faFireBurner;
      case 'cooking':
        return faUtensils;
      case 'food':
        return faBurger;
      case 'water':
        return faDroplet;
      case 'toiletries':
        return faToiletPaper;
      case 'navigation':
        return faCompass;
      case 'safety':
        return faBriefcaseMedical;
      case 'personal':
        return faGlasses;
      case 'misc':
        return faBinoculars;
      default:
        return faTree;
    }
  };

  return (
    <div className={styles['items-list-container']}>
      {GEAR_CATEGORIES.map((cat, i) => {
        const items = categorizedList[cat.id];
        // skip empty categories
        if (!items || items.length === 0) return null;

        return (
          <div key={cat.id}>
            {i > 0 ? <hr /> : null}

            <section className={styles['category-section']}>
              <div className={styles['category-title']}>
                <FontAwesomeIcon icon={getCategoryIcon(cat.id)} size="2xl" />
                <h2>{cat.label}</h2>
              </div>

              <ul className={styles['items-list']}>
                {items.map((item) => (
                  <ListItem
                    key={item._id}
                    item={item}
                    updateItemRef={updateItemRef}
                    openDeleteItemDialog={openDeleteItemDialog}
                    openListItemDialog={openListItemDialog}
                    listId={listId}
                    setUserGearList={setUserGearList}
                  />
                ))}
              </ul>
            </section>
          </div>
        );
      })}
    </div>
  );
}
