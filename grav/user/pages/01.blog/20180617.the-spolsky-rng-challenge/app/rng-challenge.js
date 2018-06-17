// Hello.

import * as d3Selection from 'd3-selection'
import * as d3Scale from 'd3-scale'
import * as d3Array from 'd3-array'

var d3 = Object.assign({},
  d3Selection,
  d3Scale,
  d3Array
)

require('./rng-challenge.css')

function configure(container, opts) {
  var rect = container.getBoundingClientRect()
  opts = opts || {}
  opts.ratio = opts.ratio || (Math.round(28/9*100)/100)
  var margin = opts.margin || {top: 0, right: 0, bottom: 0, left: 0}
  var config = {container: container}
  var width = (rect.width || 300)
  config.margin = margin
  config.width = width - margin.left - margin.right
  config.height = Math.round(width / opts.ratio) - margin.top - margin.bottom
  return config
}

function create(config) {
  var margin = config.margin
  var width = config.width
  var height = config.height
  var container = d3.select(config.container)
  var svg = container.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  var paper = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var messages = container.append('div')
  return {svg: svg, paper: paper, messages: messages}
}

var container = document.getElementById('rng-challenge-app')
var config = configure(container)
var DOMEls = create(config)
var svg = DOMEls.svg
var paper = DOMEls.paper
var messagesWrap = DOMEls.messages

function renderError(err) {
  messagesWrap.selectAll('p.error').data([err]).enter()
    .append('p')
    .classed('has-text-danger', true)
    .text(function(err) { return err.message })
}

function clearErrors() {
  messagesWrap.selectAll('p').data([]).exit().remove()
}

function renderUpdate(results) {
  var data
  clearErrors()
  if (results.error) {
    data = []
    renderError(results.error)
  } else {
    data = results.data
  }
  console.log('render data', data)
  data = map(data, castTo0)
  var sum = d3.sum(data)
  var max = d3.max(data)
  var xScale = d3.scaleLinear()
    .range([0, config.width])
    .domain([0, max])
  var barCount = data.length
  var barSpacing = 2
  var barHeight = Math.floor(config.height / barCount)

  var bar = paper.selectAll('g.bar').data(data)

  var displayCount = function(d, i) {
    var percent = Math.round(d / sum * 10000)/100
    return percent + ' %' // + ' (' + d + ')'
  }
  var displayFace = function(d, i) { return i /*+ ': ' + d*/ }

  bar.exit()
    .remove()
  var updated = bar//.transition()
  updated
    .attr('transform', function(d, i){ return 'translate(0,' + (i * barHeight) + ')' })
  updated.select('rect')
    .attr('width', function(d) { return xScale(d || 0) })
    .attr('height', barHeight - barSpacing)
  updated.select('text.face')
    .attr('y', barHeight / 2)
    .text(displayFace)
  updated.select('text.count')
    .attr('x', function (d) { return xScale(d) - 10})
    .attr('y', barHeight / 2)
    .text(displayCount)
  var barEnter = bar.enter().append('g')
    .attr('class', 'bar')
    .attr('transform', function(d, i){ return 'translate(0,' + (i * barHeight) + ')' })

  barEnter.append('rect')
    .attr('height', barHeight - barSpacing)
    .attr('width', function(d) { return xScale(d || 0) })
  barEnter.append('text')
    .attr('class', 'count')
    .attr('x', function (d) { return xScale(d) - 10})
    .attr('y', barHeight / 2)
    .attr('dy', '.35em')
    .text(displayCount)
  barEnter.append('text')
    .attr('class', 'face')
    .attr('x', 10)
    .attr('y', barHeight / 2)
    .attr('dy', '.35em')
    .text(displayFace)
}

function rand5() {
  return Math.floor(Math.random() * 5)
}


if (false) {
  // do not ship this code
  var randBit = function() {
    var found = rand5()
    if (found > 1) return randBit()
    return found
  }

  // Ma solution
  var rand7 = function() {
    switch (rand5()) {
      case 0: return randBit()
      case 1: return 2 + randBit()
      case 2: return 4 + randBit()
      case 3: if (randBit()) return 6
    }
    return rand7()
  }
}

function map(a, f) {
  // a dummy function that map everything because Array.map does not
  // map empty elements
  var i, len = a.length, a2 = []
  for (i = 0; i < len; i += 1)
    a2.push(f(a[i]))
  return a2
}

function castTo0(n) {
  return n >> 0
}

function createData(randomGen) {
  var data = []
  var iterations = 1e6, i
  for (i = 0; i < iterations; i++) {
    // Here we must floor for our simple algorithm to work
    var rn = randomGen()
    data[rn] = (data[rn] || 0) + 1
  }
  return {error: false, data: data}
}

function checkRandomGen(randomGen) {
  // We draw 100 numbers to ensure that they are all positive integers
  var i = 100
  while (i--) {
    var n = randomGen()
    if(n < 0) {
      throw new Error("Random numbers must be positive integers");
    }
    if(Math.floor(n) !== n) {
      throw new Error("Random numbers must be integers");
    }
  }
}

var editor = ace.edit('rng-challenge-editor')
editor.setTheme('ace/theme/monokai')
editor.session.setMode('ace/mode/javascript')

function update() {
  var javascriptContent = editor.getValue()
  eval(javascriptContent)
  try {
    console.log('window.rand7Factory : ', window.rand7Factory)
    var randomGen = window.rand7Factory(rand5)
    checkRandomGen(randomGen)
    renderUpdate(createData(randomGen))
  } catch (e) {
    console.error(e)
    renderUpdate({error: e})
  }
}

update()

// define a handler
function xor(a, b) {
  return a ? !b : b
}
function hotkeys(e) {
  if (e.keyCode === 83) {
    // S
    if (xor(e.ctrlKey, e.shiftKey)) {
      update()
      e.stopPropagation()
      e.preventDefault()
    }
  }
}
document.addEventListener('keydown', hotkeys, false);

paper.on('click', update)
