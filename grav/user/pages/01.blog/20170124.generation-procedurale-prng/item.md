---
title: 'Génération procédurale : prenez-en de la graine !'
intro: >-
  Cet article explique comment générer du contenu de façon aléatoire à partir
  d'une « graine » et comment générer le même contenu à partir de la même graine. 
  Cette technique est utilisée par de nombreux jeux pour créer des cartes
  (Banished, Civilization, …), des armes (Borderlands) ou encore des univers
  complets (No Man's Sky). Et c'est tout simple !
taxonomy:
    category: Dev
    tag:
        - javascript
        - level-design
publish_date: '2017-01-24'
---

Pour la création d'un petit jeu incrémental sur lequel je travaille en ce
moment, basé sur des tuiles hexagonales, j'avais envie d'afficher au joueur une
carte assez élaborée respectant deux critères importants :

- La carte doit être générée de façon aléatoire, afin de proposer une quasi-
  infinité de cartes différentes.
- On doit être capable d'obtenir de manière certaine une carte spécifique.

J'ai donc suivi deux principes simples en réponse à ces critères :

Premièrement, le principe de base de la génération procédurale : je donne un
cadre à l'algorithme, par exemple une altitude maximale pour les montagnes, un
nombre restreint d'environnements possibles (les fameux biomes – nous y
reviendrons), et évidemment une taille de carte. Il serait possible de faire une
carte infinie mais pour le moment ça reste beaucoup plus simple de pouvoir la
générer en entier au chargement. L'algorithme tire tout au hasard dans les
limites données, et le résultat sera toujours différent.

Ensuite, et c'est la technique principale discutée ici, j'utilise une « graine
». Généralement on utilise un nombre entier tenant sur 32 bits, soit entre `0`
et `4 294 967 295`, ce qui me convenait très bien ! La carte est générée à
partir de cette graine, et une même graine donnera toujours la même carte.

L'un des principaux avantages est qu'au lieu de sauvegarder la carte dans les
données du jeu (par exemple dans `window.localStorage`), on se contente d'y
sauvegarder la graine, ce qui est beaucoup plus léger. En contrepartie, on doit
re-générer la carte et c'est un peu plus long au chargement.

Autre avantage, si une graine donne une carte particulièrement intéressante, il
est possible de communiquer cette graine à d'autres joueurs pour qu'ils jouent
la même carte, ou de recommencer une partie sur la même carte pour tirer profit
de notre connaissance du terrain. Plutôt cool, non ?

Voyons maintenant comment planter cette graine …

## Les générateurs de nombres pseudo-aléatoires

Il nous faut donc d'un côté un algorithme qui calcule tout aléatoirement, mais
d'un autre côté être sûr qu'à partir d'une même graine on ait toujours le même
résultat – de l'aléatoire prévisible donc … Et là vous vous dites qu'on n'est
pas rendus. Sauf si vous connaissez comme moi le principe des
[générateurs de nombres pseudo aléatoires (Wikipédia)](https://fr.wikipedia.org/wiki/Générateur_de_nombres_pseudo-aléatoires).

L'idée est d'avoir une fonction (ou un objet) qui donne un nombre _qui a l'air
aléatoire_, en fonction de la graine. Une fois qu'on a généré un nombre
aléatoire, le générateur crée une autre graine automatiquement afin de pouvoir
générer des nombres différents. Cette nouvelle graine est également toujours la
même en fonction de la graine précédente, nous assurant de retrouver toujours
la même suite de nombres à partir de la graine initiale donnée au générateur).

Au final, notre graine n'aura servi qu'une seule fois, lors de l'initialisation
du générateur. Ensuite, c'est lui qui s'occupe du reste, on peu s'en servir
comme n'importe quel autre générateur de nombres aléatoires.


## Implémentation en Javascript

Voici comment j'ai mis ça en place en javascript. Premièrement j'ai testé
plusieurs modules et fini par trouver celui qui me convenait :
[random-js](https://www.npmjs.com/package/random-js).


```bash
# Petit copier-coller gratuit ;)
npm install --save random-js
```

Le module permet de créer un générateur puis d'appeler les fonctions comme
`integer(min, max)` en leur passant le générateur. J'ai donc créé une fonction
initialisant le générateur à partir de la graine et renvoyant une API pratique à
utiliser :

```javascript
import Random from 'random-js'

function getRnd(seed) {
  let randomGen = Random.engines.mt19937()
  randomGen.seed(seed)
  return {
    integer: function(min, max) {
      return Random.integer(min, max)(randomGen)
    },
    pick: function(array, begin, end) {
      return Random.pick(randomGen, array, begin, end)
    },
    real: function(min, max, inclusive) {
      return Random.real(min, max, inclusive)(randomGen)
    }
  }
}
```

Mon API dispose donc de 3 fonctions :

- `integer` permettant de tirer un simple nombre entre deux bornes incluses ;
- `pick` permettant de tirer un élément au hasard dans un `Array` ;
- et `real` renvoyant, comme `Math.random`, un nombre entre `0` inclus et `1`
  exclu (si `inclusive` est `false` (par défaut), ou inclu si `inclusive` est
  `true`).

Voici un code de test montrant qu'avec une même graine on obtient les mêmes résultats :

```javascript
let seed = 1664
let random1 = getRnd(seed)
console.log(
  random1.integer(0, 10),
  random1.integer(0, 10),
  random1.integer(0, 10)
)
let random2 = getRnd(seed)
console.log(
  random2.integer(0, 10),
  random2.integer(0, 10),
  random2.integer(0, 10)
)
```

Si vous exécutez ce fichier avec Node[^babel], vous obtiendrez ce résultat :

[^babel]: Avec l'aide de Babel par exemple.

```
9 2 10
9 2 10
```

## Conclusion

Voilà, avec ces quelques lignes de code je suis en mesure d'apporter la
prédictabilité et la répétabilité à n'importe quel code utilisant des nombres
aléatoires. Dans un prochain article, je montrerai les choix de _level-design_
que j'ai faits pour construire ma carte.
