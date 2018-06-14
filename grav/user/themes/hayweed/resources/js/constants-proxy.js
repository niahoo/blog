const constants = {}
const LOG_STYLE = 'color: purple;'
const Sym = (typeof Symbol !== 'undefined') ? Symbol : sym => '_sym_' + sym.toString()
// We will ask for keys to be defined alphabetically. We do not want to use
// Object.keys(constants) because we have enums starting with "ALL_" so we want
// only check keys defined with C()

const createConstants = function(callback) {
  const symDefKeys = Sym('definedKeys')
  let constants = {
    [Sym(definedKeys)]
  }

}

const identity = name => name
// const identity = name => '@(' + name.split('_').pop() + ')'

export const define = (name, value) => {
  if (process.env.NODE_ENV !== 'production') {
    const alphabeticallyAfter = definedKeys.filter(key => key > name)
    if (alphabeticallyAfter.length) {
      console.log("%cConstant %s should be defined before %s for alpha sort.",
      LOG_STYLE,
      name,
      alphabeticallyAfter.shift())
    }
    definedKeys.push(name)
  }
  constants[name] = value
  return value
}

// C() is used for name constants, like in redux actions, the value is
// just the name itself as a string
export const C = (name, getValue = identity) => {
  define(name, getValue(name))
}

const exportedConstants = process.env.NODE_ENV === 'production'
  ? constants
  : module.exports = new Proxy(constants, {
      get: function(c, key) {
        if (c.hasOwnProperty(key)) {
          return c[key]
        } else {
          console.log("%cConstant %s is not registered", LOG_STYLE, key)
          return key
        }
      },
      set: function() {
        throw new Error("Constants are not mutable")
      }
    })

export default exportedConstants
