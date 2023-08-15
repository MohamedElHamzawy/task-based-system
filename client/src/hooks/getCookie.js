import Cookie from 'js-cookie';

const GetCookie =(cookiename) =>{
 return  Cookie.get(cookiename);
};

export default GetCookie ;