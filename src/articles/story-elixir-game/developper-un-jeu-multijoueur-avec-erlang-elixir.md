---
title: "Développer un jeu multijoueur avec Erlang et Elixir"
toc_title: "Introduction"
layout: article.swig
disqus_identifier: eds.apps
description: "Introduction au développement de jeux multijoueurs avec Erlang/OTP"
date: 2015-03-01
toc: articles/story-elixir-game/story-elixir-game.toc
---

Ceci constitue le premier article d'une courte série qui traitera de la création d'un jeu web multijoueur avec Erlang/OTP et Elixir. Je souhaite donner des pistes pour mettre en place une architecture adaptée à un jeu avec de nombreux joueurs, capable de soutenir un fort traffic et de nombreuses opérations concurrentes. Bien entendu, en utilisant les technologies d'aujourd'hui, notament les *websockets*, pour proposer une interface de jeu dynamique et fluide.

Je compte également traiter de la nature d'Erlang, *i.e.* un langage mettant la programmation concurrente et fonctionnelle au premier plan. Nous verrons que cela apporte des avantages et des inconvénients dans la création d'un jeu, les jeux étant par essence d'interminables successions d'opérations sur un même *state*.

Ces articles ne sont pas destinés à vous apprendre Erlang, je m'adresse en premier lieu à ceux qui connaissent déjà le langage, ou qui le découvrent en parallèle. Si vous voulez vous y mettre, il existe plein de tutos et d'articles à ce sujet, à commencer par [Learn You Some Erlang for great good!](http://learnyousomeerlang.com/), un livre (très) complet à lire en ligne gratuitement.

Si malgré tout Erlang ou Elixir ne vous intéressent pas plus que ça, vous pourrez quand même trouver ici des solutions intéressantes à des problèmes que rencontrent tous les développeurs de jeux *online*, web ou pas. Ce sont surtout des concepts d'architecture qui seront mis en avant, et ils peuvent dans certains cas être adaptés dans n'importe quel langage. Dans d'autre cas, leur adaptation demandera plus de travail mais ce sera un exercice interessant, au moins pour la forme.

## Table des matières

includeSource {{ toc | ospath }}
