'use strict'

var dotenv = require('dotenv')
var prompt = require('prompt')
var scp2 = require('scp2')
var colors = require("colors/safe")

var dotenvLoaded = dotenv.load()
prompt.start()


prompt.message = colors.green('scp')
prompt.delimiter = colors.green(' <- ')

var buildDir = process.env.BUILD_PROD_DIR + '/'
var remoteDir = process.env.REMOTE_PROD_DIR + '/'
var remoteHost = process.env.DEPLOY_HOST

console.log("Enter username and password")

var promptSchema = {
    properties: {
        username: {
            required: true,
            name: "Host user name",
        },
        password: {
            required: true,
            hidden: true,
            name: "Password",
        },
    }
}

prompt.get(promptSchema, function(err, result){
    console.log("Local dir   %s", buildDir)
    console.log("Remote dir  %s", remoteDir)
    console.log("Server      %s", remoteHost)
    console.log("As          %s", result.username)
    var client = new scp2.Client()
    var onError = function(err){
        if (err) {
            console.log("scp failed", err)
        } else {
            console.log("Done.")
        }
    }
    client.on('ready', function(){ console.log('client ready') })
    client.on('end', function(){ console.log('client end') })
    client.on('close', function(){ console.log('client close') })
    client.on('mkdir', function(dir){ console.log('client mkdir %s', dir) })
    client.on('transfer', function(buffer, uploaded, total){
        console.log('client transfer %s / %s', uploaded, total)
    })
    scp2.scp(buildDir, {
        host: remoteHost,
        username: result.username,
        password: result.password,
        path: remoteDir
    }, client, onError)
})
