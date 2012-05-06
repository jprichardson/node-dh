Node.js - dq
============

dh is A distributed hash. Simply a wrapper around the Redis hash.



Install
-------

    npm install dh



Usage
-----

### Programatically

    dh = require('dh')

    dh.create name: 'myhash', (err, h) ->
      h.set('key1', 'data1')
      

(More to come later.)



TODO
----

1. fluent interface
2. REST API


## License

Licensed under MIT. See `LICENSE` for more details.

Copyright (c) 2012 JP Richardson