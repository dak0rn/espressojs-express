/**
 * espressojs-express - An espressojs connector for express
 * Usage example
 *
 * Copyright (c) 2015 Daniel Koch
 *
 * https://github.com/dak0rn/espressojs-express
 */

// Please install espressojs and express using npm
var Espresso = require('espressojs');
var express  = require('express');
var espressoexpress = require('espressojs-express');

// Create a new API
var api = new Espresso({
    port: '9000',           // Only change the port
    apiRoot: '/pub/api'     // and the API root
});

// Set a beautiful serializer function
api.setSerializer( function(req, res, api, value) {
    return JSON.stringify(value, null, 4);
});

// Define some resources
api.resource('/', function(request, response, api) {

    var url = api.linkTo(this);
    return { title: 'My fancy API', version: '1.0.0', message: 'hello, world', api: url };
});

// Here are cascading resources!
api.resource('/users', function(req, res, api) {

    // List of users with links to a related resource
    return [
        {
            name: 'John Locke',
            number: 4,

            // Get a hypermedia link to the resource named 'user' and replace
            // the URL placeholder ':number' with '4'
            url: api.linkTo({name:'user'}, {number: 4})
        },

        { name: 'Hugo Reyes', number: 8, url: api.linkTo({name:'user'}, {number: 8}) },
        { name: 'James Ford', number: 15, url: api.linkTo({name:'user'}, {number: 15}) },
        { name: 'Sayid Jarrah', number: 16, url: api.linkTo({name:'user'}, {number: 16}) },
        { name: 'Jack Shephard', number: 23, url: api.linkTo({name:'user'}, {number: 23}) },
        { name: 'Jin-Soo Kwon', number: 48, url: api.linkTo({name:'user'}, {number: 48}) }
    ];

});

api.resource('/users/:number', function(req, res, api, users) {
    var num = parseInt(req.params.number); // :number
    var o;

    for( var index in users )
        if( num === users[index].number ) {
            o = users[index];

            // Create links to related resources
            o.urls = {
                number: api.linkTo({name:'user-number'},{number:o.number}),
                name: api.linkTo({name:'user-name'},{number:o.number})
            };

            return o;
        }


    res.status = '404';
    res.body = {error: 'Not found'};

}, { name: 'user' } ); // This resource is named 'user'

api.resource('/users/:number/name', function(req,res,api,user) {

    // status will already be set to 404
    if( 'undefined' === typeof user )
        return;

    return { name: user.name };
}, {name: 'user-name'}); // This resource is named 'user-name'

api.resource('/users/:number/number', function(req,res,api,user) {

    // status will already be set to 404
    if( 'undefined' === typeof user )
        return;

    return { number: user.number };
}, { name: 'user-number' } ); // This resource is named 'user-number'

// This resource will produce an error on the server
api.resource('/error', function(){
    var a = null;

    a.toString();
});

var server = express();

// We tell express that we want to use a middleware function
// for everything below /pub/api
server.use('/pub/api*', espressoexpress(api) );

server.listen(9000);

/**
 * You can now request
 */
