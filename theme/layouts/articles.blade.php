@extends('lud::layouts.base')

@section('content')


			{!! $content['html'] !!}

			<p class="published-date">
				Publié le {{ Lud\Utils\toUTF8(strftime("%A %d %B %Y", $meta->dateTime()->getTimestamp())) }}
			</p>

			@if($content['footnotes_html'])
				{!! $content['footnotes_html'] !!}
			@endif
		{{--
		<div class="col-md-4">
			<h3>Archives</h3>
			@include('lud::partials.archive')
		</div> --}}
@stop

@section('assets_scripts')
	@parent
	<script>
		hljs.initHighlightingOnLoad();
		$(function(){
			$('.footnotes').prepend([
				$('<div class="footnotes-sep1"></div>'),
				$('<div class="footnotes-sep2"></div>'),
			])
		});
	</script>
@stop
