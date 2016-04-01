

// var _d = console.log.bind( console, 'dbg: ' );
var _d = function(){};
var async = require('async');


var pr = console.log;

var INDENT = '   ';
var STATUS_FLAG = {
  true  : 'Okey',
  false : 'Fail'
};

function print( level, item ){
  var indent = getIndent( level );
  var status = STATUS_FLAG[ item.isSuccess ];
  var timeTaken = '(' + ( item.endTime - item.startTime ) + 'ms)';
  pr( [ indent, status, item.description, timeTaken ].join(' ') );
};

function safeFn( fn ){
  return function( done ){
    try{
      fn( done )
    } catch( e ){
      done( e );
    }
  }
}

function getIndent( level ){
  return INDENT.repeat( level );
}

function mkAsyncFn( fn ){
  if( fn.length ){
    return safeFn( fn );
  }
  return safeFn( function( done ){
    setTimeout( function(){
      fn();
      done();
    }, 1 );
  });
}



function ItBlock( description, fn ){
  this.description = description;
  this.fn = mkAsyncFn( fn );
  this.isSuccess = false;
}

ItBlock.prototype.run = function( done ){
  var self = this;
  this.startTime = Date.now();
  this.fn( function( err ){
    self.endTime = Date.now();
    if( !err ){
      self.isSuccess = true;
    }
    self.print();
    done( err );
  });
}

ItBlock.prototype.print = function(){
  print( this.parent.level+1, this );
};




function DescribeBlock( description, parentBlock ){
  _d( 'DescribeBlock:init', parentBlock );

  this.description = description || '';
  this.parent = parentBlock;
  this.level = parentBlock ? parentBlock.level +1 : 0;
  if( parentBlock ){
    parentBlock.addChild( this );
  }

  this.tasks = [];
  this.children = [];
  this.its = [];
  this.beforeEach = null;
  this.afterEach = null;

  this.isSuccess = false;
}


DescribeBlock.prototype.addChild = function( child ){
  this.children.push( child );
  this.tasks.push( child );
};


DescribeBlock.prototype.addItBlock = function( description, fn ){
  var itBlock = new ItBlock( description, fn );
  itBlock.parent = this;
  this.its.push( itBlock );
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

  pr( getIndent( this.level) + '---' + this.description + '---' );
  this.startTime = Date.now();
  return async.waterfall( tasks, function( err ){
    
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


SimpleMocha.DescribeBlock = DescribeBlock;


module.exports = SimpleMocha;
