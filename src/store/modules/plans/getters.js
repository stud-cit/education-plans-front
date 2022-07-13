export const items = (state) => {
    return state.plans.items
}

export const plan = (state) => {
  console.log('state.plan', state.plan)
  return state.plan
}

export const loader = (state) => {
    return state.plans.loader
}

export const meta = (state) => {
    return state.plans.meta
}

export const options = (state) => {
    return state.options
}

export const indexComponent = (state) => {
  return state.indexComponent
}

export const errorsPlan = (state) => {
  return state.errorsPlan
}

