---
title: 'Récursion infinie en javascript'
intro: >-
  Seconde partie de ma série d'articles sur les _autoclickers_ dans laquelle on
  implémente une boucle infinie avec des fonctions récursives.
taxonomy:
    category: Dev
    tag:
        - javascript
        - incremental-games
        - intelligence-artificielle
uscripts:
  - 'loop-next.js'
---


Dans le [premier article](../incremental-games-autoclicker) de
cette série nous avons fait un prototype de boucle qui répétait une simple
action à l'infini.

Je suis en train de mettre en place un autoclicker pour un jeu qui offre
beaucoup plus de possibilités de gameplay (plein de boutons à cliquer !). Et
l'état du jeu et l'interface doivent être mis à jour après chaque action du
joueur, ne serait-ce que pour avoir un rafraîchissement correct de l'interface.

Je souhaite aussi pouvoir contrôler le temps d'attente entre les différents
clics. Si je dois cliquer cent fois sur un même bouton, je voudrais que ça aille
vite. Par contre, quand je change d'onglet dans le jeu, je veux patienter un peu
plus avant d'effectuer autre chose, afin que l'oeil humain (le mien en tout cas)
puisse suivre ce qu'il se passe.

Enfin, quand il n'y a rien à faire, je veux attendre une pleine seconde avant de
vérifier à nouveau qu'on peut faire quelque chose. Cela permet au script de ne
pas tourner tout le temps et de respecter mon processeur. Il fait déjà assez
chaud chez moi !

En bref, un genre d'intelligence artificielle à l'ancienne qu'il faut coder
entièrement à la main (on est loin du _deep learning_) mais qui doit en plus
stopper son exécution continuellement pour libérer le _thread_ du navigateur, vu
qu'on est en Javascript.

J'ai donc mis en place un système de boucle infinie plus avancé permettant
d'appeler différentes fonctions au sein de la boucle, ou d'effectuer des « sous-
boucles » sur un aspect précis du jeu (cliquer plusieurs fois sur un certain
bouton) avant de revenir dans la boucle principale (cliquer sur différents
boutons).

Pour comprendre cet article il faut connaître le fonctionnement de `setTimeout`
et comprendre l'ordre d'exécution du code quand on l'utilise. Pour résumer, le
code dans la fonction passée à `setTimeout` est exécuté après l'appel à
`setTimeout` et ce qui suit, et dans une autre pile d'appel. Exemple :

```javascript
console.log('1')
setTimeout(function(){
  console.log('3')
}, 1)
console.log('2')

// 1
// 2
// 3
```

## Looper Next

Le principe de base est simple : Dans notre boucle, on exécute une certaine
fonction. Cette fonction effectue les actions qu'elle souhaite (simuler des
clics sur des boutons, donc), puis indique la prochaine fonction à exécuter lors
de la prochaine itération. Et ainsi de suite.

### Structure de données : itération de boucle

Pour commencer, on définit une structure de données décrivant une itération.
Cela se fait grâce à une fonction `next` ("quoi faire ensuite"):

```javascript
function next(time, fn /*, ...args */) {
  var args
  if (typeof time === 'function') {
    args = Array.prototype.slice.call(arguments, 1)
    fn = time
    time = 100
  } else {
    args = Array.prototype.slice.call(arguments, 2)
  }
  return {
    time: time,
    fn: fn,
    args: args
  }
}
```

La structure créée contient les propriétés suivantes :

* `time` : indique le timeout qui sera passé à `setTimeout` ;
* `fn` : contient la fonction à exécuter ;
* `args` : contient un tableau d'arguments avec lesquels la fonction sera appelée.

La fonction s'appelle de différentes manières, `time` et les arguments
supplémentaires  étant optionnels :

* `next(myFn)` : appellera `myFn` avec le timeout par défaut ;
* `next(10, myFn)` : appellera `myFn` avec un timeout de 10 millisecondes ;
* `next(myFn, 'hello', 'world')` : appellera `myFn` avec le timeout par défaut et deux arguments, `'hello'` et `'world'` ;
* `next(10, myFn, 'hello', 'world')` : idem avec un timeout de 10 millisecondes ;

À noter :

* J'ai volontairement omis la gestion du contexte (`this`) pour l'appel de la
  fonction. On peut le rajouter facilement si nécessaire.
* Le timeout est placé avant la fonction pour ne pas pouvoir le confondre avec
  un argument de la _callback_.
