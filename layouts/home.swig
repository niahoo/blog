{% extends 'base.swig' %}


{% block content %}
	{{ contents | safe }}
	<dl>
		<dd>url</dd>
		<dt>{{ url }}</dt>
		<dd>absolute_url</dd>
		<dt>{{ absolute_url }}</dt>
	</dl>
	<h2>Content Rules</h2>

	<p>Nullam lacinia augue id ornare volutpat. Suspendisse sodales id elit ut elementum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam lacinia augue id ornare volutpat. Suspendisse sodales id elit ut elementum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>


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
