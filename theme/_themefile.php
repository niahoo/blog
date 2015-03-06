<?php
// lud theme file
return [
	'styles' => [
		'//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/styles/tomorrow.min.css',
		'//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css',
		'//fonts.googleapis.com/css?family=Merriweather:900italic|Raleway:100,300|Open+Sans:400',
		asset('packages/lud-theme/css/lud.css'),
	],
	'scripts' => [
		'//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js',
		'//cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/highlight.min.js',
		'//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js',
		asset('packages/lud-theme/js/highlight.pack.js'),
	],
	'publishes' => [
		__DIR__.'/public' => base_path('public/packages/lud-theme'),
	],
];
