

var DescribeBlock = require( './describe-block' );
var mkAsyncFn = require( './utils' ).mkAsyncFn;


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

  if( parentDescribeBlock.parent === undefined ){
    this.onLoad && this.onLoad();
  }
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


module.exports = SimpleMocha;
