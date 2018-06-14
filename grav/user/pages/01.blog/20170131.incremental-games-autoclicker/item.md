---
title: 'Créer un simple autoclicker pour un incremental game'
intro: >-
  La triche c'est mal m'voyez ? Mais voici quand même un petit script permettant
  de créer facilement des _autoclickers_ via la console du navigateur.
taxonomy:
    category: Dev
    tag:
        - javascript
        - incremental-games
uscripts:
  - 'incremental-games-autoclicker.js'
---


Cet article est destiné aux débutants, avec une recette simple : créer une
fonction de clic, puis la lancer autant de fois que voulu via la console. Vous
devez donc savoir ouvrir la console du navigateur et avoir des notions de base
d'algorithmie.

## Les incremental games

Vous connaissez sûrement le principe de _incremental games_, mais un petit
rappel ne coûte pas cher. (Sinon sautez directement au titre suivant !)

Il s'agît de jeux ou le but principal est d'« augmenter ». En général on
augmente un simple nombre comme une réserve d'argent, de ressources, mais il
faut parfois augmenter plusieurs types de ressources.

En général, le système de jeu se développe également au fil du jeu, en
augmentant le nombre d'éléments de l'interface ou d'actions possibles.

Voici quelques exemples que je trouve sympathiques :

- [Spaceplan](http://jhollands.co.uk/spaceplan/)
- [Clickpocalypse 2](http://minmaxia.com/c2/)
- [Trimps](https://trimps.github.io/)
- [Shark Game: Shark of Darkness](http://cirri.al/sharks/)
- [Candy box !](http://candies.aniwey.net/)
- [Swarm Simulator](https://swarmsim.github.io/)

Si vous lisez ceci, c'est que vous avez réussi à vous extirper de ces jeux,
bravo ! Moi ça me prend beaucoup trop de temps malheureusement.

## Les clickers

Les mécaniques d'un incremental ne sont pas toujours intéressantes. Celles de
Swarm Simulator sont très répétitives par exemple, la seule évolution consiste à
changer d'unité : passer de 1<sup>12</sup> à 1<sup>13</sup> par exemple. 
En contrepartie, ces jeux prennent peu de temps et continuent généralement
d'évoluer hors ligne, quand on ne s'en occupe pas.

Mais il y a une catégorie d'_incremental games_ pire que les autres : les
_clickers_. Dans un clicker, la mécanique principale consiste à cliquer sur un
bouton pour gagner des ressources ou faire évoluer un simple nombre. Or il ne
s'agît généralement pas d'un choix intéressant comme choisir une nouvelle
technologie à développer, ou bien installer plutôt un générateur d'oxygène
supplémentaire ou réparer le filtre à eau avec les maigres ressources disponible
dans notre station spatiale en ruine. Non, on clique pour ajouter `1` à notre
ressource.

De plus, ces jeux sont généralement lents, demandant de cliquer de très, très
nombreuses fois au même endroit. Un genre de musculation de l'index quoi.
Pauvres de vous si vous y jouez avec un _trackpad_ !

Pour ces jeux, aucune pitié, l'utilisation d'un autoclicker est o-bli-ga-toire
afin de profiter des maigres évolutions de gameplay et du scénario (s'il
existe).

Pour clicker à l'infini sur le même bouton, on va donc avoir besoin d'une
fonction javascript qui effectue le clic sur ce bouton, et d'une boucle infinie
qui répète cette fonction.

## Simuler un clic

Commençons par le clic. Il n'est pas toujours facile d'exécuter un évènement
javascript sur un élément du DOM, mais voici une méthode qui fonctionne dans de
nombreux jeux. Tout d'abord, il faut pouvoir sélectionner l'élément, par exemple
via `document.getElementById`. Ensuite, on peut directement appeler la fonction
`click` ou `onclick` de cet élément. Avec un peu de chances, l'une des deux
fonctionnera.

Voici un simple bouton sur lequel exécuter les tests.

<div style="position: sticky;top: 0;padding: .4em 0;background: white" class="level is-mobile">
  <div class="level-item">
    <button class="button is-small is-primary is-outlined" id="simple-click">Cliquez-moi</button>
  </div>
  <div class="level-item" style="flex-grow: 10">
    <label class="label is-small" for="simple-click" id="simple-click-count">
      0 clic !
    </label>
  </div>
</div>

<script>
(function(){
  var count = 0
  document.getElementById('simple-click').addEventListener('click', function(){
    document.getElementById('simple-click-count').innerHTML = (
      ++count + ' clic' + (count > 1 ? 's' : '') + ' !'
    )
  })
}())
</script>


La commande suivante permet d'exécuter un clic depuis la console javascript :

### Appel direct

```javascript
document.getElementById('simple-click').click()
```

### Créer un objet Event

Quand ni `click` ni `onclick` n'existent ou ne fonctionnent, il est possible de
créer directement un objet évènement et de le lancer sur le bouton :

```javascript
var evt = new Event('click', {
  bubbles: true,
  cancelable: true
})
document.getElementById('simple-click').dispatchEvent(evt)
```

### Appeler directement le handler

Enfin, il arrive également que certains jeux appellent une fonction directement
dans le code HTML :

````html
<button onclick="addResource()">Click !</button>
```
<script type="text/javascript">
  function addResource() {
    // escapé à cause du markdown qui me met du &agrave; :S
    console.log(decodeURIComponent("Voil%C3%A0%20!"))
  }
</script>

Dans ce cas, il est possible d'appeler directement la fonction `addResource`
depuis la console plutôt que d'utiliser le DOM.


## Cliquer en boucle

On sait maintenant simuler le clic. Reste à le faire dans une boucle

### Boucle synchrone

On peut se contenter d'une boucle `for`. La fonction `looper` permet de créer
une boucle répétant `n` fois notre fonction de clic :

```javascript
function looper(callback) {
  return function loop(n, i) {
    for (i = 0; i < n; i++) {
      callback(i)
    }
  }
}
```

Et voici comment on s'en sert :

```javascript
var loop = looper(function(n){
  document.getElementById('simple-click').click()
})

loop(10) // on lance la boucle 10 fois
```

J'ai choisi d'arranger le code dans ce sens (d'abord définir le comportement
puis indiquer le nombre d'itération à exécuter) parce que c'est la méthode que
je suis quand je m'amuse avec un incrémental game (mon gameplay perso étant
évidemment de le finir le plus vite possible via du code) : je définis ma boucle
puis je la lance 100 fois par exemple, afin de voir le résultat, puis je la
relance encore 500 fois, j'upgrade les éléments du jeu (achat de skills par
exemple), et je relance encore, etc.

Malheureusement, cette version synchrone pose un problème majeur : durant
l'exécution, le navigateur est « freezé », et l'exécution du script fait tourner
le processeur de votre PC (ou l'un de ses coeurs) à 100%. Le jeu ne répondra pas
à la souris ou au clavier et votre navigateur ne permettra pas de recharger ou
fermer l'onglet avant la fin de l'exécution (ou avant la fin du temps maximum
autorisé – qui est plutôt long).

Impossible donc de lancer une boucle 10 000 fois tout en continuant de jouer,
d'autant plus si le jeu exécute lui-même de nombreuses opérations lors d'un
unique clic.

### Boucle asynchrone

Voici une version asynchrone qui relègue chaque itération de la boucle à
l'itération suivante de l'_event loop_ du moteur Javascript. Le navigateur se
comportera normalement et la boucle agira comme une sorte de tâche de fond.

Vous pouvez essayer cette boucle infinie dans la console sans crainte. Pour
l'arrêter il suffit de recharger la page.

```javascript
looper.async = function(callback, timeout) {
  timeout = timeout || 1
  return function loop(n, i) {
    i = i || 0
    if (i < n){
      setTimeout(function(){
        callback(i)
        loop(n, i + 1)
      }, timeout)
    }
  }
}

var loop = looper.async(function(n){
  document.getElementById('simple-click').click()
})

// N'ayons pas peur et lançons la boucle
// au delà de l'infini :)
loop(Infinity + 1)
```

Le temps entre chaque itération sera beaucoup plus long, et ne pourra de toutes
façons pas être inférieur à
[4 millisecondes](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout#Reasons_for_delays_longer_than_specified).

Ce n'est généralement pas un problème, et en contrepartie on peut lancer la
boucle à l'infini (et au delà) ! Mais si le temps d'exécution est vraiment
important, la librairie [setImmediate](https://github.com/YuzuJS/setImmediate)
peut remplacer `setTimeout` pour accélérer les choses.

On peut plus simplement lancer une boucle synchrone un petit nombre de fois dans
la boucle asynchrone.

```javascript
var loop = looper(function() { 
  document.getElementById('simple-click').click() 
})

var asyncloop = looper.async(function(){
  loop(10)
})

asyncloop(5) // Effectue 50 clicks
```

### Pourquoi pas setInterval

`setInterval` permet de spécifier un temps entre deux itérations de la boucle.
Notre fonction `looper.async` permet de spécifier un temps entre la fin d'une
boucle et le début de la suivante. Cela nous offre plus de contrôle : en
laissant 1 par défaut, on exécute chaque boucle dès que la suivante est
terminée. Avec `setInterval`, on perd du temps entre deux boucles si celles-ci
s'exécutent plus rapidement que l'intervalle donnée. 

Mais si cela vous convient, après tout la méthode n'est pas mauvaise en soi !

## Conclusion

Voilà, vous savez cliquer en boucle depuis la console. Je vous sauve donc la vie
en vous permettant de finir ces jeux beaucoup plus rapidement que prévu, et de
passer à autre chose de plus intéressant !
