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

function console_log() {}

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
  return next(1000, waitGameReady)
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

function mouseupButton(button) {
  var evt = new Event('mouseup', {
    bubbles: true,
    cancelable: true
  })
  button.dispatchEvent(evt)
}

// ---------------------------------------------------------------------------

var state
var skillColumnOrder = {
  Rogue:     [2,3,0,1],
  Necro:     [1,0,2,3],
  Priest:    [0,3,2,1],
  Barbarian: [1,0,2,3],
  Ninja:     [0,2,3,1],
  _default:  [0,1,2,3]
}

function waitGameReady() {
  if (document.querySelector('.offlineProgressBarContainer') === null) {
    return next(initialize)
  } else {
    console.log("Waiting for fast-forward to terminate.")
    return next(100, waitGameReady)
  }
}

var characterTabNameRe = /(Electro|Ninja|Fighter|Priest|Ranger|Pyro|Rogue|Druid|King|Necro|Barbarian|__TODO__)/

function initialize() {
  state = {}
  console.log("Initializing state.")
  state.characters = []
  var tabMatch, characterClass
  Array.from(document.querySelectorAll('#gameTabMenu a')).forEach(function(a) {
    if (a.innerHTML === 'Game') {
      console.log("Game tab found.")
      state.gameTab = {
        show: a.onclick
      }
    } else {
      tabMatch = a.innerHTML.match(characterTabNameRe)
      if (tabMatch) {
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
    }
  })

  state.charCount = state.characters.length
  if (state.charCount === 0) {
    throw new Error("Game is not ready")
  }

  state.characters.forEach(function(character, index) {
    var characterSheet = document.querySelector('#characterTabContainer' + index)
    var skillsTable = characterSheet.querySelector('.adventurerSkillTreeTable')
    character.availableSkills = function() {
      var buttons = Array.from(skillsTable.querySelectorAll('.upgradeButton'))
      var priorities =
        skillColumnOrder[character.characterClass] || skillColumnOrder._default
      buttons.sort(sortBy(function(button) {
        var column = button.parentNode.getAttribute('id').match(/[0-9]$/)[0]
        return priorities.indexOf(Number(column))
      }))
      return buttons
    }
  })

  state.upgradesContainer = document.getElementById('upgradeButtonContainer')
  state.potionsContainer = document.getElementById('potionButtonContainer')
  console.log("Game is ready !")
  console.log('state', state)
  return next(mainLoop)
}

function mainLoop(loopSelf) {
  var char = getUpgradableCharacter()
  if (char) {
    return next(manageCharacter, char)
  }
  if (getAvailableUpgrades().length) {
    console.log("Upgrades available")
    state.gameTab.show()
    return next(purchaseAllUpgrades)
  }
  if (getUsablePotions().length) {
    console.log("Potions available")
    state.gameTab.show()
    return next(useOrDiscardPotions)
  }
  if (! loopSelf) {
    // if loopSelf, we are coming in mainLoop from the previous mainLoop, not
    // from an actual game action. if Not loopSelf (this block), we are coming
    // maybe from a character sheet so we should show the main game tab
    state.gameTab.show()
  }
  // If we are here, no action was taken on this mainLoop execution, so we loop
  // with the loopSelf flag enabled
  return next(5000, mainLoop, true)
}

function manageCharacter(character) {
  character.showCharacterSheet()
  if (character.skillpoints()) {
    return next(buySkills, character)
  } else {
    return next(mainLoop)
  }
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
  return Array.from(divs).filter(function(div) {
    return div.innerHTML.indexOf("Attack Castle") === -1 &&
           div.style.display === 'block' &&
           div.innerHTML.indexOf("Assessment: Very Tough!") === -1 &&
           div.innerHTML.indexOf("Assessment: TOO HARD!") === -1
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

function getUsablePotions() {
  var potions = Array.from(
      state.potionsContainer
      .querySelectorAll('.potionContentContainer')
    )
    .filter(function(div) {
      // Discard already running potions and locked slots
      return div.querySelector('.potionButton') !== null
    })
    .map(function(div) {
      var consumeButton = div.querySelector('.potionButton')
      var dropButton = div.querySelector('.dropPotionButton')
      var potionName = consumeButton.querySelector('tr td:last-child').innerText
      return {
        consume: function() {
          console.log("Use potion %s", potionName)
          mouseupButton(consumeButton)
        },
        drop: function() {
          console.log("Drop potion %s", potionName)
          mouseupButton(dropButton)
        },
        name: potionName
      }
    })
  // 'Potions Last Longer' is a meta potion, we want to use it only if there is
  // another potion at least (@todo check for running potions ?)
  if (potions.length === 1 && potions[0].name === 'Potions Last Longer') {
    return []
  }
  // If there is a meta potion but it is last in list, at one point it will be
  // the only left element in list (when previous potions will be activated and
  // will no more show in list). So we will be in the previous case, and not use
  // it althoug there were potions in the same time.
  // So we want to put it first in the list.
  return potions.sort(sortBy(function(potion){
    if (potion.name === 'Potions Last Longer') return 0 // top list
    else return 1
  }))
}

var potionsActions = {
  '____________': 'drop',
  'Infinite Scrolls': 'drop',

  '_____________': 'consume',
  '100% Item Drops': 'consume',
  'Docile Monsters': 'consume',
  'Double Gold Drops': 'consume',
  'Double Gold': 'consume',
  'Double Item Drops': 'consume',
  'Double Kills': 'consume',
  'Fast Walking': 'consume',
  'Faster Farming': 'consume',
  'Faster Infestation': 'consume',
  'Item Gold Values': 'consume',
  'More Kills Per Farm': 'consume',
  'More Monsters': 'consume',
  'Potions Last Longer': 'consume',
  'Random Boss Fights': 'consume',
  'Random Treasure Rooms': 'consume',
  'Scrolls Auto Fire': 'consume',
  'Spells Cost Nothing': 'consume',
}

function useOrDiscardPotions() {
  var potions = getUsablePotions()
  if (! potions.length) {
    return next(mainLoop)
  }
  var potion = potions[0]
  var action = potionsActions[potion.name]
  if (! action) {
    console.warn("Undef potion action for %s", potion.name)
    prompt("Undef potion action : ", potion.name)
    potionsActions[potion.name] = 'consume' // do not re-prompt for the same potion
    action = 'consume'
  }
  potion[action]()
  // we must re-read DOM at each time, because finished or dropped potions
  // change potions positions in the list
  return next(useOrDiscardPotions)
}

// ---------------------------------------------------------------------------

loop(next(1000, waitGameReady))
}())
