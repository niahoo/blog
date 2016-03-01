{% extends 'base.swig' %}


{% block content %}
	{{ contents | safe }}

	<h2>Content Rules</h2>

	<p>Nullam lacinia augue id ornare volutpat. Suspendisse sodales id elit ut elementum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam lacinia augue id ornare volutpat. Suspendisse sodales id elit ut elementum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>


	<h3>Tous les articles</h3>
	<ul>
	{% for article in collections.articles %}
	<li><a href="{{article.path}}">{{article.title}}</a></li>
	{% endfor %}
	</ul>

	<h3>Articles about Elixir and a game</h3>
	<ul>
	{% for article in collections.story_elixir_game %}
	<li>{{article.title}} <a href="{{article.path}}">linkTo</a></li>
	{% endfor %}
	</ul>

	<h3>Autres pages</h3>
	<ul>
	{% for page in collections.pages %}
	<li><a href="{{page.path}}">{{page.title}}</a></li>
	{% endfor %}
	</ul>


{% endblock %}
