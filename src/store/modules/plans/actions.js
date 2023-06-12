import api from '@/api';
import { API, ALLOWED_REQUEST_PARAMETERS } from '@/api/constants-api';
import GlobalMixin from '../../../mixins/GlobalMixin';

export const getListPlans = (context, payload) => {
  const options = GlobalMixin.methods.GlobalHandlingRequestParameters(ALLOWED_REQUEST_PARAMETERS.GET_PLANS, payload);
  context.commit('SET_LOADING', true);
  api.get(API.PLANS, options, { showLoader: true }).then(({ data }) => {
    context.commit('SET_PLANS', data);
    context.commit('SET_LOADING', false);
  });
};

export const destroy = (context, id) => {
  api.destroy(API.PLANS, id).then(() => {
    context.dispatch('getListPlans', context.state.options);
  });
};

export const copy = (context, id) => {
  api.post(API.COPY_PLAN + id, null, { showLoader: true }).then((response) => {
    document.location.href = encodeURI('plan/edit/' + response.data.id + '/' + response.data.title);
  });
};

export const store = (context, data) => {
  return api.post(API.PLANS, data).then((response) => {
    data.id = response.data.id;
    context.commit('SET_PLAN', data);
    return response;
  });
};

export const update = (context, data) => {
  return api.put(`${API.PLANS}/${data.id}`, data).then((response) => {
    context.commit('SET_LOADING', false);
    return response;
  });
};

export const show = (context, id) => {
  context.commit('SET_LOADING', true);
  return api.edit(API.PLANS, id, { showLoader: true }).then((response) => {
    context.commit('CLEAR_ERRORS_PLAN');
    context.commit('SET_PLAN', { ...response.data.data, submitLoader: false });
    context.commit('SET_INDEX_COMPONENT');
    context.commit('SET_LOADING', false);
    return response;
  });
};

export const getOptions = (context) => {
  return api.get(API.SETTINGS).then((response) => {
    let data = {};
    response.data.data.forEach((item) => {
      data[item.key] = item.value;
    });
    context.commit('SET_OPTIONS', data);
    return response;
  });
};

export const setOptions = (context, payload) => {
  context.commit('SET_OPTIONS', payload);
};

export const setErrorsPlan = (context, payload) => {
  context.commit('SET_ERRORS_PLAN', payload);
};

export const clearErrorsPlan = (context) => {
  context.commit('CLEAR_ERRORS_PLAN');
};

export const clear = ({ commit, state }) => {
  commit('SET_PLAN', state.default);
};

export const addSignature = ({ commit }) => {
  commit('ADD_SIGNATURE');
};

export const saveSignature = (context, payload) => {
  return api.post(API.SIGNATURES, payload).then((response) => {
    context.commit('SAVE_SIGNATURE', { ...payload, ...response.data });
    return response;
  });
};

export const removeSignature = (context, payload) => {
  if (payload.id === null) {
    context.commit('REMOVE_SIGNATURE', payload);
    return new Promise();
  }
  return api.destroy(API.SIGNATURES, payload.id).then((response) => {
    context.commit('REMOVE_SIGNATURE', payload);
    return response;
  });
};

export const toggleSignature = (context, payload) => {
  context.commit('TOGGLE_SIGNATURE', payload);
};

export const updateSignature = (context, payload) => {
  return api.patch(API.SIGNATURES, payload.id, payload).then((response) => {
    context.commit('TOGGLE_SIGNATURE', payload);
    context.commit('UPDATE_SIGNATURE', response.data);
    return response;
  });
};

export const setSubmitLoading = (context, payload) => {
  context.commit('SET_SUBMIT_LOADING', payload);
};

export const setValue = (context, payload) => {
  context.commit('SET_VALUE', payload);
};

export const setComment = (context, payload) => {
  context.commit('NOT_CONVENTIONAL', payload);
};
