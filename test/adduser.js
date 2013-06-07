var assert = require('assert'),
    path = require('path'),
    index = require(path.resolve(__dirname, '..', 'index.js'));

describe('index', function() {
  it('should create a new user', function() {
    index.adduser(null, function(er) {
      assert(!er);
      assert(true);
    });
  })
})
