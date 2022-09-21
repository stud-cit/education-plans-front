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
export const SET_SUBMIT_LOADING = (state, payload) => {
  state.submitLoading = payload;
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

export const ADD_SIGNATURE = (state) => {
  const ids = state.plan.signatures.map(function(o) { return o.id; });
  let index = ids.length ? Math.max.apply(Math, ids) + 1 : 1;

  const item = { id: index, plan_id: state.plan.id, position_id: null, manual_position: '', asu_id: null, edit: null };
  state.plan.signatures.push(item);
};

export const SAVE_SIGNATURE = (state, payload) => {
  state.plan.signatures.map((item) => {
    if (item.index === payload.index) {
      item.id = payload.id;
    }
    return item;
  });
};

export const REMOVE_SIGNATURE = (state, payload) => {
  state.plan.signatures.splice(payload.index, 1);
};

export const TOGGLE_SIGNATURE = (state, payload) => {
  state.plan.signatures.map( item => {
    if (item.id === payload.id) {
      item.edit = !item.edit;
    }
    return item;
  });
};

export const UPDATE_SIGNATURE = (state, payload) => {
  state.plan.signatures.map( item => {
    if (item.id === payload.id) {
      item = payload;
    }
    return item;
  });
};
