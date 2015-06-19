/**
 * @file Run test for Node
 * @author treelite(c.xinle@gmail.com)
 */

require('amder');

var Storage = require('../main');
var storage = new Storage();

var spec = require('./spec/storage');

spec('server', storage);
