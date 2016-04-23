
var tap = require('tap');

var spread = require('../src/spread.js');

var SpreadType = spread.SpreadType;
var VectorSpread = spread.VectorSpread;
var ScalarSpread = spread.ScalarSpread;

function sample100Times(spread){
  var a = [];
  for(var i=0; i < 100; ++i){
    a.push(spread.sample());
  }
  return a;
}

tap.test("ScalarSpread - number arg - no spread", (childTest) => {

  var spread = new ScalarSpread(7);
  for(var i=0; i < 100; ++i){
    var v = spread.sample();
    if(v !== 7){
      childTest.assert(false, "All samples should equal the argument value");
      break;
    }
  }

  childTest.end();
});

tap.test("ScalarSpread - number arg - number spread", (childTest) => {

  var spread = new ScalarSpread(0, 3);
  var outerCount = 0;
  var innerCount = 0;

  for(var i=0; i < 100; ++i){
    var v = spread.sample();
    if(v < -1 || v > 1){
      outerCount++;
    }else{
      innerCount++;
    }
  }

  // It would be more like 21 to 79. But keep the buffer range large so the test doesn't just randomly fail.
  childTest.assert(innerCount > outerCount + 20, "Should be more samples towards the center with Gaussian spread");

  childTest.end();
});

tap.test("ScalarSpread - custom", (childTest) => {

  var spread = new ScalarSpread({ custom: () => Math.random() < 0.5 ? 3 : 5 });

  for(var i=0; i < 100; ++i){
    var v = spread.sample();
    if(v !== 3 && v !== 5){
      childTest.assert(false, "All samples should come from the custom spread function");
      break;
    }
  }

  childTest.end();
});

tap.test("ScalarSpread - number arg - number spread - Uniform distribution", (childTest) => {

  var spread = new ScalarSpread(0, 2, SpreadType.Uniform);
  childTest.equal(spread.type, SpreadType.Uniform);
  var q1 = 0, q2 = 0, q3 = 0, q4 = 0;

  for(var i=0; i < 100; ++i){
    var v = spread.sample();
    if(v < 0){
      if(v < -1) q1++
      else q2++;
    }else{
      if(v > 1) q4++
      else q3++;
    }
  }

  childTest.assert(Math.abs(q1 - q2) < 20, "Should be approximately the same amount of values across the range with Uniform distribution");
  childTest.assert(Math.abs(q2 - q3) < 20, "Should be approximately the same amount of values across the range with Uniform distribution");
  childTest.assert(Math.abs(q3 - q4) < 20, "Should be approximately the same amount of values across the range with Uniform distribution");
  childTest.assert(Math.abs(q1 - q4) < 20, "Should be approximately the same amount of values across the range with Uniform distribution");

  childTest.end();
});
