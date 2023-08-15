import React, {useState, useEffect} from 'react';
import GetCookie from './hooks/getCookie';

export const AuthContext = React.createContext();

export function AuthProvider(Props){
    const [auth, setAuth] = useState({});


    useEffect(() => {
     const name = GetCookie('Token');
     
        //validate token with api
        if(name){
            setAuth({
              name 
            });
        }

    }, []);

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {Props.children}
        </AuthContext.Provider>
    );

}