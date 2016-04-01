
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

function rand(){
  return  parseInt( Math.random()*1000 ) % 27;
}

function resolvingFn( msg ){
  return asyncFn({
    msg: msg,
    delay: rand(),
    error: null,
  });
}

function rejectingFn( msg ){
  return asyncFn({
    msg: msg,
    delay: rand(),
    error: new Error( 'Reject:' + msg ),
  });
}

function throwingFn( msg ){
  return asyncFn({
    msg: msg,
    delay: rand(),
    error: new Error( 'Throw:' + msg ),
    isThrow: true,
  });
}


module.exports = {
  messageLog: messageLog,
  pr: pr,
  asyncFn: asyncFn,
  resolvingFn: resolvingFn,
  rejectingFn: rejectingFn,
  throwingFn: throwingFn,
};
