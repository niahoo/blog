title: "Quelques ingrédients et une pincée de magie …"
toc_title: "Présentation du jeu"
layout: layouts.articles

****

# {{ article.title }}

*Cet article fait partie d'une série traitant du développement d'un jeu multijoueur avec Erlang/OTP et Elixir. Retrouvez les autres articles dans ce sommaire :*

{{ press.file('erlang-dev-story-toc').import }}



Il y a quelques temps est apparu sur le forum Jeuweb un sujet intitulé « [ Jeu de crafting de potions dans un univers med-fan décalé](http://www.jeuweb.org/showthread.php?tid=8604&pid=110544#pid110544) ».

À l'époque, je venais de découvrir Erlang, je faisais tous les tutos possibles, je lisais énormément dessus et j'apprenais assez vite. Il faut dire que la syntaxe et les types de données sont très simples, il n'y a pas grand chose à retenir. Voici l'implémentation de [FizzBuzz](http://en.wikipedia.org/wiki/Fizz_buzz) en Erlang pour voir à quoi cela ressemble :

```	erlang
-module(fizzbuzz).
-export([run/0]).

run() -> lists:foreach(fun print/1, lists:seq(1,100)).

print(X) -> io:format("~s\n",[show(X)]).

show(X) when X rem 15 == 0 -> "FizzBuzz";
show(X) when X rem  3 == 0 -> "Fizz";
show(X) when X rem  5 == 0 -> "Buzz";
show(X) -> integer_to_list(X).
```



En lisant cela, j'ai quelque peu piqué l'idée présentée dans le topic [^good_idea] en la simplifiant au maximum.


J'ai défini un jeu très simple, facile à concevoir et à implémenter. Mon but ? Valider les concepts développés pour mon jeu principal ; voir si mes modules gérant le multijoueur et l'IA du jeu se complétaient bien ; voir si la communication avec le navigateur via *websockets* ou *long-polling* étaient facile à mettre en place, voir si tout ce que je développe pour mon projet principal s'accorde bien et peut former quelque chose qui fonctionne. Voir si j'en étais capable.

[^good_idea]: Avec l'aimable autorisation de l'auteur !

Et aussi, bon sang, sortir quelque chose !

J'ai ensuite découvert que n'importe quel jeu multi, même un morpion, même plus simple,  même contre une IA, demande de fournir pas mal de boulot, et de mettre en place des technologies assez avancées !
