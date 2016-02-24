@extends('lud::collection')

@section('content')
	<h1>Hello !</h1>
	<p>
		Je suis un développeur web basé dans le sud de la France. Ici je parle
		essentiellement de mes projets personnels : des applis web et notamment
		des jeux vidéo que je développe avec Elixir, Erlang, PHP, et Javascript.
	</p>
	<p>
		Je développe également le moteur qui est derrière ce blog. <br/> Pour
		cela, j'ai créé une librairie : <a href="https://github.com/lud/press"
		title="a not-so-static blog engine for laravel">Press</a>, pour les
		applications développées avec <a href="http://laravel.com/">Laravel</a>.
	</p>
	<p>
		J'essaie aussi d'être drôle mais sans succès jusqu'à présent …
	</p>
	<h2>Blog Posts</h2>
	@parent
	<h2>Sources</h2>
	<p>
		Les	sources du blog (thème et articles) sont disponibles <a
		href="https://github.com/lud/blog">ici</a> ; vous pouvez m'envoyer une
		<i>pull-request</i> pour soumettre vos corrections !
	</p>
@stop
