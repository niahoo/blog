@extends ('press::layouts.base')

@section('full_content')
	<div class="container press-container">
		<div class="row">
			<div class="content col-md-8 col-md-offset-2 col-xs-10 col-xs-offset-1">
				@yield('content')
				@include('press::pressParts.cache_infos')
			</div>
		</div>
	</div>
@stop

