---
title: "Architecture serveur d'un jeu web Elixir"
toc_title: "*Frameworks* et librairies"
layout: article.swig
disqus_identifier: eds.apps
description: "Présentation des applications Elixir/Erlang utiles au développement d'un jeu web"
date: 2015-03-03
toc: story_elixir_game
---

*Cet article fait partie d'une série traitant du développement d'un jeu multijoueur avec Erlang/OTP et Elixir. Retrouvez les autres articles dans ce sommaire :*

includeTOC {{ toc }}

Voici une petite présentation des outils que je souhaite mettre en place pour mon jeu. À titre de comparaison, voyons en premier lieu une *stack* typique pour un jeu PHP :

## Comparatif : La *stack* pour un jeu en PHP

Concentrons-nous sur les applications qui s'exécutent. Imaginons que l'on veuille créer MorpionOnline avec PHP. On a donc besoin de PHP, idéalement d'un *framework* qui nous rende la vie plus facile. Ensuite il nous faut un serveur web, par exemple Apache ou nginx. On veut également stocker les données des joueurs et des parties de morpion, donc il nous faut une base de données comme MongoDB, PostgreSQL ou MySQL.

Pour avoir une expérience de jeu plus agréable, on communiquera avec le serveur en arrière plan, en envoyant des requêtes AJAX. Mais le morpion ça se joue à deux. Si on souhaite pouvoir avertir le joueur dès que son adversaire a fini de jouer et rafraîchir le plateau de jeu, il nous faut une technologie *[push](http://fr.wikipedia.org/wiki/Server_push)* qui fonctionne en *long-polling* ou avec des *websockets*. Cet exemple avec le morpion est assez simple mais pour un jeu un peu plus complexe implicant des interactions entre plusieurs joueurs et des traitements assez longs, il devient rapidement nécessaire d'installer un système de queues tel que [php-resque](https://github.com/chrisboulton/php-resque). On peut utiliser `cron` mais ce n'est vraiment pas optimal car le laps de temps minimal est la minute.

Et au milieu de tout ceci il y aura le *core* de notre jeu, le « moteur », qui se basera sur tout le reste.

## La *stack* Elixir/Erlang

Avec Erlang, on retrouvera la même structure, mais uniquement avec des applications Erlang/Elixir : le serveur web, le *framework* web, la base de données, le serveur *websockets*, le système de queues, etc.

Dans le monde Erlang, et par extension Elixir, chaque projet est une application, et chaque dépendance est une application. C'est une structure simple qui permet de compiler, configurer et démarrer tous les projets de la même manière quand on lance la machine virtuelle. De plus, du code Erlang/Elixir respectant cette structure bénéficiera automatiquement du système de supervision de cete VM.

Même une librairie est construite comme une application, elle n'est simplement pas démarrée au lancement de la VM. Mais son code est disponible pour les autres applications.

Pour info, Erlang et Elixir se compilent tous les deux dans le même *bytecode*, les deux langages sont totalement interopérables et on peut appeler une fonction d'un modue Erlang en Elixir et vice-versa de façon tout à fait transparente.

### Un projet « deux-en-un »

Comme mon jeu traite de potions et que pour commencer à coder il faut bien nommer un fichier, j'ai décidé d'appeler mon application `popos`. Ce sera le serveur de jeu qui gèrera les joueurs, les parties et l'intelligence artificielle. Je dispose d'un protoype en Erlang, que je réécrirai petit à petit en Elixir.

Ensuite, je me base sur le *framework* web [Phoenix](http://www.phoenixframework.org/) pour écrire la partie web. Phoenix se charge également du serveur web en embarquant [cowboy](https://github.com/ninenines/cowboy), qui gère au passage les *websockets*.

L'application basée sur Phoenix contiendra donc les controlleurs, les templates HTML, et le code gérant les *websockets* (des controlleurs spécifiques). Ici également il me fallait un nom rapidement quand j'ai démarré donc ce sera `xpose`, car ce projet expose mon jeu au monde entier \o/.

### Les applications du jeu

Voici la liste des principales applications que j'ai retenues. Chacune d'entre-elles peut éventuellement avoir d'autre applications en tant que dépendances, qui ne sont pas listées. J'utilise également d'autres applications que nous aborderons en temps utile.

| Outil             | Application       | Langage          |
| ----------------- | ----------------- | ---------------- |
| *Core*            | popos             | Elixir (réécrit) |
| *Controllers*     | Xpose             | Elixir           |
| Serveur HTTP/WS   | cowboy            | Erlang           |
| *Framework* web   | Phoenix           | Elixir           |
| Base de données   | cowdb             | Erlang           |
| Logs              | Logger            | Elixir           |
| Test unitaires    | ExUnit            | Elixir           |

Ce qu'il faut bien comprendre, c'est que toutes ces applications sont lancées dans un même contexte d'exécution, la machine virtuelle Erlang : BEAM.

Si toutes les applications sont exécutées dans un même environnement d'exécution (le *runtime* comme on dit), ça veut dire qu'elles peuvent communiquer facilement. Pas de FastCGI Apache/PHP, pas de PDO pour communiquer avec la base de données et stocker les tâches dans les queues. Pas de communication non plus avec un service de *push* externe ou décentralisé. Pas de communication inter-processus. Si l'application A souhaite communiquer avec l'application B cela se fait via du code, en appelant une fonction.

Bien sûr, en PHP pour communiquer avec MySQL on se contente d'appeler des fonctions. Mais les extensions `mysqli` et `pdo_mysql`, elles, envoient et reçoivent des informations depuis d'autres processus.

Le seul point commun avec la *stack* LAMP classique c'est le client. Ici on n'a pas le choix, ce sera HTML5, CSS3, Javascript-ES6. Mais le fait d'avoir tout-en-un sur le serveur, et un client à côté nous incite à vraiment à définir une API pour découpler ce client et faire faire un maximum de travail par AJAX/*push*. Cela nous avantage quand on veut créer d'autres clients comme des applications mobiles ou des scripts automatisés en CLI via `cron`[^ecron].

[^ecron]: Mais bien entendu il y a [ecron](https://github.com/fra/ecron), un système de cron à la seconde écrit en Erlang.

Cependant, si on souhaite stocker des données sur le long terme, une base de données classique est quand même sympathique pour pouvoir la partager avec des outils non-Erlang. Pour le moment je ne m'en sers pas, mais il existe des applications Erlang/Elixir pour s'interfacer avec la plupart des SGBDR open-source, je pense essentiellement à PostgreSQL. Par goût personnel principalement mais c'est également le pilote par défaut de [Ecto](https://github.com/elixir-lang/ecto), un outil Elixir pour écrire des requêtes, définir des modèles, un schéma, et un outil de migrations.

## Mix, Hex, OTP : WTF ?

Commençons par OTP : *[Open Telecom Platform](https://en.wikipedia.org/wiki/Open_Telecom_Platform)* est un *framework* ayant pour but de rendre les applications Erlang le plus robustes possible. La très grande majorité des applications Erlang/Elixir est basée sur OTP, notament les applications Erlang disponibles en standard si bien qu'on parle généralement d'une « application Erlang/OTP ».

Les applications OTP respectent une architecture logicielle bien spécifique. Je ne rentre pas dans les détails maintenant, mais le développement d'une application Elixir doit suivre ces mêmes principes afin qu'elle soit compilée, configurée et exécutée en tant qu'application Erlang/OTP et venir s'intégrer correctement dans le système. Mon jeu devrait donc suivre ces principes à la lettre.

Cela peut faire peur, mais dans mon cas, Phoenix s'occupe de tout. C'est donc un excellent point de départ pour découvrir le langage.

Ensuite, Elixir dispose de [Mix](http://elixir-lang.org/getting-started/mix-otp/introduction-to-mix.html), un outil permettant de compiler, de gérer les dépendances via [Hex](https://hex.pm/) (le *package manager*), et pour lequel on peut définir des commandes CLI à la manière d'Artisan, l'outil CLI pour Laravel.

De son côté, Erlang dispose, entre autres, de [rebar](https://github.com/basho/rebar) et [erlang.mk](https://github.com/ninenines/erlang.mk) pour compiler les projets et gérer les dépendances.

Mix et Hex permettent de gérer, télécharger et compiler des dépendances Erlang dans un projet Elixir. Typiquement, Phoenix (le *framework* web) utilise un serveur web écrit en Erlang : cowboy. Du coup, Mix suffira pour la majorité des besoins et j'ai donc choisi que l'application `popos` soit une dépendance de l'application `xpose`. Cela peut paraître contradictoire puisque le serveur de jeu pourrait avoir plusieurs interfaces avec le monde extérieur, mais c'est purement pratique. Il s'agit pour moi d'un seul et même projet.

Bon, tout ça fait beaucoup d'informations à digérer d'un bloc. Je reviendrai en détail sur chacun de ces aspects au cours du développement du projet.

Je vous suggère de jetter un coup d'oeil à l'excellent Phoenix via les pages [Installing](http://www.phoenixframework.org/docs/installation) puis la page [Up And Running](http://www.phoenixframework.org/docs/up-and-running).

