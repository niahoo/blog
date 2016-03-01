{% extends 'base.swig' %}

{% block bodyclass %}article{% endblock %}
{% block content %}
	<h1>{{ title }}</h1>
	{% include 'article-meta.swig' %}
	{{ contents | safe }}
{% endblock %}

