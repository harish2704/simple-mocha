
var SimpleMocha = require( './simple-mocha' );
var fs = require('fs');

SimpleMocha.load = function( fileName ){
  var sm = new SimpleMocha();
  var describe    = sm.describe;
  var it          = sm.it;
  var before      = sm.before;
  var after       = sm.after;
  var beforeEach  = sm.beforeEach;
  var afterEach   = sm.afterEach;

  var code = fs.readFileSync( fileName, 'utf-8' );

  eval( code );
  
  return sm;
};

module.exports = SimpleMocha;
