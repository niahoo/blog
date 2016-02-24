title: "Quelques ingrédients et une pincée de magie …"
toc_title: "Présentation du jeu"
disqus_identifier: eds.pres
layout: layouts.articles

****

# {{ article.title }}

*Cet article fait partie d'une série traitant du développement d'un jeu multijoueur avec Erlang/OTP et Elixir. Retrouvez les autres articles dans ce sommaire :*

{{ press.file('erlang-dev-story-toc').import }}

Si vous avez lu le chapitre d'introduction, vous avez compris que cette série d'articles sera essentiellement technique, centrée sur la programmation et surtout l'architecture logicielle d'un jeu multijoueur par navigateur. Mais toutes les décisions que je prendrai devront suivre un objectif principal : que le jeu fonctionne, et qu'il soit fun. Voici donc une présentation de ce que je souhaite créer.

Deux joueurs s'affrontent à travers leurs équipes de magiciens, cuisiniers ou autres gobelins sorciers. Chaque équipe compte trois personnages et dispose d'une réserve d'ingrédients tels que des « essences de magie », du « poivre moulu » ou du « poil-à-gratter-inflammable ». Pour gagner la partie, il faut simplement se débarrasser de ses adversaires en leur lançant les potions les plus dangereuses. Chaque personnage dispose de quelques points de vie qui disparaissent rapidement sous les brûlures, poisons et maladies infligées par les potions. Heureusement, il est également possible de soigner son équipe avec certaines potions.

En termes de *gameplay*, le jeu s'apparente à un jeu de cartes comme on en trouve beaucoup sur internet. Certes, ce n'est pas très original mais j'ai envie de faire quelque chose de simple, pour apprendre. Les potions ont des effets directs ou sur la durée, des effets ciblés ou de groupe et des effets de « diffusion ». 

Par exemple, une potion de flammes inflige directement une brûlure à sa cible qui perd quelques points de vie. Une potion d'explosion inflige des dommages des groupe : chaque personnage adverse perd de la vie. Un poison ou une maladie va infecter sa cible et lui faire perdres quelques points de vie à chaque tour. Mélanger des ingrédients pour faire une explosion avec du poison permet d'envoyer un nuage toxique qui va activer des dégâts sur la durée à plusieurs cibles.

Enfin, les effets de diffusion n'infligent pas obligatoirement de dégâts mais rajoutent une dimension tactique. Par exemple, j'envoie une maladie à l'un des personnages adverses. Je sais que la maladie dure au moins deux tours (sauf si elle est soignée). Au tour suivant, je lui envoie une potion contenant du poivre qui le fera éternuer, diffusant ainsi la maladie à ses compagnons.

À chaque tour, on doit sélectionner trois ingrédients, ni plus ni moins. Et à chaque tour, trois nouveaux ingrédients tirés aléatoirement viennent remplacer ceux utilisés. Je me demande s'il serait intéressant que les deux joueurs commencent avec les mêmes ingrédients et reçoivent les mêmes ingrédients ensuite. Cela permet d'avoir plus de vision stratégique, mais confère un avantage trop important au joueur qui commence à mon goût.

Je n'ai pas vraiment décidé du *background* du jeu. Je pense à une vague histoire de championnat de sorcellerie mais je cherche toujours ce que des scientifiques et des cuisiniers pourraient bien avoir à faire là dedans.
