<div class="toc-wrapper">
	

	<ol class="toc">
	{% for article in toc_collection %}
		<li>
		{% if article.url == current.url %}
			<h4>{{article.toc_title}}</h4>
			<span class="current">
				{{article.title}}
			</span>
		{% else %}
			<h4>{{article.toc_title}}</h4>
			<a href="{{article.url}}" title="{{article.title}}">
				{{article.title}}
			</a>
		</li>
		{% endif %}
	{% endfor %}
	</ol>
</div>
