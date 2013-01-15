var redis = require('redis')
  , util = require('util')

var PREFIX = 'dh';


function Hash(name, redisClient) {
  this.name = name;
  this.redisClient = redisClient
  this.redisKey = PREFIX + ':' + this.name;
  this.hasQuit = false;
}

Hash.prototype.count = function(callback) {
  this.redisClient.hlen(this.redisKey, callback)
}

Hash.prototype.del = function(field, callback) {
  this.redisClient.hdel(this.redisKey, field, callback);
}
Hash.prototype.delete = Hash.prototype.del


Hash.prototype.empty = function(callback) {
  this.redisClient.del(this.redisKey, callback);
}

Hash.prototype.exists = function(field, callback) {
  this.redisClient.hexists(this.redisKey, field, function(err, doesIt) {
    if (err) return callback(err, null)
      
    if (doesIt === 1) {
      callback(null, true);
    } else if (doesIt === 0) {
      callback(null, false);
    } else {
      return callback(new Error("Unexpected result: " + doesIt + "."), null);
    }
  })
}

Hash.prototype.get = function(field, callback) {
  this.redisClient.hget(this.redisKey, field, function(err, val) {
    if (err) return callback(err, null)
    if (!val) return callback(new Error('Empty value.'), null)
    
    callback(err, val);
  })
}

Hash.prototype.set = function() {
  switch (arguments.length) {
    case 3:
      if (typeof arguments[2] === 'function') {
        this.redisClient.hset(this.redisKey, arguments[0], arguments[1], arguments[2]);
      } else {
        throw new Error('When there are three arguments, the third must be a callback.');
      }
      break;
    case 2:
      if (typeof arguments[0] === 'string' && typeof arguments[1] !== 'function') {
        this.redisClient.hset(this.redisKey, arguments[0], arguments[1]);
      } else if (typeof arguments[0] === 'object' && typeof arguments[1] === 'function') {
        this.redisClient.hmset(this.redisKey, arguments[0], arguments[1]);
      } else {
        throw new Error("When there are two arguments, they must be either a string key and a value or an object and a callback");
      }
      break;
    case 1:
      if (typeof arguments[0] === 'object') {
        this.redisClient.hmset(this.redisKey, arguments[0]);
      } else {
        throw new Error("When there is one argument, the first must be an object.");
      }
  }
}

Hash.prototype.quit = function(callback) {
  this.hasQuit = true;
   this.redisClient.quit(callback);
}

Hash.create = function(params, callback) {
  params = params || {}
  var name = params.name
    , port = params.port || 6379
    , host = params.host || '127.0.0.1'
    , password = params.password
  
  if (name == null) return callback(Error('Must pass queue name to input.'))

  var rc = redis.createClient(port, host)
  rc.auth(password)
  rc.on('error', function(err) {
    callback(err)
  })
  Hash.createFromRedisClient(name, rc, callback)
}

Hash.createFromRedisClient = function (name, redisClient, callback) {
  var h = new Hash(name, redisClient)
  callback(null, h)
}

module.exports.create = Hash.create;


