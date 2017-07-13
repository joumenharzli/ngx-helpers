require('ts-node/register');
require('core-js/es7/reflect');
require('zone.js/dist/zone-node.js');
require('zone.js/dist/long-stack-trace-zone.js');
require('zone.js/dist/proxy.js');
require('zone.js/dist/sync-test.js');
require('zone.js/dist/async-test.js');
require('zone.js/dist/fake-async-test.js');
const Jasmine = require('jasmine');

const runner = new Jasmine();

global.jasmine = runner.jasmine;

function storageMock() {
  var storage = {};

  return {
    setItem: function (key, value) {
      storage[key] = value || '';
    },
    getItem: function (key) {
      return key in storage ? storage[key] : null;
    },
    removeItem: function (key) {
      delete storage[key];
    },
    get length() {
      return Object.keys(storage).length;
    },
    key: function (i) {
      var keys = Object.keys(storage);
      return keys[i] || null;
    }
  };
}

global.localStorage = storageMock();
global.atob = (b64Encoded) => new Buffer(b64Encoded, 'base64').toString();

require('zone.js/dist/jasmine-patch.js');

const { getTestBed } = require('@angular/core/testing');
const { ServerTestingModule, platformServerTesting } = require('@angular/platform-server/testing');


getTestBed().initTestEnvironment(ServerTestingModule, platformServerTesting());

runner.loadConfig({
  spec_dir: '.',
  spec_files: ['**/*.spec.ts']
});

runner.execute();
