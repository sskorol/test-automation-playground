import { API_BASE_URL, ACCESS_TOKEN } from '../constants';

const request = options => {
    const headers = new Headers({
        'Content-Type': 'application/json'
    });

    const accessToken = localStorage.getItem(ACCESS_TOKEN);

    if (accessToken) {
        headers.append('Authorization', 'Bearer ' + accessToken);
    }

    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options).then(response =>
        response.json().then(json => {
            if (!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + '/auth/signin',
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + '/auth/signup',
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + '/user/checkUsernameAvailability?username=' + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + '/user/checkEmailAvailability?email=' + email,
        method: 'GET'
    });
}

export function getCurrentUser() {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject('Unauthorized.');
    }

    return request({
        url: API_BASE_URL + '/user/me',
        method: 'GET'
    });
}

export function getAllUsers(limit: 50) {
    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject('Unauthorized.');
    }

    return request({
        url: API_BASE_URL + '/users?limit=' + limit,
        method: 'GET'
    });
}
