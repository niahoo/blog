@extends('press::layouts.base')

@section('content')

	<div class="content">
		{!! $content['html'] !!}

		@if($content['footnotes_html'])
		<div class="footnotes">
			<div class="footnotes-sep1"></div>
			<div class="footnotes-sep2"></div>
			{!! $content['footnotes_html'] !!}
		</div>
		@endif
	</div>
@stop
