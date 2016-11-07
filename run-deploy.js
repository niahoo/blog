'use strict'

var dotenv = require('dotenv')
var prompt = require('prompt')
var scp2 = require('scp2')

dotenv.load()
prompt.start()

var buildDir = process.env.BUILD_PROD_DIR + '/'
var remoteDir = process.env.REMOTE_PROD_DIR + '/'
var remoteHost = process.env.DEPLOY_HOST
var promptSchema = {
    properties: {
        username: {
            required: true
        },
        password: {
            required: true,
            hidden: true,
        },
    }
}
prompt.get(promptSchema, function(err, result){
    console.log("Local dir   %s", buildDir)
    console.log("Remote dir  %s", remoteDir)
    console.log("Server      %s", remoteHost)
    console.log("As          %s", result.username)
    scp2.scp(buildDir, {
        host: remoteHost,
        username: result.username,
        password: result.password,
        path: remoteDir
    }, function(err){
        if (err) {
            console.log("scp failed", err)
        } else {
            console.log("Done.")
        }
    })
})
