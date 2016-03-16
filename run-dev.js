var assets = require('metalsmith-assets')
var codeHighlight = require('metalsmith-code-highlight')
var collections = require('metalsmith-collections')
var define = require('metalsmith-define')
var dotenv = require('dotenv')
var filter = require('metalsmith-filter')
var filterDrafts = require('metalsmith-drafts')
var inPlace = require('metalsmith-in-place')
var layouts = require('metalsmith-layouts')
var markdown = require('metalsmith-markdownit')
var metalsmith = require('metalsmith')
var moment = require('moment')
var permalinks = require('metalsmith-permalinks')
var rimraf = require('rimraf')
var serve = require('metalsmith-serve')
var slug = require('metalsmith-slug')
var stylus = require('metalsmith-stylus')
var swig = require('swig')
var textReplace = require('metalsmith-text-replace')
var url = require('metalsmith-url')
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
swig.setFilter('frdate_short', function(input, lang) {
    var m = moment(input)
    if (lang) m.locale(lang)
    return m.format('Do MMMM YYYY')
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
            url = url.replace(/\/index\.html?$/, '/')
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
md.parser.use(require('markdown-it-anchor'), {
    slugify: require('slug'),
    permalink: true,
    permalinkClass: 'headref',
    level: 2, // min h2, not h1
    // permalinkSymbol: '§',
})

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
    .use(codeHighlight({
        // languages: ['elixir', 'erlang', 'javascript', 'php'],
        languages: ['elixir', 'erlang', 'javascript', 'php'],
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
                pattern: ':pageurl'
            }
        ],
        relative: false,
    }))
    .use(urlPlugin())
    .use(textReplace({
        "**/**": [
            // bootstrap tables classes
            {find:/<table>/g, replace:'<table class="table table-bordered">'},
            {find:/— (.+)<\/p>\n<\/blockquote>/g, replace:function(_match, author){
                return '</p><footer><cite>' + author + '</cite></footer></blockquote>'
            }},
        ]
    }))
    // Set default toc titles
    .use(function(files, metalsmith, done){
        setImmediate(done)
        Object.keys(files).forEach(function(path){
            var f = files[path]
            if (f.toc_title === void 0) {
                f.toc_title = f.title
            }
        })
    })
    .use((function(opts) {
        var asyncReplace = require('async-replace')
        var consolidate = require('consolidate')
        opts = opts || {}
        var dir = opts.directory || 'layouts'
        var layout = opts.layout || 'TOC.html'
        var extend = require('extend')
        var engine = opts.engine
        var render = consolidate[engine]
        // matchin HTML generated by MD is ugly, I know that ! But all the
        // plugins that do some stuff match heavily on the extensions (.md,
        // .html, etc.) so I can't set permalinks and URLs *before* transforming
        // md->html.
        return function(files, metalsmith, metalsmithDone) {
            var tocTemplate = metalsmith.path(dir, layout)
            // Defining a replacer that replace matches of tocpattern with
            // the toc template rendered with the appropriate collection
            var tocpattern = /<p>includeTOC (.+)<\/p>/gi
            var metadata = metalsmith.metadata()
            function replacer(file) {
                return function (match, collectionName, offset, string, done) {
                    var err
                    var collections = metadata.collections
                    var coll = collections[collectionName]

                    if (coll === void 0) {
                        return done(err = null, ['<p>Collection', collectionName, 'not found for includeTOC, available collections are </p>'].join(' ')) // just erase the marker
                    }

                    var tplData = extend({}, metadata, {current: file, toc_collection: coll})
                    // Here we HOPE that all is sync
                    render(tocTemplate, tplData).then(function(content){
                        done(err = null, content)
                    })
                    .catch(done)
                }
            }

            // With the replacer, we use asyncReplace (template loading is
            // async) and return a promise for each file. Then we catch all
            // the promises with Promise.all
            Promise.all(
                Object.keys(files).map(function(path){
                    var file = files[path]
                    var contents = file.contents.toString()
                    return new Promise(function(resolve, reject){
                        asyncReplace(contents, tocpattern, replacer(file), function(err, newContents){
                            if (err) reject(err)
                            else {
                                // updating the file object
                                file.contents = new Buffer(newContents)
                                // so nothing to return
                                resolve('ok !')
                            }
                        })
                    })
                })
            ).then(function(oks){
                metalsmithDone()
            })
            .catch(metalsmithDone)
        }
    }({
        engine: 'swig',
        layout: 'TOC.swig'
    })))
    .use(layouts({
        engine: 'swig'
    }))
    .use(assets({
        source: './assets',
        destination: './lib'
    }))
    .use(stylus({
        compress: !IS_DEV
    }))
    .use(filter(['**/*.html', 'lib/**/*']))


stream = stream.destination(destination)
    .build(function(err) {
        if (err) throw err
    })
