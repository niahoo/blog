var assets = require('metalsmith-assets')
var collections = require('metalsmith-collections')
var define = require('metalsmith-define')
var inPlace = require('metalsmith-in-place')
var layouts = require('metalsmith-layouts')
var livereload = true
var markdown = require('metalsmith-markdown')
var metalsmith = require('metalsmith')
var permalinks = require('metalsmith-permalinks')
var prism = require('metalsmith-prism')
var serve = require('metalsmith-serve')
var slug = require('metalsmith-slug')
var urls = require('metalsmith-urls')
var watch = require('metalsmith-watch')

var watcher = function() {
    return watch({
        paths: {
            "${source}/**/*": true,
            "layouts/**/*": "**/*.md",
        },
        livereload: livereload,
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
        livereload: livereload, // @todo use dotenv
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
            refer: false,
        },
        pages: {
            pattern: 'pages/**/*.md',
        },
    }))
    // .use(serve()).use(watcher())
    .use(registry())
    .use(slug({
        patterns: ['*.md'],
    }))
    .use(inPlace({
        engine: 'swig'
    }))
    .use(markdown({
        gfm: true,
        tables: true,
        langPrefix: 'language-',
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
