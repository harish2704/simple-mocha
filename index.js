/*
 * Simple stupid implementation of mocha test runner.
 * It is used to run tests direclty from node.
 * Can be used for debugging purpose
 *
 * By Harish.K<harish2704@gmail.com>
 */

/*
 * TODO: beforeEach hook is not implemented.
 * only 'before' and 'after' hook is implemented
 */


/* Don't do anything if we are in Mocha's environment */
if( global.describe ){ return; }



var async = require('async');


var printer = function(prefix){
  return function(){
    var args = [].slice.call(arguments);
    args[0] = prefix + args[0];
    console.log.apply(console, args );
  };
};


function runner( d, cb ){
  var print = printer( d.indent );
  cb = cb||function(){};
  print( 'Describe: ', d.name );

  return async.series([

    /* First before hook */
    function(cb){
      if(!d.before){ return cb(); }
      print( ' Before hook' );
      return d.before(cb);
    },

    /* Then each It functions */
    function(cb){
      async.eachSeries(d.its,
      function(itItem, cb ){

        // Check whether it is 'IT' item or 'DESCRIBE' item
        if( itItem.its ){
          return runner(itItem, cb);
        }
        print( ' It: ' + itItem.name );

        if( !itItem.fn ){ return cb(); }

        if( itItem.fn.length ){ return itItem.fn(cb); }

        itItem.fn();
        return cb();
      }, cb );
    },

    /* Then after hook */
    function(cb){
      if(!d.after){ return cb(); }
      print( ' After hook' );
      return d.after(cb);
    },

  ], function(err){
    print( 'Finished with ' + ( err? '': 'No' ) + ' Error' );
    if(err){
      print( 'Error ', err.stack );
    }
    return cb();
  });
}


var store = {
  currentDescribe: null,
};


var describe = function(str, fn ){
  var parentDesc = store.currentDescribe;
  var descItem = {
    name: str,
    its: [],
    indent: '  ' + ( parentDesc? parentDesc.indent : '' ),
  };
  store.currentDescribe = descItem;

  fn();

  if( parentDesc ){
    parentDesc.its.push( descItem );
    store.currentDescribe = parentDesc;
  } else {
    runner(descItem);
  }
};



var it = function( str, fn ){

  store.currentDescribe.its.push({ 
    name : str,
    fn: fn
  });
};
it.skip = function(){};


var before = function( fn ){
  store.currentDescribe.before = fn;
};


var after = function( fn ){
  store.currentDescribe.after = fn;
};


global.after    = after;
global.describe = describe;
global.it       = it;
global.before   = before;
global.runner   = runner;

