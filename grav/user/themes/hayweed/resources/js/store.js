import { createStore } from '../../node_modules/redux/dist/redux.js'

const store = createStore()

export default store

// Each time I want to describe some behaviour for the application, I
// must :
// - Declare a constant to name the action type
// - Declare an action creator with this type
// - Declare a reducer to handle this action

const app = createApp(
  actions: {
    increment: amount => state => newState
  }
)

