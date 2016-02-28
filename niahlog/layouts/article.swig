{% extends 'base.swig' %}

{% block bodyclass %}article{% endblock %}
{% block content %}
	{{ contents | safe }}
{% endblock %}

