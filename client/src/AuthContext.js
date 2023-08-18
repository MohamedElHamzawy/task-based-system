import React, {useState, useEffect} from 'react';
import GetCookie from './hooks/getCookie';

export const AuthContext = React.createContext();

export function AuthProvider(Props){
    const [auth, setAuth] = useState({});


    useEffect(() => {
     const admin = GetCookie('AdminToken');
     const usera = GetCookie('UserA');
     const userb = GetCookie('UserB');

        //validate token with api
        if(admin){
            setAuth({
                admin 
            });
        }else if(usera){
            setAuth({
                usera 
            });
        }else if(userb){
            setAuth({
                userb 
            });
        }

    }, []);

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {Props.children}
        </AuthContext.Provider>
    );

}