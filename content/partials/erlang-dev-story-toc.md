title: "Table Of Contents"


****

{% for f in press.query('dir:articles/erlang-dev-story') %}
{% if f.id == parent.id %}
* {{ f.get('toc_title', f.title) }} ←
{% else %}
* [{{ f.get('toc_title', f.title) }}]({{ f.url }})
{% endif %}
{% endfor %}

-------
