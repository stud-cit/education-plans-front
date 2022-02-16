import axios from 'axios';
import vuexStore from '@/store';
import router from '@/router';
import jsonToQuery from 'json-to-query-string'

const api = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL + 'api/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

api.interceptors.response.use(
    response => {
        if (response.config.showLoader) {
            vuexStore.dispatch('loader/hide');
        }

        return response;
    },

    error => {
        let response = error.response;

        if (response.config.showLoader) {
            vuexStore.dispatch('loader/hide');
        }

        if (error.response.status === 400) {
            console.error(error.response.statusText);
        } else if (error.response.status === 422) {
            console.log('this error')
            vuexStore.commit("setErrors", error.response.data.errors); //TODO: this error preview
        } else if (error.response.status === 401) {
            vuexStore.commit("auth/setUserData", null);
            localStorage.removeItem("authToken");
            router.push({ name: "Login" });
        } else if (error.response.status === 404) {
            router.push({ name: "NotFoundPage" });
        } else if(error.response.status === 500) {
            console.error(error.response.statusText);
        } else {
            return Promise.reject(error);
        }
        return Promise.reject(error); //default error
    }
);
api.interceptors.request.use(function(config) {
        config.headers.common = {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
            Accept: "application/json"
        };

        if (config.showLoader) {
            vuexStore.dispatch('loader/show');
        }

        return config;
    },
    error => {
        if (error.config.showLoader) {
            vuexStore.dispatch('loader/hide');
        }
        return Promise.reject(error);
    }
);

const get = async (resource, data = false, configs = null) => data ? await api.get(`${resource}?${jsonToQuery(data)}`, configs) : await api.get(resource);
const post = async (resource, data) => await api.post(resource, data);
const put = async (resource, data) => await api.put(resource, data);
const patch = async (resource, id = null ,data = null) => id ? await api.patch(`${resource}/${id}`, data) : await api.patch(resource, data);

export default {
    get,
    post,
    put,
    patch,
};