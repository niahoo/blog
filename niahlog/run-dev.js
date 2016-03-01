var assets = require('metalsmith-assets')
var collections = require('metalsmith-collections')
var define = require('metalsmith-define')
var filter = require('metalsmith-filter')
var include = require('metalsmith-include-content')
var inPlace = require('metalsmith-in-place')
var layouts = require('metalsmith-layouts')
var markdown = require('metalsmith-markdownit')
var metalsmith = require('metalsmith')
var moment = require('moment')
var permalinks = require('metalsmith-permalinks')
var prism = require('metalsmith-prism')
var serve = require('metalsmith-serve')
var slug = require('metalsmith-slug')
var swig = require('swig')
var textReplace = require('metalsmith-text-replace')
var urls = require('metalsmith-urls')
var watch = require('metalsmith-watch')

var IS_DEV = true

// On windows the paths are something\\like\\this.
// Include plugins are not cross platform.

swig.setFilter('ospath', function(input, idx) {
    var unixPath = input.replace('/\\+/g', '/')
    var isWindows = /^win/.test(process.platform)
    return isWindows
        ? unixPath.replace(/\//g,'\\')
        : unixPath
})

swig.setFilter('frdate', function(input, lang) {
    var m = moment(input)
    if (lang) m.locale(lang)
    return m.format('dddd Do MMMM YYYY')
})

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
        livereload: IS_DEV,
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


if (~process.argv.indexOf('--serve')) {
    stream = stream.use(serve())
}

if (~process.argv.indexOf('--watch')) {
    stream = stream.use(watcher())
}

    
stream.use(slug({
        patterns: ['*.md'],
    }))
    .use(inPlace({
        engine: 'swig'
    }))
    .use(include({
        pattern: '^includeSource (.*)'
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
    .use(filter(['**/*.html', 'lib/**/*']))
    .destination('build')
    .build(function(err) {
        if (err) throw err
    })
