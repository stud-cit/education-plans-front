export const SET_PLANS = (state, payload) => {
    state.plans = {
        items: payload.data,
        meta: payload.meta
    }
}
export const SET_OPTIONS = (state, payload) => {
    state.options = payload;
}

export const SET_LOADING = (state, payload) => {
    state.loading = payload;
}
