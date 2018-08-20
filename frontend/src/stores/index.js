import getSessionStore from './SessionStore';
import loginStore from '../pages/user/login/LoginStore';
import signupStore from '../pages/user/signup/SignupStore';
import { RouterStore } from 'mobx-react-router';

let sessionStore = getSessionStore();
let routingStore = new RouterStore();

const stores = {
    loginStore,
    sessionStore,
    routingStore,
    signupStore
};

export default stores;
