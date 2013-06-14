var npm = require('npm'),
    path = require('path'),
    http = require('http'),
    targz = require('tar.gz'),
    fs = require('fs'),
    manifest = require(path.resolve(__dirname, 'lib', 'manifest')),
    os = require('os'),
    rc = require('rc'),
    plugmanConfigDir = path.resolve(process.env.HOME, '.plugman'),
    plugmanCacheDir = path.resolve(plugmanConfigDir, 'cache'),
    local_registry = 'http://localhost:5984/registry/_design/scratch/_rewrite';

var config = null;

function checkConfig(cb) {
  if(config != null) {
    cb();
  } else {
    cb(new Error('Call registry.use(registry, cb) before using this command\n'));
  }
}

function handleError(err, cb) {
  if(typeof cb == 'function') {
    return cb(err);
  }
  throw err;
}

/**
 * @method use
 * @param {String} name Package name 
 * @param {Function} cb callback 
 */
function getPackageInfo(args, cb) {
  var thing = args.length ? args.shift().split("@") : [],
      name = thing.shift(),
      version = thing.join("@"),
  
  version = version ? version : 'latest';
  
  http.get(local_registry + '/' + name + '/' + version, function(res) {
     if(res.statusCode != 200) {
         var err = new Error('Error');
         if (cb) cb(err);
         else throw err;
     } else {
       var info = '';
       res.on('data', function(chunk) {
        info += chunk;
       });
       res.on('end', function() {
         cb(null, JSON.parse(info));
       });
     }
  }).on('error', function(err) {
    cb(err); 
  });
}

/**
 * @method use
 * @param {String} name Package name 
 * @param {Function} cb callback 
 */
function fetchPackage(info, cb) {
  console.log(info);
  var cached = path.resolve(config.cache, info.name, info.version, 'package');
  if(fs.existsSync(cached)) {
    cb(null, cached);
  } else {
    var target = os.tmpdir() + info.name;
    var file = fs.createWriteStream(target + '.tgz');
    var request = http.get(info.dist.tarball, function(res) {
        if(res.statusCode != 200) {
            var err = new Error('failed to fetch the plugin archive');
            if (cb) cb(err);
            else throw err;
        } else {
          res.pipe(file);
          res.on('end', function() {
            var decompress = new targz().extract(target + '.tgz', target, function(err) {
              cb(err, path.resolve(target, 'package'));
            });
          });
        }
    });
  }
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
                 force: true,
                 logstream: fs.createWriteStream(path.resolve(plugmanConfigDir, 'plugman.log')),
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
      if(err) return handleError(err, cb)
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
        npm.commands.search(args, true, cb);
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
  },
  /**
   * @method fetch
   * @param {String} name Plugin name
   * @param {Function} cb Command callback
   */
  fetch: function(args, cb) {
    checkConfig(function(err) {
      if(err) return handleError(err, cb)
      getPackageInfo(args, function(err, info) {
        if(err) return handleError(err, cb)
        fetchPackage(info, cb);
      });
    });
  }
}
