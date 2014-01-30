require('mocha');

var assert = require('mocha').assert;
var atry = require('./atry');

it('should catch synchronous exception', function(cb) {
  var objToThrow = {test: 42};
  atry(function() {
    throw objToThrow;
  }).catch(function(err) {
    if(err.test === 42)
      cb();
    else
      cb(err);
  });
});
it('should catch asynchronous exception', function(cb) {
  var objToThrow = {test: 42};
  atry(function() {
    setTimeout(function() {
      throw objToThrow;
    }, 10);
  }).catch(function(err) {
    if(err.test === 42)
      cb();
    else
      cb(err);
  });

});


var net = require('net');
it('should catch asynchronous exception from foreign module', function(cb) {
  
  atry(function() {
    setTimeout(function() {
      net.createServer().listen(1);
    }, 10);
  }).catch(function(err) {
    cb();
  });

});

it('should forward arguments to running function', function() {
  atry(function(num1, num2) {
    num1.should.equal(42);
    num2.should.equal(33);
  }, 42, 33);
});

var fs = require('fs');

describe('bind', function() {
  it('should bind function and forward arguments', function(cb) {

    fs.readFile('/dupa', atry.bind(function(err, data) {
      setTimeout(function() {
        throw err;   
      }, 10);
    }).catch(function(err) {
      if(err)
        cb();
      else
        cb(err);
    }));

  });
  it('should bind function and intercept error', function(cb) {

    fs.readFile('/dupa/__notexistingfile', atry.intercept(function(data) {
      
    }).catch(function(err) {
      if(err)
        cb();
      else
        cb(err);
    }));

  });
  it('should bind function and forward other args', function(cb) {

    var onData = function(cb) {
      setTimeout(function() {
        cb(null, 42);
      }, 10);
    }

    onData(atry.intercept(function(data) {
      if(data === 42)
        cb();
    }).catch(function(err) {
      cb(err);
    }));

  });

});