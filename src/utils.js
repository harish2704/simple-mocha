

var pr = console.log;

var INDENT = '  ';
var STATUS_FLAG = {
  true  : '\u001b[32m\u001b[1m' +  '✔' + '\u001b[22m\u001b[39m',
  false : '\u001b[31m\u001b[1m' + '✗' + '\u001b[22m\u001b[39m',
};



function getIndent( level ){
  return INDENT.repeat( level );
}


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



module.exports = {
  mkAsyncFn: mkAsyncFn,
  print: print,
  pr: pr,
  getIndent: getIndent,
}
