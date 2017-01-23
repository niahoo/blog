# DocPad Configuration File
# http://docpad.org/docs/config

# Define the DocPad Configuration
docpadConfig = {
    plugins:
        asciidoc:
            enableExtensions: false
    templateData:
        site:
            title: "My Website"
    collections:
        pages: ->
            @getCollection('html').findAll({isPage:true}).on('add', (page) ->
                page.setMetaDefaults({layout: 'default'})
            )
        posts: ->
            @getCollection('html').findAll(
                {$and: {relativeDirPath: 'posts', draft: {$ne: true}}},
                [{date: -1}]
            ).on('add', (post) ->
                post.setMetaDefaults({layout: 'default'})
            )

    outPath: 'out/_other'

    environments:
        static:
            outPath: 'out/static'
        development:
            outPath: 'out/dev'
            OFF_collections:
                posts: ->
                    @getCollection('html').findAll(
                        {relativeDirPath: 'posts'},
                        [{date: -1}]
                    ).on('add', (post) ->
                        post.setMetaDefaults({layout: 'default'})
                    )
}
# Export the DocPad Configuration
module.exports = docpadConfig
