export const get = (prop) => state => state[prop]

export const update = (prop, fn) => state => {
  return { ...state, [prop]: fn(state[prop])}
}
