/* globals describe, it,  */

var SimpleMocha = require( __dirname + '/../index-v1' );

var assert = require('assert');


describe( 'Simple before block + it s ', function(){

  describe( 'should parse simple test file' , function(){

    var runner = SimpleMocha.load( __dirname + '/data/dummy.spec.js' );

    it( 'should load', function(){
      assert( runner );
    })

    var describeBlock = runner.rootDescribeBlock;

    it( 'should have a root describe block', function(){
      assert( describeBlock );
      assert( describeBlock instanceof SimpleMocha.DescribeBlock );
      assert.equal( describeBlock.children.length, 1 );
    });

    var firsDescribeBlock = describeBlock.children[0];


    it( 'rootDescribeBlock should have child blocks', function(){
      assert( firsDescribeBlock instanceof SimpleMocha.DescribeBlock );
    });

    it( 'child describeBlock should parse before hook', function(){
      assert( firsDescribeBlock.beforeFn );
    });



    it( 'child describeBlock should parse it blocks', function(){
      assert.equal( firsDescribeBlock.its.length, 2 );
      firsDescribeBlock.its.forEach( function( itBlk ){
        assert( itBlk );
        assert( itBlk.description );
        assert( itBlk.fn );
      });
    });



  });
})
