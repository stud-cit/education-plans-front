import api from '@/api';
import {API, ALLOWED_REQUEST_PARAMETERS} from '@/api/constants-api'
import GlobalMixin from "../../../mixins/GlobalMixin";


export const getListPlans = (context, payload) => {
  const options = GlobalMixin.methods.GlobalHandlingRequestParameters(ALLOWED_REQUEST_PARAMETERS.GET_PLANS, payload);
  context.commit('SET_LOADING', true);
  api.get(API.LIST_PLANS, options).then(({data}) => {
    context.commit('SET_PLANS', data);
    context.commit('SET_LOADING', false);
  });
}

export const destroy = (context, id) => {
  api.destroy(API.DESTROY_PLAN, id).then(() => {
    context.dispatch('getListPlans', context.state.options);
  });
}

export const copy = (context, id) => {
  api.post(API.COPY_PLAN + id).then(() => {
    context.dispatch('getListPlans', context.state.options);
  });
}

export const setOptions = (context, payload) => {
  context.commit('SET_OPTIONS', payload)
}

