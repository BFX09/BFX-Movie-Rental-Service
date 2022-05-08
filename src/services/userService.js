import http from "./httpService";

const apiEndpoint = "/users";

export function register({ username, password, name}) {
    return http.post(apiEndpoint, {
        email: username,
        password: password,
        name: name
    });
}
