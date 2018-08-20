import { observable, computed, action } from 'mobx';
import { getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';

let sessionStore;

export class UserInfo {
    @observable id: number;
    @observable name: string;
    @observable username: string;
    @observable email: string;

    constructor(response: any) {
        this.id = response.id;
        this.name = response.name;
        this.username = response.username;
        this.email = response.email;
    }
}

export class SessionStore {
    @observable accessToken: string;
    @observable.ref userInfo: UserInfo;
    @observable isLoading: boolean;

    constructor() {
        this.accessToken = localStorage.getItem(ACCESS_TOKEN) || '';
        if (this.isAuthorized) {
            this.loadCurrentUser();
        }
    }

    @action
    loadCurrentUser() {
        this.setLoadingState(true);
        return getCurrentUser()
            .then(response => {
                this.setUserInfo(new UserInfo(response));
                this.setLoadingState(false);
            })
            .catch(error => {
                if (error.status === 401) {
                    this.clearState();
                }
                this.setLoadingState(false);
            });
    }

    @computed
    get isAuthorized() {
        return Boolean(this.accessToken);
    }

    @action
    setToken(token: string) {
        this.accessToken = token;
        localStorage.setItem(ACCESS_TOKEN, token);
    }

    @action
    setUserInfo(info: any) {
        this.userInfo = info;
    }

    @action
    setLoadingState(isLoading: boolean) {
        this.isLoading = isLoading;
    }

    @action
    clearState() {
        this.setUserInfo(null);
        this.setToken('');
        this.setLoadingState(false);
        localStorage.removeItem(ACCESS_TOKEN);
    }
}

export default function getSessionStore(): SessionStore {
    if (!sessionStore) {
        sessionStore = new SessionStore();
    }
    return sessionStore;
}
