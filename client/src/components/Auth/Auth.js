import Cookies from 'js-cookie';
class Auth {
    login(token,cb) {
        console.log("token:",token);
        Cookies.set('token',token);

        cb();
    }
    logout(cb) {
        Cookies.remove('token');
        console.log('I am removing token: ',Cookies.get('token'));
        
        cb();
    }
    isAuth(){
        console.log("Token:",Cookies.get('token'));
       if(Cookies.get('token')) {
           return true;
       }
       else{
           return false;
       }
    }
}
export default new Auth();
