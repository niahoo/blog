<!doctype html>
<meta charset="utf-8" />
<title>{% block title %}{{ title }}{% endblock %}</title>

<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<link rel="stylesheet" href="/lib/css/bootstrap-lumen.min.css" />
<link href='https://fonts.googleapis.com/css?family=Merriweather:300,300italic,700,900|Merriweather+Sans:700' rel='stylesheet' type='text/css'>
<link rel="stylesheet" href="/lib/css/main.css" />
<link rel="stylesheet" href="/lib/css/prism.css" />


<body class="{% block bodyclass %}body-default{% endblock %}">
<div class="container">
{% block content %}
	{{ contents | safe }}
{% endblock %}
</div>

{% if livereload %}
	<script src="http://localhost:35729/livereload.js"></script>
	<script>
		console.log('Development mode, livereload on')
	</script>
{% endif %}
<footer>
</footer>
</body>
