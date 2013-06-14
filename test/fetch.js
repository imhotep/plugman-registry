var registry = require('../index');

registry.use(null, function() {
  registry.fetch(['dummyplugin'], function(err, d) {
    if(err) throw err; 
    console.log('plugin fetched', d); 
  });
});
