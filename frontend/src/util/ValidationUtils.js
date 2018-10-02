import {
    NAME_MIN_LENGTH,
    NAME_MAX_LENGTH,
    SALARY_MIN_LENGTH,
    SALARY_MAX_LENGTH,
    USERNAME_MIN_LENGTH,
    USERNAME_MAX_LENGTH,
    EMAIL_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    PASSWORD_MAX_LENGTH
} from '../constants';
import { isNumber } from './Commons';
import moment from 'moment';

export function validateName(name) {
    if (name.length < NAME_MIN_LENGTH) {
        return {
            validateStatus: 'error',
            errorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`
        };
    } else if (name.length > NAME_MAX_LENGTH) {
        return {
            validateStatus: 'error',
            errorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`
        };
    }

    return {
        validateStatus: 'success',
        errorMsg: null
    };
}

export function validateBirthDate(date) {
    if (!moment.isMoment(date) || moment.duration(moment().diff(date)).asYears() < 18) {
        return {
            validateStatus: 'error',
            errorMsg: 'Only 18+ users are allowed to use this application'
        };
    }

    return {
        validateStatus: 'success',
        errorMsg: null
    };
}

export function validateSalary(salary) {
    if (!salary || salary.length < SALARY_MIN_LENGTH) {
        return {
            validateStatus: 'error',
            errorMsg: `Salary is too short (Minimum ${SALARY_MIN_LENGTH} characters needed.)`
        };
    } else if (salary.length > SALARY_MAX_LENGTH) {
        return {
            validateStatus: 'error',
            errorMsg: `Salary is too long (Maximum ${SALARY_MAX_LENGTH} characters allowed.)`
        };
    } else if (!isNumber(salary)) {
        return {
            validateStatus: 'error',
            errorMsg: 'Salary should be decimal.'
        };
    }

    return {
        validateStatus: 'success',
        errorMsg: null
    };
}

export function validateEmail(email) {
    const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');

    if (!email) {
        return {
            validateStatus: 'error',
            errorMsg: 'Email should not be empty'
        };
    }

    if (!EMAIL_REGEX.test(email)) {
        return {
            validateStatus: 'error',
            errorMsg: 'Email not valid'
        };
    }

    if (email.length > EMAIL_MAX_LENGTH) {
        return {
            validateStatus: 'error',
            errorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`
        };
    }

    return {
        validateStatus: null,
        errorMsg: null
    };
}

export function validateUsername(username) {
    if (username.length < USERNAME_MIN_LENGTH) {
        return {
            validateStatus: 'error',
            errorMsg: `Username is too short (Minimum ${USERNAME_MIN_LENGTH} characters needed.)`
        };
    } else if (username.length > USERNAME_MAX_LENGTH) {
        return {
            validateStatus: 'error',
            errorMsg: `Username is too long (Maximum ${USERNAME_MAX_LENGTH} characters allowed.)`
        };
    }

    return {
        validateStatus: null,
        errorMsg: null
    };
}

export function validatePassword(password) {
    if (password.length < PASSWORD_MIN_LENGTH) {
        return {
            validateStatus: 'error',
            errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`
        };
    } else if (password.length > PASSWORD_MAX_LENGTH) {
        return {
            validateStatus: 'error',
            errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`
        };
    }

    return {
        validateStatus: 'success',
        errorMsg: null
    };
}
