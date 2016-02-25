{% extends 'base.swig' %}


{% block content %}
	{{ contents | safe }}

	<ul>
	{% for article in collections.articles %}
	<li><a href="{{article.path}}">{{article.title}}</a></li>
	{% endfor %}
	</ul>

{% endblock %}
