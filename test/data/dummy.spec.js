/* globals describe, it, before, after */

var messageLog = [];
var pr = function( msg ){
  messageLog.push( msg );
  // console.log( '--', msg );
}

function asyncFn( args ){
  return function( cb ){
    setTimeout( function(){
      pr( args.msg );
      if( args.error ){
        if( args.isThrow ){
          throw args.error;
        } else {
          return cb( args.error );
        }
      } else {
        return cb( );
      }
    });
  }
}


var beforeFn = asyncFn({
  msg: 'Before_block',
  delay: 100,
  error: null,
});

var it1 = asyncFn({
  msg: 'It_1',
  delay: 10,
  error: null,
});

var it2 = asyncFn({
  msg: 'It_2',
  delay: 500,
  error: null,
});

var afterFn = asyncFn({
  msg: 'After_block',
  delay: 60,
  error: null,
});

describe( 'describe', function(){

  before( beforeFn );
  it( 'it1', it1 );
  it( 'it2', it2 );
  after( afterFn );


});
