module.exports = function(hexo) {
  var site = {
    posts: hexo.locals.get('posts'),
    pages: hexo.locals.get('pages'),
    categories: hexo.locals.get('categories'),
    tags: hexo.locals.get('tags'),
  }
  var __matchEval = /\<@([\s\S]+?)@\>/
  // regex/g flag does not work with non-greedy regex … so we loop
  return function(__text) {
   console.log('--------------------------------------------')
    while (__text.match(__matchEval)) {
      __text = __text.replace(__matchEval, function(_, __jsCode){
      console.log("EVAL", __jsCode)
      try {
        var __result = eval(__jsCode)
        console.log("RESULT", __result)
        return __result
      } catch(e) {
        console.log("FAIL")
        console.error(e)
        return ''
      }
      })
    }
    console.log(__text.substr(0,150))
    return __text
  }  
}

