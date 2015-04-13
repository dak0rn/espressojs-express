/**
 * espressojs-express - An espressojs connector for express
 *
 * Copyright (c) 2015 Daniel Koch
 *
 * https://github.com/dak0rn/espressojs-express
 */
var Espresso = require('espressojs');

// We expose a function that takes an espressojs API instance
module.exports = function( api ) {

    // express handler function
    return function(request, response, next) {

        var apiRequest = new Espresso.Request({
            body: request.body,
            cookie: request.cookies,
            hostname: request.hostname,
            ip: request.ip,
            protocol: request.protocol,
            query: request.query,
            method: request.method.toLowerCase(),
            path: request.params[0],
            headers: request.headers
        });

        var promise = api.dispatchRequest(apiRequest);

        var answer = function( apiResponse ) {

            response.status( apiResponse.status );

            // Default value - might be overwritten...
            response.set('Content-type','application/json');
            // ...by this:
            response.set( apiResponse.headers );

            for( var cookie in apiResponse.cookies ) {
                var c = apiResponse.cookies[cookie];

                if( 'undefined' === typeof c )
                    response.clearCookie(cookie);
                else
                    response.cookie(cookie, c);
            }

            response.send( apiResponse.body );
            response.end();

        };

        promise.then( answer ).catch( answer );
    };

};
