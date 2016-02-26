{% extends 'base.swig' %}


{% block content %}
	{{ contents | safe }}

	<h2>Articles</h2>
	<ul>
	{% for article in collections.articles %}
	<li><a href="{{article.path}}">{{article.title}}</a></li>
	{% endfor %}
	</ul>

	<h2>Articles about Elixir and a game</h2>
	<ul>
	{% for article in collections.story_elixir_game %}
	<li>{{article.title}} <a href="{{article.path}}">linkTo</a></li>
	{% endfor %}
	</ul>

	<h2>Pages</h2>
	<ul>
	{% for page in collections.pages %}
	<li><a href="{{page.path}}">{{page.title}}</a></li>
	{% endfor %}
	</ul>

{% endblock %}
