var npm = require('npm'),
    path = require('path'),
    fs = require('fs'),
    manifest = require(path.resolve(__dirname, 'lib', 'manifest')),
    os = require('os'),
    rc = require('rc'),
    plugmanConfigDir = path.resolve(process.env.HOME, '.plugman'),
    plugmanCacheDir = path.resolve(plugmanConfigDir, 'cache'),
    local_registry = 'http://localhost:5984/registry/_design/scratch/_rewrite';

var config = null;
// TODO log this somewhere else
npm.on('log', function(message) {
  console.log(message);
});

function checkConfig(cb) {
  if(config != null) {
    cb();
  } else {
    cb(new Error('Call plugman-registry.use(registry, cb) before using this command\n'));
  }
}

function handleError(err, cb) {
  if(typeof cb == 'function') {
    return cb(err);
  }
  throw err;
}

module.exports = {
  /**
   * @method use
   * @param {String} registry NPM registry URL 
   * @param {Function} cb callback
   */
  use: function(registry, cb) {
    if(typeof cb != 'function') throw new Error('Please provide a callback');
    // check if config already set
    if(config != null) return cb();

    // setting up configuration
    if(!fs.existsSync(plugmanConfigDir)) {
      fs.mkdirSync(plugmanConfigDir);
      fs.mkdirSync(plugmanCacheDir);
    }
    config = rc('plugman', {
                 registry:  registry || local_registry,
                 cache: plugmanCacheDir,
                 userconfig: path.resolve(plugmanConfigDir, 'plugmanrc')
               });
    cb();
  },
  /**
   * @method adduser
   * @param {Array} args Command argument
   * @param {Function} cb Command callback
   */
  adduser: function(args, cb) {
    checkConfig(function(err) {
      if(err) return handleError(err, cb);
      npm.load(config, function(er) {
        if (er) return handlError(er);
        npm.commands.adduser(args, cb);
      });
    });
  },
  /**
   * @method publish
   * @param {Array} args Command argument
   * @param {Function} cb Command callback
   */
  publish: function(args, cb) {
    checkConfig(function(err) {
      if(err) return handleError(err, cb);
      manifest.generatePackageJsonFromPluginXml(args[0]);
      npm.load(config, function(er) {
        if (er) return handlError(er);
        npm.commands.publish(args, function(err, data) {
          fs.unlink(path.resolve(args[0], 'package.json'));
          cb(err, data);
        });
      });
    });
  },
  /**
   * @method search
   * @param {Array} args Array of keywords
   * @param {Function} cb Command callback
   */
  search: function(args, cb) {
    checkConfig(function(err) {
      if(err) return handleError(err, cb);
      npm.load(config, function(er) {
        if (er) return handlError(er);
        npm.commands.search(args, cb);
      });
    });
  },
  /**
   * @method unpublish
   * @param {Array} args Command argument
   * @param {Function} cb Command callback
   */
  unpublish: function(args, cb) {
    checkConfig(function(err) {
      if(err) return handleError(err, cb);
      npm.load(config, function(er) {
        if (er) return handlError(er);
        npm.commands.unpublish(args, cb);
      });
    });
  }
}

// TODO: remove this shit
// module.exports.adduser(null, function() { console.log('user added!'); });
// module.exports.publish([path.resolve(__dirname,'test', 'plugin')], myCallback);
// module.exports.search(['dummy'], myCallback);
