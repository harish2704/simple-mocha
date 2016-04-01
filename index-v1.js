

// var _d = console.log.bind( console, 'dbg: ' );
var _d = function(){};
var fs = require('fs');



function mkAsyncFn( fn ){
  if( fn.length ){
    return fn;
  }
  return function( done ){
    setTimeout( function(){
      fn();
      done();
    }, 1 );
  };
}



function ItBlock( description, fn ){
  this.description = description;
  this.fn = mkAsyncFn( fn );
}



function DescribeBlock( description, parentBlock ){
  _d( 'DescribeBlock:init', parentBlock );

  this.description = description || '';
  this.parent = parentBlock;
  if( parentBlock ){
    parentBlock.addChild( this );
  }

  this.children = [];
  this.its = [];
  this.beforeEach = null;
  this.afterEach = null;
}


DescribeBlock.prototype.addChild = function( child ){
  this.children.push( child );
};


DescribeBlock.prototype.addItBlock = function( description, fn ){
  this.its.push( new ItBlock( description, fn ) );
};




function SimpleMocha(){
  
  this.describe             = this.describe.bind( this );
  this.it                   = this.it.bind( this );
  this.before               = this.before.bind( this );
  this.after                = this.after.bind( this );
  this.beforeEach           = this.beforeEach.bind( this );
  this.afterEach            = this.afterEach.bind( this );

  this.rootDescribeBlock    = new DescribeBlock();
  this.currentDescribeBlock = this.rootDescribeBlock;
}


SimpleMocha.prototype.describe   = function( description, fn ){
  var parentDescribeBlock = this.currentDescribeBlock;
  var thisDescribeBlock = new DescribeBlock( description, parentDescribeBlock );

  this.currentDescribeBlock = thisDescribeBlock;
  fn();
  this.currentDescribeBlock = parentDescribeBlock;
};


SimpleMocha.prototype.it         = function( description, fn ){
  this.currentDescribeBlock.addItBlock( description, fn );
};


SimpleMocha.prototype.before     = function( fn ){
  this.currentDescribeBlock.beforeFn = mkAsyncFn( fn );
};


SimpleMocha.prototype.after      = function( fn ){
  this.currentDescribeBlock.afterFn = mkAsyncFn( fn );
};


SimpleMocha.prototype.beforeEach = function( fn ){
  this.currentDescribeBlock.beforeEachFn = mkAsyncFn( fn );
};


SimpleMocha.prototype.afterEach = function( fn ){
  this.currentDescribeBlock.afterEachFn = mkAsyncFn( fn );
};


SimpleMocha.DescribeBlock = DescribeBlock;


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
