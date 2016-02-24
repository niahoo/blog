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

	
@if(! Press::isEditing())
{{--
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', '{{env('GA_TOKEN')}}', 'auto');
  ga('send', 'pageview');
</script>
--}}

<script>
  var clicky_site_ids = clicky_site_ids || [];
  clicky_site_ids.push(100876165);
  (function() {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = '//static.getclicky.com/js';
    ( document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0] ).appendChild( s );
  })();		
</script>
<noscript><p><img alt="Clicky" width="1" height="1" src="//in.getclicky.com/100876165ns.gif" /></p></noscript>
@endif	
  
	
</html>
