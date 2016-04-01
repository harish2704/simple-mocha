/* globals describe, it, before, after, beforeEach, afterEach */

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

var beforeEachFn = asyncFn({
  msg: 'BeforeEach_block',
  delay: 5,
  error: null
});

var afterEachFn = asyncFn({
  msg: 'AfterEach_block',
  delay: 5,
  error: null
});


describe( 'describe', function(){

  before( beforeFn );
  beforeEach( beforeEachFn );
  afterEach( afterEachFn );
  it( 'it1', it1 );
  it( 'it2', it2 );
  after( afterFn );


});
