@extends('lud::layouts.base')

@section('content')


			{!! $content['html'] !!}

			<p class="published-date">
				Publié le {{ Lud\Utils\toUTF8(strftime("%A %d %B %Y", $meta->dateTime()->getTimestamp())) }}
			</p>

			@if($content['footnotes_html'])
				<div class="footnotes">
					<div class="footnotes-sep1"></div>
					<div class="footnotes-sep2"></div>
					{!! $content['footnotes_html'] !!}
				</div>
			@endif
		{{--
		<div class="col-md-4">
			<h3>Archives</h3>
			@include('lud::partials.archive')
		</div> --}}

		<div id="disqus_thread"></div>
		<script type="text/javascript">
			var disqus_shortname = 'niahoo-blog';
			@if($meta['disqus_identifier'])var disqus_identifier = "{{$meta['disqus_identifier']}}";@endif
			
			(function() {
				var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
				dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
				(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
			})();
		</script>
		<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>

@stop

@section('assets_scripts')
	@parent
	<script>
		hljs.initHighlightingOnLoad();
	</script>
@stop
