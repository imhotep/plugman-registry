var path = require('path'),
    assert = require('assert'),
    manifest = require(path.resolve(__dirname, '..', 'lib', 'manifest'));

describe('manifest', function() {
  it('should read plugin.xml', function() {
    var plugin_xml_path = path.resolve(__dirname, 'plugin', 'plugin.xml');
    console.log(manifest.generatePackageJsonFromPluginXml(plugin_xml_path));
    assert(true);
  })
})
