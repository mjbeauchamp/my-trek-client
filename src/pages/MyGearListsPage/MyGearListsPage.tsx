import { Link } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import GearLists from "../../components/GearLists/GearLists";

export default function MyGearListsPage() {
    const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

    return (
        <div>
            <h1>MY GEAR LISTS</h1>
            <p>Create multiple lists so that you're prepared for any adventure!</p>
            {isAuthenticated ? <Link to="/my-gear-lists/new">Create New List</Link> : null}

            {
                isAuthenticated ? 
                <GearLists/> :
                <div>
                    <h2>Sign In to Start Planning</h2>
                    <p>Log in or create your account to get started!</p>
                    <p>Once you've signed in, you can create as many gear lists as you want</p>

                    <button className="btn light" onClick={() => loginWithRedirect({authorizationParams: {redirect_uri: window.location.href}})}>
                        Get Started
                    </button>
                </div> 
            }
            
        </div>
    )
}