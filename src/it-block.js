
var utils = require( './utils' );
var print = utils.print;


function ItBlock( description, fn ){
  this.description = description;
  this.fn = fn;
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



module.exports = ItBlock;
