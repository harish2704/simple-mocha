

var context = global;
if( context.describe ){
  return; // Don't do anything if mocha any other bdd-runner is already loaded
}
var SimpleMocha = require( './simple-mocha' );
var sm = new SimpleMocha();

sm.onLoad = function(){
  sm.rootDescribeBlock.run( function( err ){
    console.log( err ? 'Finished with error' : 'Finished Successfully' );
    if( err ){
      console.log( err.stack || err );
    }
  });
}


context.describe    = sm.describe;
context.it          = sm.it;
context.before      = sm.before;
context.after       = sm.after;
context.beforeEach  = sm.beforeEach;
context.afterEach   = sm.afterEach;
