import api from '@/api';
import {API, ALLOWED_REQUEST_PARAMETERS} from '@/api/constants-api'
import GlobalMixin from "../../../mixins/GlobalMixin";


export const getListPlans = (context, payload) => {
  const options = GlobalMixin.methods.GlobalHandlingRequestParameters(ALLOWED_REQUEST_PARAMETERS.GET_PLANS, payload);
  context.commit('SET_LOADING', true);
  api.get(API.PLANS, options, {showLoader: true}).then(({data}) => {
    context.commit('SET_PLANS', data);
    context.commit('SET_LOADING', false);
  });
}

export const destroy = (context, id) => {
  api.destroy(API.PLANS, id).then(() => {
    context.dispatch('getListPlans', context.state.options);
  });
}

export const copy = (context, id) => {
  api.post(API.COPY_PLAN + id).then(() => {
    context.dispatch('getListPlans', context.state.options);
  });
}

export const store = (context, data) => {
  return api.post(API.PLANS, data).then((response) => {
    data.id = response.data.id
    context.commit('SET_PLAN', data);
    return  response;
  });
}

export const update = (context, data) => {
  return api.put(`${API.PLANS}/${data.id}`, data).then((response) => {
    context.commit('SET_LOADING', false);
    return  response;
  });
}

export const show = (context, id) => {
  context.commit('SET_LOADING', true);
  return api.edit(API.PLANS, id, {showLoader: true}).then((response) => {
    context.commit('CLEAR_ERRORS_PLAN');
    context.commit('SET_PLAN', {...response.data.data, submitLoader: false});
    context.commit('SET_INDEX_COMPONENT');
    context.commit('SET_LOADING', false);
    return  response;
  });
}

export const getOptions = (context) => {
  return api.get(API.SETTINGS).then((response) => {
    let data = {};
    response.data.data.forEach(item => {
      data[item.key] = item.value;
    });
    context.commit('SET_OPTIONS', data);
    return  response;
  });
}

export const setOptions = (context, payload) => {
  context.commit('SET_OPTIONS', payload)
}

export const setErrorsPlan = (context, payload) => {
  context.commit('SET_ERRORS_PLAN', payload)
}

export const clearErrorsPlan = (context) => {
  context.commit('CLEAR_ERRORS_PLAN');
}

export const clear = ({ commit, state }) => {
  commit('SET_PLAN', state.default)
}
