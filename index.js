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
// if( global.describe ){ return; }



var async = require('async');

function padding( str, width ){
  return ( '          ' + str ).slice(-width);
}

var printer = function(prefix){
  return function(){
    var args = [].slice.call(arguments);
    args[0] = prefix + args[0];
    console.log.apply(console, args );
  };
};


function Task(name, fn, parentNode ){
  this.parentNode = parentNode;
  this.name = name;
  this.fn = fn;
  this.isAsync = fn && fn.length;
}

Task.prototype.exec = function(_cb){
  if( !this.fn ){ return _cb(); }
  var _this = this;
  var cb = function(err){
    _this.endTime = Date.now();
    if( err ){
      _this.err = err;
      _this.parentNode.errorCount++;
    }
    _this.print();
    _cb();
  };

  this.startTime = Date.now();
  if( this.isAsync ){
    return this.fn(cb);
  }
  try{
    this.fn();
    cb();
  } catch(e){
    cb(e);
  }
  return;
};

Task.prototype.print = function(){
  var timeTaken = this.endTime - this.startTime;
  console.log(
    this.parentNode.indent +
    ' It: ' +
    ( this.err? 'Fail ' : ' OK  ' )+
    padding( '(' + timeTaken + 'ms) ' , 11) +
    this.name
    );
};


function runner( d, cb ){
  cb = cb||function(){};
  var print = printer( d.indent );
  console.log('');
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

        return itItem.exec(cb);
      }, cb );
    },

    /* Then after hook */
    function(cb){
      if(!d.after){ return cb(); }
      print( ' After hook' );
      return d.after(cb);
    },

  ], function(){
    if( d.parentNode ){
      d.parentNode.errorCount += d.errorCount;
    }
    print( 'Finished with ' + ( d.errorCount || 'No' ) + ' Error' );
    return cb();
  });
}


var store = {
  currentDescribe: null,
};


var describe = function(str, fn ){
  var parentNode = store.currentDescribe;
  var descItem = {
    name: str,
    its: [],
    indent: '  ' + ( parentNode? parentNode.indent : '' ),
    errorCount: 0,
    parentNode: parentNode,
  };
  store.currentDescribe = descItem;

  fn();

  if( parentNode ){
    parentNode.its.push( descItem );
    store.currentDescribe = parentNode;
  } else {
    runner(descItem);
  }
};



var it = function( str, fn ){
  var task = new Task(str, fn, store.currentDescribe );
  store.currentDescribe.its.push( task );
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

