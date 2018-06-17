---
title: 'The Spolsky Rng Challenge'
intro: >-
  Un petit défi de code lancé par Joel Spolsky !
taxonomy:
    category: Dev
    tag:
        - javascript
uscripts:
  - 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.3.3/ace.js'
  - 'dist/bundle.js'
---

Dans une vidéo youtube montrant les pratiques en termes de recrutement des
développeurs à Fog Creek Software (connue notamment pour Stack Overflow), on
peut voir Joel Spolsky (le boss) faire passer un entretien d'embauche.

Il donne un petit test de code, et je me suis demandé si j'étais capable de
trouver la réponse en moins de 5 minutes, comme lors d'un vrai entretien.

La question est simple : À l'aide d'une fonction `rand5()` qui renvoie un nombre
entier aléatoire entre `0` et `4` inclus, écrire une fonction `rand7()` qui
renvoie un nombre entier aléatoire entre `0` et `6` inclus.

La fonction doit être équilibrée, c'est à dire que chaque nombre doit avoir
autant de chances de sortir que les autres !

La vidéo contient quelques indices, mais je n'ai personellement pas réussi en
moins de 5 minutes.

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/qXZ75Ds5vOs?rel=0&amp;start=1620" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

## Au boulot !

Voici un petit outil si vous souhaitez relever le défi. Il se compose d'un
graphique et d'un éditeur de code.

Vous devez créer une fonction `rand7Factory` dans `window` qui accepte la
fonction `rand5` et retourne le résultat de la solution, c'est à dire la
fonction `rand7`.

Le graphique donne une représentation des chances de tirage de chaque nombre.

Ici j'ai volontairement mis une fausse solution au chargment. Comme vous pouvez
le voir, on a effectivement des nombres de `0` à `6` mais dont la répartition
n'est pas équilibrée.

Pour recharger le graphique avec le nouveau code, <kbd>Ctrl+S</kbd>, ou cliquez
sur le graphique.

<div id="rng-challenge-app"></div>
<div id="rng-challenge-editor">
window.rand7Factory = function(rand5){
    return function() {
        // Ici, il faut retourner un nombre entier positif aléatoire x tel que :
        //     0 ≤ x &lt; 7.
        // Il est interdit d'utiliser Math.random() et il est nécessaire d'utiliser
        // rand5(), qui renvoie un nombre aléatoire tel que :
        //     0 ≤ x &lt; 5 
        return Math.min(rand5() + rand5(), 6); 
    } 
}
</div>
