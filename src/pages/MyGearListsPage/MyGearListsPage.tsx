import { Link } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import GearLists from "../../components/GearLists/GearLists";
import styles from "./MyGearListsPage.module.scss"

export default function MyGearListsPage() {
    const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

    return (
        <div className={`content-container ${styles['my-gear-lists']}`}>
            <header>
                <h1 className={`merriweather ${styles.header}`}>MY GEAR LISTS</h1>
                <p className={styles.tagline}>Create multiple lists so you're prepared for any adventure!</p>
            </header>

            <hr />

            {isAuthenticated ? <Link to="/my-gear-lists/new" className="btn large light-green">CREATE NEW LIST</Link> : null}

            {
                isAuthenticated ? 
                <GearLists/> :
                <section className={styles['sign-in-prompt']}>
                    <header>
                        <h2>Sign In to Start Planning</h2>
                    </header>

                    <section>
                        <p>Log in or create your account to get started!</p>
                        <p>Once you've signed in, you can create as many gear lists as you want.</p>

                        <button className="btn dark large" onClick={() => loginWithRedirect({authorizationParams: {redirect_uri: window.location.href}})}>
                            GET STARTED
                        </button>
                    </section>
                </section> 
            }
        </div>
    )
}