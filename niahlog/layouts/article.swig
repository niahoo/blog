{% extends 'base.swig' %}

{% block content %}
	{{ next.title | json(4) }}
	{{ previous.title | json(4) }}
	{{ contents | safe }}
{% endblock %}

