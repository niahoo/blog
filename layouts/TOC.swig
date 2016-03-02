<ol>
{% for article in toc_collection %}
	{% if article.url == current.url %}
	<li>→ {{article.toc_title}}</li>
	{% else %}
	<li><a href="{{article.url}}" title="{{article.title}}">{{article.toc_title}}</a></li>
	{% endif %}
{% endfor %}
</ol>
