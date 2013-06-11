plugman-registry
================

This package uses npm and npmjs.org to manage PhoneGap/Cordova plugins.

Available commands
==================

adduser
-------

Create a new user on the npm based PhoneGap/Cordova registry

publish
-------

Publish a new PhoneGap/Cordova plugin to the npm based PhoneGap/Cordova registry

unpublish
---------

Unpublish a new PhoneGap/Cordova plugin to the npm based PhoneGap/Cordova registry

search
------

search for a PhoneGap/Cordova plugin in the npm based PhoneGap/Cordova registry


Example
-------

```javascript
  var registry = require('plugman-registry')
  
  /*
   * Will prompt for user information
   */
  registry.use('http://registry_url', function() {
    registry.adduser(args, function(err) {
      if(err) return handleError(err);
      console.log('User successfully added!');
    });
  });

  
  /*
   * publish a plugin to the registry 
   */
  registry.use('http://registry_url', function() {
    registry.publish([path_to_cordova_plugin], function(err) {
      if(err) return handleError(err);
      console.log('Plugin successfully published');
    });
  });
  
  /*
   * unpublish a plugin from a registry 
   */
  registry.use('http://registry_url', function() {
    registry.unpublish([cordova_plugin_name], function(err) {
      if(err) return handleError(err);
      console.log('Plugin successfully unpublished');
    });
  });
  
  /*
   * search for a plugin in the registry 
   */
  registry.use('http://registry_url', function() {
    registry.search([cordova_plugin_name], function(err, result) {
      if(err) return handleError(err);
      console.log('found', result);
    });
  });

```

Set up a new registry
=====================

Follow these [steps](https://github.com/isaacs/npmjs.org) to set a registry up locally
Make sure you set `secure_rewrites` to `false` in your couchdb configuration.
