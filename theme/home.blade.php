@extends ('press::layouts.base')

@section('top')
	<div id="navbar-wrapper" data-offset-top="360">
		@include('press::pressParts.navbar')
	</div>
@stop

@section('content')
	@foreach ($articles as $article)
		<a href="{{ $article->url() }}">
			{{ $article->get('title', $article->id) }}
		</a>
		<br/>
	@endforeach
	{!! $paginator->render() !!}
@stop
