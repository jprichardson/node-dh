dh = require('../lib/dh.js')
testutil = require('testutil')


TEST_NAME = 'testhash'

describe 'dh', ->
  H = null

  beforeEach (done) ->
    dh.create name: TEST_NAME, (err, h) ->
      h.empty (err) ->
        H = h
        done()


  describe '+ create()', ->
    it 'should create a Hash with default params', (done) ->
      dh.create name:'someHash', (err, h) ->
        T h.name is 'someHash'
        T h.host is '127.0.0.1'
        T h.port is 6379
        T h.redisKey is 'dh:someHash'
        done()

    it 'should create a Hash with input params', (done) ->
      dh.create name:'someHash', host: '44.22.11.33', port: 6000, (err, h) ->
        T h.name is 'someHash'
        T h.host is '44.22.11.33'
        T h.port is 6000
        done()

    it 'should return an error if name doesnt exist', (done) ->
      dh.create {}, (err, h) ->
        T err isnt null
        done()
  

  describe '- count()', ->
    it 'should count the items in the hash', (done) ->
      H.set 'a', 1, (err,res) ->
        #console.log 'hi ' + res
        H.set 'b', 2, (err,res) ->
          H.set 'c', 3, (err,res) ->
            H.count (err,res) ->
              T err is null
              T res is 3

              done()

  
  describe '- del()', ->
    it 'should delete', (done) ->
      H.set 'a', 1, (err,res) ->
        H.set 'b', 2, (err,res) ->
          H.set 'c', 3, (err,res) ->
            H.del 'b', (err,res) ->
              T err is null
              H.count (err, res) ->
                T err is null
                T res is 2
                done()
  

  describe '- empty()', ->
    it 'should empty the hash', (done) ->
      H.set 'a', 1, (err, res) ->
        H.set 'b', 2, (err, res) ->
          H.count (err, res) ->
            T res is 2
            H.empty (err, res) ->
              T err is null
              H.count (err, res) ->
                T res is 0
                done()

  describe '- exists()', ->
    it 'should check to see if field exists', (done) ->
      H.set 'a', 1, (err,res) ->
        H.set 'b', 2, (err,res) ->
          H.set 'c', 3, (err,res) ->
            H.exists 'b', (err, res) ->
              T res
              T err is null
              H.del 'b', (err,res) ->
                H.exists 'b', (err, res) ->
                  T err is null
                  F res
                  H.set x: 'hi', y: 'bye', (err, res) ->
                    H.exists 'x', (err, res) ->
                      T err is null
                      T res
                      H.exists 'y', (err, res) ->
                        T err is null
                        T res
                        done()

  describe '- get()', ->
    it 'should retrieve the value', (done) ->
      H.set 'b', 2, (err, res) ->
        H.get 'b', (err, res) ->
          T err is null
          T res is '2'
          H.get 'c', (err, res) ->
            T err isnt null
            T res is null
            done()


  describe '- set()', ->
    it 'should set a field and value', (done) ->
      H.set 'string1', 1, (err, res) ->
        T err is null
        H.count (err,res) ->
          T err is null
          T res is 1
          done()
               
    it 'should set a field and value without a callback', (done) ->
      H.set('someval', 12)
      H.set('someval2', 44)
      setTimeout(->
        H.count (err,res) ->
          T res is 2
          done()
      , 150)

    it 'should set a JSON object', (done) ->
      H.set val1: 'hi', val2: 'haa', (err, res) ->
        T err is null
        H.get 'val1', (err, res) ->
          T err is null
          T res is 'hi'
          H.get 'val2', (err, res) ->
            T err is null
            T res is 'haa'
            done()


  describe '- quit()', ->
    it 'should set the hasQuit flag', (done) ->
      dh.create name: 'blah', (err, h) ->
        F h.hasQuit
        h.quit ->
          T h.hasQuit
          done()
       