var assets = require('metalsmith-assets')
var collections = require('metalsmith-collections')
var define = require('metalsmith-define')
var dotenv = require('dotenv')
var filter = require('metalsmith-filter')
var filterDrafts = require('metalsmith-drafts')
// var include = require('metalsmith-include-content')
console.info('metalsmith-include-content unused')
var inPlace = require('metalsmith-in-place')
var layouts = require('metalsmith-layouts')
var markdown = require('metalsmith-markdownit')
var metalsmith = require('metalsmith')
var moment = require('moment')
var permalinks = require('metalsmith-permalinks')
var prism = require('metalsmith-prism')
var rimraf = require('rimraf')
var serve = require('metalsmith-serve')
var slug = require('metalsmith-slug')
var swig = require('swig')
var textReplace = require('metalsmith-text-replace')
var watch = require('metalsmith-watch')

// -- Config ------------------------------------------------------------------

dotenv.load()

var IS_DEV = ~process.argv.indexOf('--watch')
var destination = IS_DEV
    ? 'build'
    : (process.env.BUILD_PROD_DIR)
console.log('Building into %s', destination)
// On windows the paths are something\\like\\this.
// Include plugins are not cross platform.

if (~process.argv.indexOf('--clean')) {
    console.log('cleaning target directory %s', destination)
    rimraf.sync(destination, {disableGlob: true})
}

// -- Plugins -----------------------------------------------------------------

function unixpath(path) {
    return path.replace(/\\+/g, '/')
}

function winpath(path) {
    return path.replace(/\//g, '\\')
}

swig.setFilter('ospath', function(input, idx) {
    var path = unixpath(input)
    var isWindows = /^win/.test(process.platform)
    return isWindows
        ? winpath(input)
        : unixpath(input)
})

swig.setFilter('frdate', function(input, lang) {
    var m = moment(input)
    if (lang) m.locale(lang)
    return m.format('dddd Do MMMM YYYY')
})

function urlPlugin(opts) {
    var opts = opts || {}
    var basePath = opts.basePath || ''
    // ensure trailing slash
    if (basePath.substr(-1) !== '/') {
        basePath += '/'
    }

    return function(files, metalsmith, done){
        setImmediate(done);
        Object.keys(files).forEach(function(path){
            var url = basePath + unixpath(path)
            console.log('set url = %s', url)
            files[path].url = url
        })
    }
}


// -- Build Process -----------------------------------------------------------

var md = markdown({
    html: true,
    langPrefix: 'language-',
    typographer: true,
    quotes: ['«\xA0', '\xA0»', '‘', '’'],
})
md.parser.use(require('markdown-it-footnote'))

var watcher = function() {
    return watch({
        paths: {
            "${source}/**/*": "**/*",
            "layouts/**/*": "**/*",
            "assets/**/*": "**/*",
        },
        livereload: IS_DEV ? 35729 : false,
    })
}

console.log('Building ...')

var stream = metalsmith(__dirname)
    .use(define({
        IS_DEV: IS_DEV, // @todo use dotenv
        moment: moment,
        lang: 'fr',
    }))
    .source('src')

if (~process.argv.indexOf('--no-drafts')) {
    stream = stream.use(filterDrafts())
}

stream = stream.use(collections({
        articles: {
            pattern: 'articles/**/*.md',
            sortBy: 'date',
            reverse: true,
        },
        'story_elixir_game': {
            pattern: 'articles/story-elixir-game/*.md',
            sortBy: 'date',
            reverse: false, // TOC shows in chronologic order
            refer: false,
        },
        pages: {
            pattern: 'pages/**/*.md',
        },
    }))


if (~process.argv.indexOf('--serve')) {
    stream = stream.use(serve())
}

if (~process.argv.indexOf('--watch')) {
    stream = stream.use(watcher())
}


stream = stream.use(slug({
        patterns: ['*.md'],
    }))
    .use(inPlace({
        engine: 'swig'
    }))
    // .use(include({
    //     pattern: '^includeSource (.*)'
    // }))
    .use(md)
    .use(permalinks({
        linksets: [
            // Articles
            {
                match: {
                    collection: 'articles'
                },
                // Use the slug here
                pattern: 'articles/:date/:slug'
            },
            // Pages
            {
                match: {
                    collection: 'pages'
                },
                pattern: ':title'
            }
        ],
        relative: false,
    }))
    .use(urlPlugin())
    .use(textReplace({
        "**/**": [
            // bootstrap tables classes
            {find:/<table>/g, replace:'<table class="table table-bordered">'},
        ]
    }))
    .use((function(opts) {
        var consolidate = require('consolidate')
        opts = opts || {}
        var dir = opts.directory || 'layouts'
        var layout = opts.layout || 'TOC.html'
        var extend = require('extend')
        var engine = opts.engine
        return function(files, metalsmith, done) {
            var tocTemplate = metalsmith.path(dir, layout)
            var render = consolidate[engine]
            var metadata = metalsmith.metadata()
            Object.keys(files).forEach(function(path){
                var file = files[path]
                var contents = file.contents.toString()
                // matchin HTML generated by MD is ugly, I know that ! But all
                // the plugins that do some stuf match heavily on the extensions
                // so I can't set permalinks and URLs *before* transforming
                // md->html.
                // 
                // 
                
                use https://www.npmjs.com/package/async-replace

                var matchToc = /<p>includeTOC (.+)<\/p>/gi
                var withTocs = contents.replace(matchToc, function(fullMatch, collectionName) {
                    var collections = metalsmith.metadata().collections
                    console.log('looking for collection %s', collectionName)
                    var coll = collections[collectionName]
                    if (coll === void 0) {
                        return ['<p>Collection', collectionName, 'not found for includeTOC, available collections are </p>'].join(' ') // just erase the marker
                    }
                    var tplData = extend({}, metadata, {current: file, toc_collection: coll})
                    console.log('including %s\'s TOC', collectionName)
                    console.log(Object.keys(metalsmith.metadata().collections))
                    // Here we HOPE that all is sync                    
                    render(tocTemplate, tplData).then(function(content){
                        console.log('TOC content : %s', content)
                    })
                    .catch(done)
                })
                file.contents = new Buffer(withTocs)
            })
            done()
        }
    }({
        engine: 'swig',
        layout: 'TOC.swig'
    })))
    .use(prism())
    .use(layouts({
        engine: 'swig'
    }))
    .use(assets({
        source: './assets',
        destination: './lib'
    }))
    .use(filter(['**/*.html', 'lib/**/*']))


stream = stream.destination(destination)
    .build(function(err) {
        if (err) throw err
    })
