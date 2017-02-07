'use strict'

var path = require('path')
var entities = require('entities')
var util = require('hexo-util')
var cheerio = require('cheerio')
var asciidoctor = require('asciidoctor.js')()
// var processor = asciidoctor.Asciidoctor(true)
var processor = asciidoctor
// var options = null
var sourceDir = path.resolve(__dirname, '../source')
var options = Opal.hash2(['safe'], {
  safe: 0,
  // base_dir: sourceDir // does not work :(
})

var highlightOpts = hexo.config.highlight

var cheerio_load_option = {
  decodeEntities: false
}

// var evilTags = require('./_evil-tags')(hexo)

function renderer(data, _renderOpts) {
  var html = processor.convert(data.text, options)
  var $ = cheerio.load(html, cheerio_load_option)

  $('.highlight code').each(function(index, elem) {
    highlightOpts.lang = elem.attribs['data-lang']
    var code = entities.decodeXML($(elem).text())
    var content = util.highlight(code, highlightOpts)
    $(elem).html(content)
  })

  return $.html()
    // .replace(/{/g, '&#123;')
    // .replace(/}/g, '&#125;')
}

hexo.extend.renderer.register('ad', 'html', renderer, true)
hexo.extend.renderer.register('adoc', 'html', renderer, true)
hexo.extend.renderer.register('asciidoc', 'html', renderer, true)
