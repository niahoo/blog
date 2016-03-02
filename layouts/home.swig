{% extends 'base.swig' %}


{% block content %}
	{{ contents | safe }}

	<h3>Tous les articles</h3>
	<ul>
	{% for article in collections.articles -%}
	<li><a href="{{article.url}}">{{article.title}}</a></li>
	{%- endfor %}
	</ul>

	<h3>Autres pages</h3>
	<ul>
	{% for page in collections.pages %}
	<li><a href="{{page.url}}">{{page.title}}</a></li>
	{% endfor %}
	</ul>


{% endblock %}