* Dans mon implémentation, le timeout par défaut est `100`, afin de mieux voir
  ce que fait l'autoclicker. Le code s'exécutera beaucoup plus vite s'il est
  défini à `1`.


### Itérateur

La structure de données étant définie, on peut donc effectuer des actions avec.
On va se contenter d'une seule action : exécuter la fonction dans un
`setTimeout`.

```javascript
function looper(onError) {
  return function loop(step) {
    setTimeout(function() {
      var nextStep
      try {
        nextStep = step.fn.apply(void 0, step.args)
      } catch (e) {
        nextStep = onError(e)
      }
      if (nextStep) {
        loop(nextStep)
      } else {
        console.log('LOOP END')
      }
    }, step.time)
  }
}
```

La fonction `looper` permet de définir la fonction `loop` en passant le
gestionnaire d'erreurs `onError`.

La fonction `loop` prend un argument, `step`, qui est notre structure de données
renvoyée par `next`. Elle lance `setTimeout` avec le timeout souhaité. Dans la
fonction de rappel de `setTimeout` (donc au début de l'itération suivante !),
elle exécute la fonction souhaitée avec les bons arguments.

L'exécution se passe au sein d'un bloc `try/catch` afin de ne jamais arrêter la
boucle infinie en cas d'erreurs. Personnellement, pendant le développement,
j'enlève ce bloc afin de pouvoir corriger plus simplement les erreurs.

La fonction exécutée doit également renvoyer une structure de données décrivant
l'itération suivante (tout comme la fonction `onError`) afin de pouvoir lancer
l'itération suivante.

Enfin, `loop` est appelée récursivement avec cette prochaine étape.

### Exemple de boucle

Voici un exemple de compteur qui compte jusqu'à 10 puis effectue une pause, à
l'infini :

```javascript
function printCount(n) {
  if (n > 10) {
    return next(pause)
  } else {
    console.log('n = %s', n)
    return next(printCount, n + 1)
  }
}

function pause() {
  console.log('Pause !')
  return next(1000, printCount, 1)
}

var loop = looper(function onError(err){
  console.error(err)
  throw err
})

loop(next(printCount, 1))
```

Il est important de remarquer que chaque « état » de notre boucle, c'est à dire
chaque fonction que l'on passe à `next`, **doit** retourner une itération pour
que la boucle continue.

On pourrait directement appeler `loop(next(...))` à la fin de nos fonctions.
D'ailleurs, on créerait une fonction `loopNext` à la place. Mais en
s'obligeant à utiliser `return`, on s'assure de ne pas pouvoir lancer plusieurs
boucles en parallèle en appelant `loopNext` plusieurs fois accidentellement au
sein d'une même fonction.

De plus, utiliser des _data structures_ est plus intéressant puisqu'on peut les
manipuler de différentes manières au lieu d'appeler directement le code qui
exécute notre itération suivante. Par exemple, on peut générer une liste de ces
structures à partir d'un tableau contenant des tâches à exécuter. Le timeout
traduit l'urgence de la tâche. Et on n'exécute que la tâche la plus urgente
avant de recommencer. Bref, plein de choses sont possibles en la matière.

### Gestion des erreurs

Je ne m'étendrai pas sur la gestion des erreurs car elle dépend vraiment de ce
qu'on fait dans notre boucle.

En général, il s'agira de revenir à un état stable et de recommencer. Pour mon
autoclicker je recharge les données du jeu et je recommence à zéro après avoir
affiché l'erreur dans la console.

La seule règle à respecter est de retourner des données avec `return next(…)`,
comme dans n'importe quelle autre fonction de boucle.

## Conclusion

Nous avons défini une structure de données décrivant « la prochaine fonction à
appeler pour l'exécution de notre autoclicker ». Nous avons ensuite créé un
algorithme pour exploiter cette structure de données, en mettant en place un
système de récursion infinie grâce à `setTimeout` dans la fonction `loop`.

Une fois cette étape réalisée, il n'y a plus à se préoccuper de cet aspect là du
problème. Il suffit juste de se souvenir d'utiliser `return next(…)` pour
poursuivre l'exécution de l'autoclicker et on peut utiliser une récursion
infinie qui s'exécute en parallèle du jeu.

C'est ce que je montrerai en proposant prochainement l'autoclicker que je
développe en ce moment. À bientôt, donc !

