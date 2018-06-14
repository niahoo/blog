
const onStateChange = (store, opts) => {
  let { selector, compare, onChange } = opts
  const { getState } = store
  let prevSelected = selector(getState())
  compare = compare || ((a, b) => a === b)
  selector = selector || (it => it)
  const unsubscribe = store.subscribe(() => {
    const selected = selector(getState())
    const prevSelectedCopy = prevSelected
    prevSelected = selected
    if (! compare(selected, prevSelectedCopy)) {
      opts.onChange(selected, prevSelectedCopy, getState)
    }
  })
  return unsubscribe
}


export { onStateChange }
export default onStateChange
