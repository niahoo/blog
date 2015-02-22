@extends('press::layouts.base')

@section('content')

	<div class="content row">
		<div class="col-md-9">
			{!! $content['html'] !!}

			<p class="published-date">
				Publié le {{ Lud\Utils\toUTF8(strftime("%A %d %B %Y", $meta->dateTime()->getTimestamp())) }}
			</p>

			@if($content['footnotes_html'])
				{!! $content['footnotes_html'] !!}
			@endif
		</div>
	</div>

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
