class Auth {
    constructor() {
        this.auth = false;
    }
    login(cb) {
        console.log('hello world');
        this.auth = true;
        cb();
    }
    logout(cb) {
        console.log('hello world');
        this.auth = false;
        cb();
    }
    isAuth(){
        return this.auth;
    }
}
export default new Auth();
