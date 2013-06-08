var path = require('path'),
    assert = require('assert'),
    os = require('os'),
    fs = require('fs'),
    plugin_xml_path = path.resolve(__dirname, 'plugin', 'plugin.xml'),
    tmp_plugin_path = path.resolve(os.tmpdir(), 'test_plugin'),
    tmp_plugin_xml_path = path.resolve(tmp_plugin_path, 'plugin.xml'),
    package_json_path = path.resolve(tmp_plugin_path, 'package.json'),
    manifest = require(path.resolve(__dirname, '..', 'lib', 'manifest'));

function copyFile(from, to) {
  // XXX I DONT KNOW WHAT IS WRONG WITH THESE FUCKING STREAMS
//  console.log(from, to);
//  fs.createReadStream(from, 'utf8').pipe(fs.createWriteStream(to, 'utf8')).on('end', function() {
//    console.log('ta mere');
//    console.log('to', fs.readFileSync(to, 'utf8'));
//  });
  // SUPER guetto way of copying files
  fs.writeFileSync(to, fs.readFileSync(from, 'utf8'), 'utf8');
//  console.log('to', fs.readFileSync(to, 'utf8'));
}

describe('manifest', function() {

  beforeEach(function() {
    fs.mkdirSync(tmp_plugin_path);
    copyFile(plugin_xml_path, tmp_plugin_xml_path); 
  });
  
  afterEach(function() {
    fs.unlinkSync(tmp_plugin_xml_path);
    fs.unlinkSync(package_json_path);
    fs.rmdirSync(tmp_plugin_path);
  });
  
  it('should read plugin.xml and generate package.json', function() {
    var package_json = manifest.generatePackageJsonFromPluginXml(tmp_plugin_xml_path);
    assert.equal('DummyPlugin', package_json.name);
    assert.equal('0.6.0', package_json.version);
    assert.equal(null, package_json.description);
    assert.equal('dummy', package_json.keywords[0]);
    assert.equal('plugin', package_json.keywords[1]);
    assert.equal('BSD', package_json.license);

    assert(fs.existsSync(package_json_path));
    assert.equal(134, fs.statSync(package_json_path).size);
  });
  
//  it('should read plugin.xml and not generate package.json if name or version is missing', function() {
//    // TODO
//    assert(true);
//  });
})
