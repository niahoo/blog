{% extends 'base.swig' %}

{% block bodyclass %}page{% endblock %}
{% block content %}
	{{ contents | safe }}
{% endblock %}

