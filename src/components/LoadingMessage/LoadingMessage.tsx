import { SyncLoader } from "react-spinners";
import styles from "./LoadingMessage.module.scss";

export default function LoadingMessage({title, text}: {title: string, text?: string}) {

    return (
        <div role="status" className={styles['loading-message']}>
            <h1>{title}</h1>
            {text && <p>{text}</p>}
            <SyncLoader />
        </div>
    )
}