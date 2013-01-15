Node.js - dq
============

dh is a distributed hash. Simply a wrapper around the Redis hash.



Install
-------

    npm install dh



Programatically
---------------

```js
var dh = require('dh')

dh.create({name: 'myhash'}, function(err, h) {
  h.set('key1', 'data1')
})
```
      

dh-import
---------

Imports a CSV (two-field) file into the hash.

      Usage: dh-import [options]

      Options:

        -h, --help              output usage information
        -V, --version           output the version number
        -f, --file [inputFile]  input file otherwise the default is STDIN
        -h, --host [host]       host of redis server, the default is localhost
        -a, --auth [password]   password of redis server
        -p, --port [number]     port of redis server, the default is 6379
        -n, --name [hashName]   name of the hash



dh-export
---------

Exports to a CSV (two-field).

      Usage: dh-export [options]

      Options:

        -h, --help               output usage information
        -V, --version            output the version number
        -f, --file [outputFile]  output file otherwise the default is STDOUT
        -h, --host [host]        host of redis server, the default is localhost
        -a, --auth [password]    password of redis server
        -p, --port [number]      port of redis server, the default is 6379
        -n, --name [hashName]    name of the hash


License
---------

Licensed under MIT. See `LICENSE` for more details.

Copyright (c) 2012-2013 JP Richardson

