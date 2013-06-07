var npm = require('npm'),
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
    // TODO read plugin.xml and create package.json
    // Publish: need to figure out how users are retrieved
  },
  unpublish: function(args, cb) {
  }
}

function handleError(er) {
  console.log(er);
}

