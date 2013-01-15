var dh = require('../lib/dh.js')
  , testutil = require('testutil')

var TEST_NAME = 'testhash'

describe('dh', function() {
  var H = null
    
  beforeEach(function(done) {
    dh.create({name: TEST_NAME}, function(err, h) {
      h.empty(function(err) {
        H = h
        done()
      })
    })
  })
    
  describe('+ create()', function() {
    it('should return an error if name doesnt exist', function(done) {
      dh.create({}, function(err, h) {
        T (err)
        done()
      })
    })
  })

  describe('- count()', function() {
    it('should count the items in the hash', function(done) {
       H.set('a', 1, function(err, res) {
         H.set('b', 2, function(err, res) {
           H.set('c', 3, function(err, res) {
            H.count(function(err, res) {
              F (err)
              T (res === 3)
              done()
            })
          })
        })
      })
    })
  })

  describe('- del()', function() {
     it('should delete', function(done) {
       H.set('a', 1, function(err, res) {
         H.set('b', 2, function(err, res) {
           H.set('c', 3, function(err, res) {
             H.del('b', function(err, res) {
              T(err === null)
               H.count(function(err, res) {
                T(err === null)
                T(res === 2)
                 done()
              })
            })
          })
        })
      })
    })
  })

  describe('- empty()', function() {
     it('should empty the hash', function(done) {
       H.set('a', 1, function(err, res) {
         H.set('b', 2, function(err, res) {
           H.count(function(err, res) {
            T(res === 2)
             H.empty(function(err, res) {
              T(err === null)
               H.count(function(err, res) {
                T(res === 0)
                 done()
              })
            })
          })
        })
      })
    })
  })

  describe('- exists()', function() {
     it('should check to see if field exists', function(done) {
       H.set('a', 1, function(err, res) {
         H.set('b', 2, function(err, res) {
           H.set('c', 3, function(err, res) {
             H.exists('b', function(err, res) {
              T(res)
              T(err === null)
               H.del('b', function(err, res) {
                 H.exists('b', function(err, res) {
                  T(err === null)
                  F(res)
                   H.set({
                    x: 'hi',
                    y: 'bye'
                  }, function(err, res) {
                     H.exists('x', function(err, res) {
                      T(err === null)
                      T(res)
                       H.exists('y', function(err, res) {
                        T(err === null)
                        T(res)
                         H.exists('z', function(err, res) {
                          T(err === null)
                          F(res)
                           done()
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })

  describe('- get()', function() {
     it('should retrieve the value', function(done) {
       H.set('b', 2, function(err, res) {
         H.get('b', function(err, res) {
          T(err === null)
          T(res === '2')
           H.get('c', function(err, res) {
            T(err !== null)
            T(res === null)
             done()
          })
        })
      })
    })
  })

  describe('- set()', function() {
    it('should set a field and value', function(done) {
       H.set('string1', 1, function(err, res) {
        T(err === null)
         H.count(function(err, res) {
          T(err === null)
          T(res === 1)
           done()
        })
      })
    })

    it('should set a field and value without a callback', function(done) {
      H.set('someval', 12)
      H.set('someval2', 44)
       setTimeout(function() {
         H.count(function(err, res) {
          T(res === 2)
           done()
        })
      }, 150)
    })

    it('should set multiple keys', function(done) {
       H.set({
        key1: 'hi',
        key2: 'haa'
      }, function(err, res) {
        T(err === null)
         H.get('key1', function(err, res) {
          T(err === null)
          T(res === 'hi')
           H.get('key2', function(err, res) {
            T(err === null)
            T(res === 'haa')
             done()
          })
        })
      })
    })

     it('should set a JSON object one key', function(done) {
       H.set('person1', JSON.stringify({
        firstName: 'JP',
        lastName: 'Richardson'
      }), function(err, res) {
        T(err === null)
         H.get('person1', function(err, res) {
          var person
          T(err === null)
          person = JSON.parse(res)
          T(person.firstName === 'JP')
          T(person.lastName === 'Richardson')
           done()
        })
      })
    })
  })

  describe('- quit()', function() {
    it('should set the hasQuit flag', function(done) {
      dh.create({name: 'blah'}, function(err, h) {
        F(h.hasQuit)
         h.quit(function() {
          T(h.hasQuit)
           done()
        })
      })
    })
  })
})


