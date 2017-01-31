function deduper() {
	var pool = [];
	return function (key, value) {
		if (typeof value === 'object') {
			if (pool.indexOf(value) === -1) {
				pool.push(value)
				return value
			} else {
				// Valeur déja passée
				return "__RECURSION__"
			}
		} else {
			return value
		}
	};
}

hexo.extend.helper.register('toJson', function(object, format) {
	return JSON.stringify(object, deduper(), format)
})	
	
