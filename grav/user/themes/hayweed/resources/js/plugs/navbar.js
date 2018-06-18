import { update, get } from '../state-f'
import onStateChange from '../redux-onchange'

const actions = {
  toggleNav: () => update('navbarVisible', visible => !visible)
}

export const view = (app, store) => {

  // Bind DOM Elements to call actions
  document.getElementById('main-navbar-toggle')
    .addEventListener('click', app.toggleNav)

  // Render state changes
  onStateChange(store, {
    selector: get('navbarVisible'),
    onChange: navbarVisible => {
      var navbarTogglableElements = [
        document.getElementById('main-navbar-toggle'),
        document.getElementById('main-navbar-menu'),
        document.getElementById('main-navbar'),
      ]
      navbarTogglableElements.forEach(function(el){
        el.classList[navbarVisible ? 'add' : 'remove']('is-active')
      })
    }
  })
}

const plug = { actions }
export default plug
