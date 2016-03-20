{% extends 'base.swig' %}

{% block bodyclass %}home{% endblock %}
{% block content %}

	<p class="h1">Hello !</p>
	<h1 class="paragraph">Ceci est mon devlog.</h1>
	{{ contents | safe }}


	<h3>Articles du blog</h3>
	<ul>
	{% for article in collections.articles -%}
	<li><a href="{{article.url}}">{{article.title}}</a><span class="toc-date"> – {{ article.date|frdate_short(lang) }}</span></li>
	{%- endfor %}
	</ul>


{% endblock %}
