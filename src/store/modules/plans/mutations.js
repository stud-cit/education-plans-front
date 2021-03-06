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

export const SET_PLAN = (state, payload) => {
  state.plan = payload;
}

export const SET_ERRORS_PLAN = (state, payload) => {
  if(payload && state.errorsPlan.indexOf(payload) == -1) {
    state.errorsPlan.push(payload)
  }
}

export const CLEAR_ERRORS_PLAN = (state) => {
  state.errorsPlan = [];
}

export const SET_INDEX_COMPONENT = (state) => {
  state.indexComponent += 1;
}