import { observable, action } from 'mobx';
import { signup } from '../../../util/APIUtils';
import getSessionStore, { SessionStore } from '../../../stores/SessionStore';
import moment from 'moment';
import numeral from 'numeral';
import { validateBirthDate } from '../../../util/ValidationUtils';

const SUCCESS = 'success';
const ERROR = 'error';
const VALIDATING = 'validating';
const EMPTY = '';

export class Response {
    code: number;
    message: string;
    description: string;

    constructor(code, message, description) {
        this.code = code;
        this.message = message;
        this.description = description;
    }
}

export class SignupStore {
    sessionStore: SessionStore;
    @observable
    response: Response;
    @observable
    name = {
        value: EMPTY,
        validateStatus: EMPTY,
        errorMsg: EMPTY
    };
    @observable
    salary = {
        value: 0.00,
        validateStatus: EMPTY,
        errorMsg: EMPTY
    };
    @observable
    birthDate = {
        value: moment(),
        ...validateBirthDate(moment())
    };
    @observable
    username = {
        value: EMPTY,
        validateStatus: EMPTY,
        errorMsg: EMPTY
    };
    @observable
    email = {
        value: EMPTY,
        validateStatus: EMPTY,
        errorMsg: EMPTY
    };
    @observable
    password = {
        value: EMPTY,
        validateStatus: EMPTY,
        errorMsg: EMPTY
    };

    constructor() {
        this.sessionStore = getSessionStore();
    }

    isFormValid = () => {
        return this.name.validateStatus === SUCCESS &&
            this.birthDate.validateStatus === SUCCESS &&
            this.salary.validateStatus === SUCCESS &&
            this.username.validateStatus === SUCCESS &&
            this.email.validateStatus === SUCCESS &&
            this.password.validateStatus === SUCCESS;
    };

    @action
    clearFieldsState() {
        this.updateFieldState('name', { value: '', validateStatus: '', errorMsg: '' });
        this.updateFieldState('salary', { value: 0.00, validateStatus: '', errorMsg: '' });
        this.updateFieldState('birthDate', { value: moment(), ...validateBirthDate(moment()) });
        this.updateFieldState('username', { value: '', validateStatus: '', errorMsg: '' });
        this.updateFieldState('email', { value: '', validateStatus: '', errorMsg: '' });
        this.updateFieldState('password', { value: '', validateStatus: '', errorMsg: '' });
    }

    @action
    updateFieldState(fieldName, update) {
        this[fieldName] = {
            ...this[fieldName],
            ...update
        };
    }

    validateAvailability(name, clientValidationFun, serverValidationFun) {
        const value = this[name].value;
        const validationResult = clientValidationFun(value);

        if (validationResult.validateStatus === ERROR) {
            this.updateFieldState(name, {
                validateStatus: validationResult.validateStatus,
                errorMsg: validationResult.errorMsg
            });
            return;
        }

        this.updateFieldState(name, { validateStatus: VALIDATING, errorMsg: null });

        serverValidationFun(value)
            .then(response => {
                if (response.available) {
                    this.updateFieldState(name, { validateStatus: SUCCESS, errorMsg: null });
                } else {
                    this.updateFieldState(name, {
                        validateStatus: ERROR,
                        errorMsg: `User with such ${name} is already registered`
                    });
                }
            })
            .catch(error => {
                this.updateFieldState(name, { validateStatus: EMPTY, errorMsg: null });
            });
    }

    @action
    setResponse(code, message, description) {
        this.response = new Response(code, message, description);
        this.sessionStore.setLoadingState(false);
    }

    @action
    handleSubmit() {
        if (!this.isFormValid()) {
            this.setResponse(
                500,
                'Client App',
                'Unable to complete registration request!'
            );
            return;
        }

        const signupRequest = {
            name: this.name.value,
            age: moment().diff(this.birthDate.value, 'years'),
            salary: numeral(this.salary.value).format('0.00'),
            email: this.email.value,
            username: this.username.value,
            password: this.password.value
        };
        this.sessionStore.setLoadingState(true);

        signup(signupRequest)
            .then(response => {
                this.setResponse(
                    200,
                    'Client App',
                    'Thank you! You are successfully registered. Please Login to continue!'
                );
            })
            .catch(error => {
                this.setResponse(error.status, 'Client App', 'Sorry! Something went wrong. Please try again!');
            });
    }
}

export default new SignupStore();
