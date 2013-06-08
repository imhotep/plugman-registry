var npm = require('npm'),
    path = require('path'),
    manifest = require(path.resolve(__dirname, 'lib', 'manifest')),
    os = require('os'),
    rc = require('rc')('plugman', {
                 registry: 'http://localhost:5984/registry/_design/scratch/_rewrite',
                 cache: os.tmpdir() + 'plugman',
                 userconfig: process.env.HOME + '/.plugmanrc'
               });

function handleError(er) {
  console.log(er);
}

npm.on('log', function(message) {
  console.log(message);
});

module.exports = {
  adduser: function(args, cb) {
    npm.load(rc, function(er) {
      if (er) return handlError(er);
      npm.commands.adduser(args, cb);
    });
  },
  publish: function(args, cb) {
    manifest.generatePackageJsonFromPluginXml(args);
    npm.load(rc, function(er) {
      if (er) return handlError(er);
      npm.commands.publish(args, cb);
    });
  },
  search: function(args, cb) {
    npm.load(rc, function(er) {
      if (er) return handlError(er);
      npm.commands.search(args, cb);
    });
  },
  unpublish: function(args, cb) {
    // TODO
  }
}

// TODO: remove this shit
//module.exports.adduser(null, function() { console.log('user added!'); });
//module.exports.publish(path.resolve(__dirname,'test', 'plugin'), function(er) { console.log('package published!'); });
module.exports.search(null, function(er, data) { console.log(data); });
