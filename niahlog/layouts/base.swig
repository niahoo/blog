<!doctype html>
<meta charset="utf-8" />
<title>{% block title %}{{ title }}{% endblock %}</title>

<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<link href='https://fonts.googleapis.com/css?family=Merriweather:300,300italic,700,900|Merriweather+Sans:300,700|Roboto+Mono' rel='stylesheet' type='text/css'>
<link rel="stylesheet" href="/lib/css/sanitize.min.css" />
<link rel="stylesheet" href="/lib/css/prism.css" />
<!--- main css is at the bottom --->


<body class="{% block bodyclass %}body-default{% endblock %}{% if IS_DEV %} dev{% endif %}">
<div class="navbar-wrapper">
	<input type="checkbox" id="ck-show-menu" />
	<nav class="navbar">
		<a href="/">Home</a>
		<a href="https://github.com/niahoo/blog">Source</a>
	</nav>
	<label class="bt-menu" for="ck-show-menu" title="Pin menu">
		<span class="bt-top"></span>
		<span class="bt-middle"></span>
		<span class="bt-bottom"></span>
	</label>
</div>
<div class="container">
{% block content %}
	{{ contents | safe }}
{% endblock %}
</div>

{% if IS_DEV %}
	<script src="http://localhost:35729/livereload.js"></script>
	<script>
		console.log('Development mode, livereload on')
	</script>
{% endif %}
<footer>
</footer>
<script type="text/javascript">
(function(){
	var ckb = document.getElementById('ck-show-menu')
	if (localStorage) {
		ckb.addEventListener('change', function(){
			console.log('changed !', this.checked)
			localStorage.setItem('menu-vis', this.checked ? '1' : '0')
		})
		var checked = Number(localStorage.getItem('menu-vis'))
		if (checked) ckb.setAttribute('checked', 'checked')
		// else ckb.removeAttribute('checked') // useless ?
	}
}())
</script>
<!--- Put the css after the script to diable transition on load --->
<link rel="stylesheet" href="/lib/css/main.css" />
</body>
