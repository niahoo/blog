
import { createStore } from 'redux'
import { createReducer, createPlugApp } from './new-plug'
import navbarPlug, { view as navbarViewListener } from './plugs/navbar'
import initialState from './initial-state'

// const otherReducer = function(state, action) {
//   console.log('otherReducer action', action)
//   return state
// }
const otherReducer = null

const app = createPlugApp()

const store = createStore(otherReducer, initialState, app.enhancer)

console.log('store', store)
console.log('-----------------------------', store)
store.subscribe(function() {
  console.log('subscribe', store.getState())
})

app.plug(navbarPlug)

navbarViewListener(app, store)


window.app = app
