
function looper(callback) {
  return function loop(x, i) {
    for (i = 0; i < x; i++) {
      callback(i)
    }
  }
}

looper.async = function(callback, timeout) {
  timeout = timeout || 1
  return function loop(x, i) {
    i = i || 0
    if (i < x){
      setTimeout(function(){
        callback(i)
        loop(x, i + 1)
      }, timeout)
    }
  }
}

console.log("Hello !")
console.log("Le looper est déjà défini dans la console,")
console.log("mais n'hésitez pas à redéfinir la variable")
console.log("avec les exemples de l'article.")
