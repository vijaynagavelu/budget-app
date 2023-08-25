import { auth } from '@/app/googleSignIn/config';
import { useEffect, useState } from 'react';

const useFirebaseAuthentication = () => {
    const [authUser, setAuthUser] = useState(auth.currentUser);

    useEffect(() => {
        const unlisten = auth.onAuthStateChanged(
            authUser => {
                authUser
                    ? setAuthUser(authUser)
                    : setAuthUser(false);
            },
        );
        return () => {
            unlisten();
        }
    }, []);

    return authUser
}

export default useFirebaseAuthentication;