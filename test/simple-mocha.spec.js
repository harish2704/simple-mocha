/* globals describe, it,  */

var SimpleMocha = require( __dirname + '/../index-v1' );

var assert = require('assert');


describe( 'Simple before block + it s ', function(){

  it( 'should parse simple test file' , function( done ){

    var runner = SimpleMocha.load( __dirname + '/data/dummy.spec.js' );

    assert( runner );

    var describeBlock = runner.rootDescribeBlock;

    assert( describeBlock );
    assert( describeBlock instanceof SimpleMocha.DescribeBlock );
    assert.equal( describeBlock.children.length, 1 );

    var firsDescribeBlock = describeBlock.children[0];


    assert( firsDescribeBlock instanceof SimpleMocha.DescribeBlock );
    assert( firsDescribeBlock.beforeFn );

    done();
  });
})
