function next(time, fn /*, ...args */) {
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

function looper(onError) {
  return function loop(step) {
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
}

function printCount(n) {
  if (n > 10) {
    return next(pause)
  } else {
    console.log('n = %s', n)
    return next(printCount, n + 1)
  }
}

function pause() {
  console.log('Pause !')
  return next(1000, printCount, 1)
}

var loop = looper(function(err){
  console.error(err)
  throw new Error(err)
})

console.log("Hello :)")
console.log("Les fonctions looper, next, printCount et pause sont définines dans la console.")
console.log("La fonction loop est également définie comme ceci :")
console.log(`\
  var loop = looper(function(err){
    console.error(err)
    throw new Error(err)
  })
`)
console.log("Vous pouvez la remplacer à tout moment !")
