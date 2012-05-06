redis = require('redis')
util = require('util')

#rename `delete` in dq to `empty`... add `empty` method here.

PREFIX = 'dh'

class Hash
  constructor: (@name, @port, @host, @password) ->
    @redisClient = redis.createClient(@port, @host)
    @redisKey = PREFIX + ':' + @name
    @hasQuit = false

  count: (callback) ->
    @redisClient.hlen @redisKey, callback

  del: (field, callback) ->
    @redisClient.hdel @redisKey, field, callback

  empty: (callback) ->
    @redisClient.del @redisKey, callback

  exists: (field, callback) ->
    @redisClient.hexists(@redisKey, field, callback)

  get: (field, callback) ->
    @redisClient.hget @redisKey, field, (err, val) =>
      if err? then callback(err, null); return;
      if !val? then callback(new Error('Empty value.'), null); return;
      callback(err, val)

  set: -> #(field, [value], [callback]) if field is a string, then value is required 
    switch arguments.length
      when 3
        if typeof arguments[2] is 'function'
          @redisClient.hset(@redisKey, arguments[0], arguments[1], arguments[2])
        else
          throw new Error('When there are three arguments, the third must be a callback.')
      when 2
        if typeof arguments[0] is 'string' and typeof arguments[1] isnt 'function'
          @redisClient.hset(@redisKey, arguments[0], arguments[1])
        else if typeof arguments[0] is 'object' and typeof arguments[1] is 'function'
          @redisClient.hmset(@redisKey, arguments[0], arguments[1])
        else
          throw new Error("When there are two arguments, they must be either a string key and a value or an object and a callback")
      when 1
        if typeof arguments[0] is 'object'
          @redisClient.hmset(@redisKey, arguments[0])
        else
          throw new Error("When there is one argument, the first must be an object.")
        

  quit: (callback) ->
    @hasQuit = true
    @redisClient.quit callback

  @create: (params={}, callback) ->
    name = params.name 
    port = params.port or= 6379
    host = params.host or= '127.0.0.1'
    password = params.password

    error = null
    error = new Error('Must pass name to input.') unless name?

    h = new Hash(name, port, host, password)
    if password?
      h.redisClient.auth password, ->
        callback(error, h)
    else
      callback(error, h)


module.exports.create = Hash.create