<?php
// lud theme file
return [
	'styles' => [
		asset('packages/lud/press/lib/css/yeti-bootstrap.min.css'),
		'//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/styles/tomorrow.min.css',
		asset('packages/lud-theme/css/lud.css'),
	],
	'scripts' => [
		'//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js',
		'//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/highlight.min.js',
		asset('packages/lud/press/lib/js/bootstrap.min.js'),
	],
	'publishes' => [
		__DIR__.'/public' => base_path('public/packages/lud-theme'),
	],
];
