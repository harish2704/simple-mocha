
var async = require( 'async' );
var ItBlock = require( './it-block' );
var utils = require( './utils' );
var mkAsyncFn = utils.mkAsyncFn;
var pr = utils.pr;
var getIndent = utils.getIndent;

function DescribeBlock( description, parentBlock ){
  this.description = description || '';
  this.parent = parentBlock;
  this.level = parentBlock ? parentBlock.level +1 : 0;
  if( parentBlock ){
    parentBlock.addChild( this );
  }

  this.tasks = [];
  this.beforeEach = null;
  this.afterEach = null;

  this.isSuccess = false;
}

DescribeBlock.prototype.__defineGetter__( 'children', function(){
  return this.tasks.filter( function( task ){
    return task instanceof DescribeBlock;
  });
});


DescribeBlock.prototype.__defineGetter__( 'children', function(){
  return this.tasks.filter( function( task ){
    return task instanceof ItBlock;
  });
});

DescribeBlock.prototype.addChild = function( child ){
  this.tasks.push( child );
};


DescribeBlock.prototype.addItBlock = function( description, fn ){
  var itBlock = new ItBlock( description, mkAsyncFn( fn ) );
  itBlock.parent = this;
  this.tasks.push( itBlock );
};


DescribeBlock.prototype.run = function( cb ){
  var tasks = [];
  var self = this;

  if( this.beforeFn ){ tasks.push( this.beforeFn ); }

  this.tasks.forEach( function( itBlock ){
    if( itBlock instanceof ItBlock ){
      if( this.beforeEachFn ){ tasks.push( this.beforeEachFn ); }
      tasks.push( itBlock.run.bind( itBlock ) );
      if( this.afterEachFn ){ tasks.push( this.afterEachFn ); }
    } else {
      tasks.push( itBlock.run.bind( itBlock ) );
    }
  }, this );

  if( this.afterFn ){ tasks.push( this.afterFn ); }

  pr( getIndent( this.level) + ' ---' + this.description + '---' );
  this.startTime = Date.now();
  return async.series( tasks, function( err ){

    self.endTime = Date.now();
    if( !err ){
      self.isSuccess = true;
    }
    self.print();
    cb && cb( err );
  });
}


DescribeBlock.prototype.print = function(){
  print( this.level, this );
}



module.exports = DescribeBlock;
