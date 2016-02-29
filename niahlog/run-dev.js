var assets = require('metalsmith-assets')
var collections = require('metalsmith-collections')
var define = require('metalsmith-define')
var inPlace = require('metalsmith-in-place')
var layouts = require('metalsmith-layouts')
var markdown = require('metalsmith-markdownit')
var metalsmith = require('metalsmith')
var permalinks = require('metalsmith-permalinks')
var prism = require('metalsmith-prism')
var textReplace = require('metalsmith-text-replace')
var serve = require('metalsmith-serve')
var slug = require('metalsmith-slug')
var urls = require('metalsmith-urls')
var watch = require('metalsmith-watch')

var IS_DEV = true

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
            "${source}/**/*": true,
            "layouts/**/*": "**/*.md",
            "assets/**/*": "**/*.md",
        },
        livereload: IS_DEV,
    })
}

var registry = function(prop) {
    if (arguments.length === 0) {
        prop = 'ref'
    }

    return function (files, metalsmith, done) {
        var meta = metalsmith.metadata()
        var file, ref, registry = {}
        Object.keys(files).forEach(function(k){
            file = files[k]
            ref = file[prop]
            console.log(file.title, file.collection)
            if (ref) {
                registry[ref] = file
            }
        })
        meta.refs = registry
        done()
    }
}


metalsmith(__dirname)
    .use(define({
        IS_DEV: IS_DEV, // @todo use dotenv
    }))
    .source('src')
    .use(collections({
        articles: {
            pattern: 'articles/**/*.md',
            sortBy: 'date',
            reverse: true,
        },
        'story_elixir_game': {
            pattern: 'articles/story-elixir-game/*.md',
            sortBy: 'date',
            reverse: true,
            refer: false,
        },
        pages: {
            pattern: 'pages/**/*.md',
        },
    }))
    .use(serve()).use(watcher())
    .use(registry())
    .use(slug({
        patterns: ['*.md'],
    }))
    .use(inPlace({
        engine: 'swig'
    }))
    .use(md)
    .use(textReplace({
        "**/**": [
            // bootstrap tables classes
            {find:/<table>/g, replace:'<table class="table table-bordered">'},
        ]
    }))
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
        relative: true,
    }))
    .use(urls())
    .use(prism())
    .use(layouts({
        engine: 'swig'
    }))
    .use(assets({
        source: './assets',
        destination: './lib'
    }))
    .destination('build')
    .build(function(err) {
        if (err) throw err
    })
