(function() {
  var Hash, PREFIX, redis, util;

  redis = require('redis');

  util = require('util');

  PREFIX = 'dh';

  Hash = (function() {

    function Hash(name, port, host, password) {
      this.name = name;
      this.port = port;
      this.host = host;
      this.password = password;
      this.redisClient = redis.createClient(this.port, this.host);
      this.redisKey = PREFIX + ':' + this.name;
      this.hasQuit = false;
    }

    Hash.prototype.count = function(callback) {
      return this.redisClient.hlen(this.redisKey, callback);
    };

    Hash.prototype.del = function(field, callback) {
      return this.redisClient.hdel(this.redisKey, field, callback);
    };

    Hash.prototype.empty = function(callback) {
      return this.redisClient.del(this.redisKey, callback);
    };

    Hash.prototype.exists = function(field, callback) {
      return this.redisClient.hexists(this.redisKey, field, callback);
    };

    Hash.prototype.get = function(field, callback) {
      var _this = this;
      return this.redisClient.hget(this.redisKey, field, function(err, val) {
        if (err != null) {
          callback(err, null);
          return;
        }
        if (!(val != null)) {
          callback(new Error('Empty value.'), null);
          return;
        }
        return callback(err, val);
      });
    };

    Hash.prototype.set = function() {
      switch (arguments.length) {
        case 3:
          if (typeof arguments[2] === 'function') {
            return this.redisClient.hset(this.redisKey, arguments[0], arguments[1], arguments[2]);
          } else {
            throw new Error('When there are three arguments, the third must be a callback.');
          }
          break;
        case 2:
          if (typeof arguments[0] === 'string' && typeof arguments[1] !== 'function') {
            return this.redisClient.hset(this.redisKey, arguments[0], arguments[1]);
          } else if (typeof arguments[0] === 'object' && typeof arguments[1] === 'function') {
            return this.redisClient.hmset(this.redisKey, arguments[0], arguments[1]);
          } else {
            throw new Error("When there are two arguments, they must be either a string key and a value or an object and a callback");
          }
          break;
        case 1:
          if (typeof arguments[0] === 'object') {
            return this.redisClient.hmset(this.redisKey, arguments[0]);
          } else {
            throw new Error("When there is one argument, the first must be an object.");
          }
      }
    };

    Hash.prototype.quit = function(callback) {
      this.hasQuit = true;
      return this.redisClient.quit(callback);
    };

    Hash.create = function(params, callback) {
      var error, h, host, name, password, port;
      if (params == null) params = {};
      name = params.name;
      port = params.port || (params.port = 6379);
      host = params.host || (params.host = '127.0.0.1');
      password = params.password;
      error = null;
      if (name == null) error = new Error('Must pass name to input.');
      h = new Hash(name, port, host, password);
      if (password != null) {
        return h.redisClient.auth(password, function() {
          return callback(error, h);
        });
      } else {
        return callback(error, h);
      }
    };

    return Hash;

  })();

  module.exports.create = Hash.create;

}).call(this);
