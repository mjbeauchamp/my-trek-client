import styles from "./ListItem.module.scss";
import type { UserGearItem } from "../../../types/gearTypes";


interface ListItemProps {
    openListItemDialog: (mode: 'create' | 'edit', item?: any) => void,
    openDeleteListDialog: (event: React.MouseEvent<HTMLButtonElement>, itemId: string) => void,
    updateItemRef: (itemId: string, el: HTMLLIElement | null) => void,
    item: UserGearItem,
}

export default function ListItem({openListItemDialog, openDeleteListDialog, updateItemRef, item}: ListItemProps) {
    return (
        <li 
            ref={(el) => {
                updateItemRef(item._id, el)
            }}
            className="w-full"
        >
            <article>
                <div className={styles['list-item']}>
                    <div className="flex-align">
                        <span className={styles.bullet}></span>
                        <h3>{item.name}</h3>
                    </div>
                    
                    <div>
                        <button onClick={() => openListItemDialog('edit', item)}>
                            Edit
                        </button>
                        <button onClick={(e) => openDeleteListDialog(e, item._id)}>DELETE</button>
                    </div>
                </div>
                
                {item.notes ? 
                    <p>
                        {item.notes}
                    </p> :
                    null
                }
            </article>
        </li>
    )
}