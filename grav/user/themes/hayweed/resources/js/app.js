import domready from 'domready'

domready(function() {
	const toggleNavbar = (function() {
      let navbarVisible = false
      let navbarTogglableElements = [
        document.getElementById('main-navbar-toggle'),
        document.getElementById('main-navbar-menu'),
        document.getElementById('main-navbar'),
      ]
      return function() {
        navbarVisible = !navbarVisible
        navbarTogglableElements.forEach(function(el) {
          el.classList[navbarVisible ? 'add' : 'remove']('is-active')
        })
      }
    }())

  document.getElementById('main-navbar-toggle')
    .addEventListener('click', toggleNavbar)
})
