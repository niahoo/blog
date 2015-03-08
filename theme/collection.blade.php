@extends('lud::layouts.base')

@section('content')
	@foreach ($articles as $article)
		<div class="row collection-item">
			<div class="col-lg-2 collection-date">
				{{ $article->get('date', new DateTime())->format('m/d/Y') }}
			</div>
			<div class="col-lg-10">
				<h3>
					<a href="{{ $article->url() }}">
						{{ $article->get('title', $article->id) }}
					</a>
				</h3>
				@if($article->get('description',false))
					<p>{{ $article->get('description') }}</p>
				@endif
			</div>
		</div>
	@endforeach

	{!! $paginator->render() !!}
@stop

