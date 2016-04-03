/* globals describe, it, before, after, beforeEach, afterEach */


// require( '../../index' );  // Toggle commenting to run test directly .
// var utils = require( './utils' );
var utils = require( '../test/data/utils' );


var resolvingFn = utils.resolvingFn;

var beforeFn = resolvingFn( 'Before_block' );
var it1 = resolvingFn( 'It_1' );
var it2 = resolvingFn( 'It_2' );
var afterFn = resolvingFn( 'After_block' );
var beforeEachFn = resolvingFn( 'BeforeEach_block' );
var afterEachFn = resolvingFn( 'AfterEach_block' );


describe( 'describe', function(){

  before( beforeFn );
  beforeEach( beforeEachFn );
  afterEach( afterEachFn );
  it( 'it1', it1 );
  it( 'it2', it2 );
  after( afterFn );

  describe( 'child block', function(){
    before( beforeFn );
    beforeEach( beforeEachFn );
    afterEach( afterEachFn );
    it( 'it1', it1 );
    it( 'it2', it2 );
    after( afterFn );
  });

});
