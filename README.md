# espressojs-express
A package connecting espressojs with express.

Used to create JSON REST API and also as an example demonstrating how to connect
espressojs to server frameworks.

# Installation

Install express, espressojs and espressojs-express with npm:

```bash
npm install --save express espressojs espressojs-express
```

# Usage
Create a new express server and a new espressojs API.

espressojs-express exposes a function that expects the espressojs API
and returns a middleware handler for express. Thus, you can use it like this:

```javascript
var Espresso = require('espressojs');
var express  = require('express');
var espressoexpress = require('./index');

var api = new Espresso({
    port: '9000',           // Only change the port
    apiRoot: '/pub/api'     // and the API root
});

var server = express();

// There is no leading slash in the path!!
server.use('/pub/api*', espressoexpress(api) );
server.listen(9000);
```

This would start an express server listening in port 9000 with the API exposed
under `/pub/api`.

Please check the [usage.js file](https://github.com/dak0rn/espressojs-express/blob/master/usage.js) for a detailed usage example.

# Serving from /

If you want to make your API available at `/` please note that you have
to expose your API this way:

```javascript
server.use('*', espressoexpress(api) );
```

Since **there must not be a leading slash** the URL consists of a single star.
