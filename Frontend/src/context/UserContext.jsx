import { createContext, useContext, useEffect, useState } from "react";
// import Cookies from 'js-cookie';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [profile, setProfile] = useState();

    useEffect(() => {
        // Retrieve from local storage only
        const storedProfile = localStorage.getItem('userProfile');
        if (storedProfile) {
            setProfile(JSON.parse(storedProfile));
        }
    }, []);

    useEffect(() => {
        if (profile) {
            // Store profile in local storage only
            localStorage.setItem('userProfile', JSON.stringify(profile));

            // // Set profile in cookie (commented out)
            // const expires = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes
            // Cookies.set('userProfile', JSON.stringify(profile), { expires });
        } else {
            localStorage.removeItem('userProfile');
            // Cookies.remove('userProfile'); // Commented out cookie removal
        }
    }, [profile]);

    return (
        <UserContext.Provider value={{ profile, setProfile }}>
            {children}
        </UserContext.Provider>
    );
};
