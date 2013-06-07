var DOMParser = require('xmldom').DOMParser,
    fs = require('fs');

var sample_package_json = {
  "name": "plugin", // required
  "version": "0.0.1", // required
  "description": "test plugin",
  "keywords": [
    "dummy",
    "plugin"
  ],
  "author": "Jackson Badman",
  "license": "BSD"
}
    

// Java world big-up!
function generatePackageJsonFromPluginXml(path) {
  var plugin_xml = fs.readFileSync(path, "utf8");
  return plugin_xml
}

module.exports.generatePackageJsonFromPluginXml = generatePackageJsonFromPluginXml;
