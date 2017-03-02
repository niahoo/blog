// ==UserScript==
// @name         Clickpocalypse 2 autoclick
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://minmaxia.com/c2/
// @grant        unsafeWindow
// ==/UserScript==
/* jshint asi: true */
(function() {

'use strict'


var window = unsafeWindow
var document = window.document

function loop(step) {
  setTimeout(function() {
    var nextStep
    try {
      nextStep = step.fn.apply(void 0, step.args)
    } catch (e) {
      nextStep = onError(e)
    }
    if (nextStep) {
      loop(nextStep)
    } else {
      console.log('LOOP END')
    }
  }, step.time)
}


function next(time, fn) {
  var args
  if (typeof time === 'function') {
    args = Array.prototype.slice.call(arguments, 1)
    fn = time
    time = 100
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
  return next(1, waitGameReady)
}


// ---------------------------------------------------------------------------


function simpleSort(a, b) {
  return a < b ? -1 : a > b ? 1 : 0
}

function sortBy(fn) {
  return function(a, b) {
    return simpleSort(fn(a), fn(b))
  }
}

// ---------------------------------------------------------------------------

var state = {}
var skillColumnPriority = {
  Rogue: [2,3,0,1],
  Necro: [1,0,2,3],
  _default: [0,1,2,3]
}

function waitGameReady() {
  if (document.querySelector('.offlineProgressBarContainer') === null) {
    console.log("Game is ready !")
    return next(initialize)
  } else {
    console.log("Waiting for fast-forward to terminate.")
    return next(100, waitGameReady)
  }
}

var characterTabNameRe = /(Fighter|Priest|Ranger|Pyro|Rogue|Druid|King|Necro|Barbarian|__TODO__)/

function initialize() {
  console.log("Initializing state.")
  state.characters = []
  var tabMatch, characterClass
  Array.from(document.querySelectorAll('#gameTabMenu a')).forEach(a => {
    if (a.innerHTML === 'Game') {
      console.log("Game tab found.")
      state.gameTab = {
        show: a.onclick
      }
    } else if (tabMatch = a.innerHTML.match(characterTabNameRe)) {
      characterClass = tabMatch[1]
      console.log("%s tab found.", characterClass)
      state.characters.push({
        showCharacterSheet: a.onclick,
        characterClass: characterClass,
        skillpoints: function() {
          var match = a.innerHTML.match(/([0-9]+)/)
          return match ? Number(match[0]) : 0
        }
      })
    }
  })

  state.charCount = state.characters.length

  state.characters.forEach(function(character, index) {
    var characterSheet = document.querySelector('#characterTabContainer' + index)
    var skillsTable = characterSheet.querySelector('.adventurerSkillTreeTable')
    character.availableSkills = function() {
      var buttons = Array.from(skillsTable.querySelectorAll('.upgradeButton'))
      buttons.sort(sortBy(function(button) {
        var column = button.parentNode.getAttribute('id').match(/[0-9]$/)[0]
        var priorities = skillColumnPriority[character.characterClass]
                      || skillColumnPriority._default
        return priorities[Number(column)]
      }))
      return buttons
    }
  })

  state.upgradesContainer = document.getElementById('upgradeButtonContainer')
  console.log('state', state)
  return next(mainLoop)
}

function mainLoop(nothingWasDone) {
  var char = getUpgradableCharacter()
  if (char) {
    return next(manageCharacter, char)
  }
  if (getAvailableUpgrades().length) {
    console.log("Upgrades available")
    state.gameTab.show()
    return next(purchaseAllUpgrades)
  }
  console.log("Nothing to do.")
  if (!nothingWasDone) {
    state.gameTab.show()
  }
  return next(1000, mainLoop, true)
}

function manageCharacter(character) {
  character.showCharacterSheet()
  if (character.skillpoints()) {
    return next(buySkills, character)
  } else {
    return next(mainLoop)
  }
}

function mouseupButton(button) {
  var evt = new Event('mouseup', {
    bubbles: true,
    cancelable: true
  })
  button.dispatchEvent(evt)
}

function buySkills(character) {
  var skills = character.availableSkills()
  if (skills.length) {
    var skillName = skills[0].innerText
    console.log("Buy skill %s for %s.", skillName, character.characterClass)
    mouseupButton(skills[0])
    return next(100, buySkills, character)
  }
  return next(manageCharacter, character)
}

// ---------------------------------------------------------------------------

function getUpgradableCharacter() {
  var chars = state.characters
  for (var i = 0; i < state.charCount; i++) {
    var char = chars[i]
    if (char.skillpoints()) {
      console.log("Character has skillpoints : %s.", char.characterClass)
      return char
    }
  }
  return false
}

function getAvailableUpgrades() {
  var divs = state.upgradesContainer.querySelectorAll('.upgradeButton')
  return Array.from(divs).filter(div => {
    return div.innerHTML.indexOf("Attack Castle") === -1
        && div.style.display === 'block'
        && div.innerHTML.indexOf("Assessment: Very Tough!") === -1
        && div.innerHTML.indexOf("Assessment: TOO HARD!") === -1
  })
}

function getTopUpgrade() {
  var availables = getAvailableUpgrades()
  return availables.length ? availables[0] : false
}

function purchaseAllUpgrades() {
  var upgrade = getTopUpgrade()
  if (upgrade) {
    console.log("Buy upgrade : %s", upgrade.innerText)
    mouseupButton(upgrade)
    return next(purchaseAllUpgrades)
  } else {
    return next(mainLoop)
  }
}

// ---------------------------------------------------------------------------

loop(next(1000, waitGameReady))
}())
