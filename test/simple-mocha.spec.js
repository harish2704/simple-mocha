/* globals describe, it,  */

require( __dirname + '/../main-runner' );
var SimpleMocha = require( __dirname + '/../test-runner' );
var assert = require('assert');
var utils = require( './data/utils');
var messageLog = utils.messageLog;


describe( 'Simple before block + it s ', function(){


  describe( 'SimpleMocha instance' , function(){

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


    describe( 'rootDescribeBlock', function(){
      it( 'should have child blocks', function(){
        assert( firsDescribeBlock instanceof SimpleMocha.DescribeBlock );
      });

      describe( 'Child describeBlock', function(){
        it( 'should parse before hook', function(){
          assert( firsDescribeBlock.beforeFn );
        });


        it( 'should parse it blocks', function(){
          assert.equal( firsDescribeBlock.its.length, 2 );
          firsDescribeBlock.its.forEach( function( itBlk ){
            assert( itBlk );
            assert( itBlk.description );
            assert( itBlk.fn );
          });
        });


        it( 'should parse after blocks', function(){
          assert( firsDescribeBlock.afterFn );
        });

        it( 'should parse beforeEach block', function(){
          assert( firsDescribeBlock.beforeEachFn );
        })

        it( 'should parse afterEach block', function(){
          assert( firsDescribeBlock.afterEachFn );
        })

      });

      describe( 'second level child block', function( ){

        it( 'should have second level describeBlock', function( ){
          assert.equal( firsDescribeBlock.children.length, 1 );
          assert( firsDescribeBlock.children[0] );
        });

        var childDescribeBlock =  firsDescribeBlock.children[0];

        it( 'should parse before hook', function(){
          assert( childDescribeBlock.beforeFn );
        });


        it( 'should parse it blocks', function(){
          assert.equal( childDescribeBlock.its.length, 2 );
          childDescribeBlock.its.forEach( function( itBlk ){
            assert( itBlk );
            assert( itBlk.description );
            assert( itBlk.fn );
          });
        });


        it( 'should parse after blocks', function(){
          assert( childDescribeBlock.afterFn );
        });

        it( 'should parse beforeEach block', function(){
          assert( childDescribeBlock.beforeEachFn );
        })

        it( 'should parse afterEach block', function(){
          assert( childDescribeBlock.afterEachFn );
        })
      })


      describe( 'Running: first level block', function(){

        it( 'should run ', function( done ){
          firsDescribeBlock.run( function( err ){
            // console.log( 'messageLog', messageLog );
            done( err );
          })
        })
      })

    });
  });
})
