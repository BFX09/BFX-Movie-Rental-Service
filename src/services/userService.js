import http from "./httpService";
import config from "../config.json";

const apiEndpoint = config.apiUrl + "/users";

export function register({ username, password, name}) {
    return http.post(apiEndpoint, {
        email: username,
        password: password,
        name: name
    });
}
