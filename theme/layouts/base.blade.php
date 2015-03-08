<!doctype html>
<html class="press lud-theme">
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->

@include('press::pressParts.meta')

@section('assets_styles')
@foreach ($themeAssets['styles'] as $styleHref)
	<link href="{{ $styleHref }}" type="text/css" rel="stylesheet"/>
@endforeach
@show

@section('top')
	@include('lud::partials.navbar')
@show

@section('full_content')
	<div class="container press-container">
		<div class="row">
			<div class="content col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2">
				@yield('content')
				@include('press::pressParts.cache_infos')
			</div>
		</div>
	</div>
@show

@section('assets_scripts')
	@foreach ($themeAssets['scripts'] as $scriptSrc)
		<script src="{{ $scriptSrc }}" type="text/javascript"></script>
	@endforeach

@show

@include('press::pressParts.admin_js_lib')
</html>
