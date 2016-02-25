{% extends 'base.swig' %}


{% block content %}
	{{ contents | safe }}

	<h4>Articles</h4>
	<ul>
	{% for article in collections.articles %}
	<li><a href="{{article.path}}">{{article.title}}</a></li>
	{% endfor %}
	</ul>

	<h4>Articles about Elixir and a game</h4>
	<ul>
	{% for article in collections.story_elixir_game %}
	<li><a href="{{article.path}}">{{article.title}}</a></li>
	{% endfor %}
	</ul>

	<h4>Pages</h4>
	<ul>
	{% for page in collections.pages %}
	<li><a href="{{page.path}}">{{page.title}}</a></li>
	{% endfor %}
	</ul>

{% endblock %}
