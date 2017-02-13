// ==UserScript==
// @name         Clickpocalypse 2 autoclick
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://minmaxia.com/c2/
// @grant        unsafeWindow
// ==/UserScript==
'use strict'

/* jshint asi: true */

var window = unsafeWindow
var document = window.document

function isGameReady() {
  return document.querySelector('.offlineProgressBarContainer') === null
}

function toArray(collection) {
  return Array.prototype.slice.call(collection)
}

function simpleSort(a, b) {
  return a < b ? -1 : a > b ? 1 : 0
}

function sortBy(fn) {
  return function(a, b) {
    return simpleSort(fn(a), fn(b))
  }
}

function getGameTabs() {
  var tabs = toArray(document.querySelectorAll('#gameTabMenu a'))
    .reduce(function(tabs, a) {
      if (a.innerHTML === 'Game') {
        tabs.game = {
          type: 'game',
          click: a.onclick
        }
      } else if (a.innerHTML.match(/(Fighter|Priest|Ranger|Pyro|Rogue|Druid|King|Necro|Barbarian|__TODO__)( [0-9]+)?/)) {
        tabs.characters.push({
          showCharacterSheet: a.onclick,
          skillpoints: function() {
            var match = a.innerHTML.match(/([0-9]+)/)
            return match ? Number(match[0]) : 0
          }
        })
      }
      return tabs
    }, {
      characters: []
    })
  console.log('tabs', tabs)

  tabs.characters.forEach(function(tab, index){
    var characterSheet = document.querySelector('#characterTabContainer' + index)
    var skillsTable = characterSheet.querySelector('.adventurerSkillTreeTable')
    tab.skillsTable = skillsTable
    console.log('skillsTable', skillsTable)
    tab.availableSkills = function() {
      var buttons = toArray(skillsTable.querySelectorAll('.upgradeButton'))
      buttons.sort(sortBy(function(button){
          var column = button.parentNode.getAttribute('id').match(/[0-9]$/)[0]
          return column === '2' ? 0 : Number(column)
        }))
      return buttons
    }
  })
  return tabs
}

function next(time, fn) {
  var args
  if (typeof time === 'function') {
    fn = time
    time = 1
    args = Array.prototype.slice.call(arguments, 1)
  } else {
    args = Array.prototype.slice.call(arguments, 2)
  }
  return {
    time: time,
    fn: fn,
    args: args
  }
}

function onError(e) {
  console.error(e)
  return next(1, window.__TODO__)
}

function loop(step) {
  // console.log('LOOP %s', step.fn.name)
  setTimeout(function() {
      var nextStep = step.fn.apply(void 0, step.args)
      if (nextStep) {
        loop(nextStep)
      } else {
        console.log('LOOP END')
      }
    try {
    } catch (e) {
      onError(e)
    }
  }, step.time)
}


loop(next(500, waitGameReady))

var state = {}

function waitGameReady() {
  if (isGameReady()) {
    return next(initialize)
  } else {
    return next(500, waitGameReady)
  }
}

function initialize() {
  state.tabs = getGameTabs()
  state.charCount = state.tabs.characters.length
  return next(decision)
}

function decision() {
  var cs = state.tabs.characters
  for (var i = 0; i < state.charCount; i++) {
    var c = cs[i]
    if (c.skillpoints()) {
      return next(manageCharacter, c)
    }
  }
  state.tabs.game.click()
  return next(10000, decision)
}

function manageCharacter(character) {
  character.showCharacterSheet()
  if (character.skillpoints()) {
    return next(buySkills, character)
  } else {
    return next(decision)
  }
}

function activateSkillButton(button) {
  var evt = new Event('mouseup', {
    bubbles: true,
    cancelable: true
  })
  button.dispatchEvent(evt)
}

function buySkills(character) {
  var skills = character.availableSkills()
  if (skills.length) {
    activateSkillButton(skills[0])
    return next(100, buySkills, character)
  }
  return next(manageCharacter, character)
}
