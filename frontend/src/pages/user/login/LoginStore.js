import { observable, action, computed } from 'mobx';
import { login } from '../../../util/APIUtils';
import getSessionStore, { SessionStore } from '../../../stores/SessionStore';

export class Status {
    code: number;
    message: string;
    description: string;

    constructor(code, message, description) {
        this.code = code;
        this.message = message;
        this.description = description;
    }
}

export class LoginStore {
    session: SessionStore;
    @observable status: Status;

    constructor() {
        this.session = getSessionStore();
    }

    @computed
    get getUsername() {
        return this.session.userInfo && this.session.userInfo.username;
    }

    @action
    setStatus(code, message, description) {
        this.status = new Status(code, message, description);
    }

    @action
    handleSubmit(values) {
        const loginRequest = Object.assign({}, values);
        return login(loginRequest)
            .then(response => {
                this.session.setToken(response.accessToken);
                this.setStatus(200, 'Client App', 'Successfully logged in!');
                return this.session.loadCurrentUser();
            })
            .catch(error => {
                this.setStatus(error.status, 'Client App', 'Your Username or Password is incorrect. Please try again!');
            });
    }
}

export default new LoginStore();
