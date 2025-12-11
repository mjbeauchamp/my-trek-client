import styles from "./ListItem.module.scss";
import type { UserGearItem } from "../../../types/gearTypes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';


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
                        <button
                            onClick={() => openListItemDialog('edit', item)}
                            aria-label="Edit list item"
                            className={styles['edit-button']}
                        >
                            <FontAwesomeIcon icon={faEdit} size="lg" />
                        </button>
                        <button
                            onClick={(e) => openDeleteListDialog(e, item._id)}
                            aria-label="Delete list item"
                            className={styles['delete-button']}
                        >
                            <FontAwesomeIcon icon={faTrash} size="lg" />
                        </button>
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