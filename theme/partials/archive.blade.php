<ul class="archive">
@foreach(Press::query('dir:articles/')->getArchive() as $year => $byMonth)
	<li>
		<h3>{{ $year }}</h3>
		<ul>
		@foreach($byMonth as $monthNum => $archiveArticles)
			<li>
				<h4>{{ Lud\Utils\toUTF8(strftime("%B", DateTime::createFromFormat('!m', intval($monthNum))->getTimestamp())) }}</h4>
				<ul>
				@foreach($archiveArticles as $archiveArticle)
					<li>
						<a href="{{ $archiveArticle->url() }}">
							{{ $archiveArticle->get('title', $archiveArticle->id) }}
						</a>
					</li>
				@endforeach
				</ul>
			</li>
		@endforeach
		</ul>
	</li>
@endforeach
</ul>
