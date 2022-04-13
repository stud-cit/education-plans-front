import api from '@/api/index';
import {API} from "@/api/constants-api";

export default {
    namespaced: true,

    state: {
        userData: null
    },

    getters: {
        user: state => state.userData
    },

    mutations: {
        setUserData(state, user) {
            state.userData = user;
        }
    },

    actions: {
        getUserData({ commit }) {
            api
                .get(API.USER)
                .then(response => {
                    commit("setUserData", response);
                })
                .catch(() => {
                    localStorage.removeItem("user");
                    localStorage.removeItem("authToken");
                });
        },
        sendLoginRequest({ commit }, data) {
            commit("setErrors", {}, { root: true });
            return api.post(API.LOGIN, data)
                .then(response => {
                    if (response.status === 200) {
                        commit("setUserData", response.data.user);
                        localStorage.setItem('user', JSON.stringify(response.data.user));
                        localStorage.setItem("authToken", response.data.token);
                    }
                })

        },
        // sendRegisterRequest({ commit }, data) {
        //   commit("setErrors", {}, { root: true });
        //   return api
        //     .post(API.REGISTER, data)
        //     .then(response => {
        //       commit("setUserData", response.data.user);
        //       localStorage.setItem("authToken", response.data.token);
        //     });
        // },
        async sendLogoutRequest({ commit }) {
            await api
                .get(API.LOGOUT)
                .then((response) => {
                    if (response.status === 200) {
                        commit("setUserData", null);
                        localStorage.removeItem("user");
                        localStorage.removeItem("authToken");
                    }
                })
        },
        // sendVerifyResendRequest() {
        //   return axios.get(process.env.VUE_APP_API_URL + "email/resend");
        // },
        // sendVerifyRequest({ dispatch }, hash) {
        //   return axios
        //     .get(process.env.VUE_APP_API_URL + "email/verify/" + hash)
        //     .then(() => {
        //       dispatch("getUserData");
        //     });
        // }
    }
};