var path = require('path'),
    registry = require('../index');

registry.use(null, function() {
  registry.adduser(null, function(err) {
    if(err) throw err; 
    registry.publish([path.resolve(__dirname, 'plugin')], function(err) {
      if(err) throw err;
      console.log('plugin published');
      registry.search(['dummy', 'plugin'], function(err, data) {
        if(err) throw err;
        console.log(data);
        registry.unpublish(['dummyplugin@0.6.0'], function(err) {
          if(err) throw err;
          console.log('plugin unpublished');
        });
      });
    });
  });
});
