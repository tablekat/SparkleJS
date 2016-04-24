
var tap = require('tap');

var spread = require('../src/spread.js');

var SpreadType = spread.SpreadType;
var VectorSpread = spread.VectorSpread;
var ScalarSpread = spread.ScalarSpread;
var Vector2 = require('../src/Vector2.js').Vector2;



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
  childTest.equal(spread.type, SpreadType.Normal);

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


tap.test("VectorSpread - vector arg - no spread", (childTest) => {

  var spread = new VectorSpread(new Vector2(3, 4));

  for(var i=0; i < 100; ++i){
    var v = spread.sample();
    if(v.x != 3 || v.y != 4){
      childTest.assert(false, "All samples should equal the argument value");
      break;
    }
  }

  childTest.end();
});

tap.test("VectorSpread - vector arg - vector spread", (childTest) => {

  var spread = new VectorSpread(new Vector2(), new Vector2(3, 3));
  var outerCount = 0;
  var innerCount = 0;

  for(var i=0; i < 100; ++i){
    var v = spread.sample().length();
    if(v < -1 || v > 1){
      outerCount++;
    }else{
      innerCount++;
    }
  }

  // It would be more like 21 to 79. But keep the buffer range large so the test doesn't just randomly fail.
  childTest.assert(innerCount > outerCount + 30, "Should be more samples towards the center with Gaussian spread");

  childTest.end();
});

tap.test("VectorSpread - vector arg - vector spread - Uniform distribution", (childTest) => {

  var spread = new VectorSpread(new Vector2(), new Vector2(1, 1), SpreadType.Uniform);
  childTest.equal(spread.type, SpreadType.Uniform);

  var q1 = 0, q2 = 0, q3 = 0, q4 = 0;
  var r1 = 1 / 2, r2 = 1 / Math.sqrt(2), r3 = Math.sqrt(3 / 4); // These radii should divide the unit circle into 4 equal area disks

  for(var i=0; i < 100; ++i){
    var v = spread.sample().length();

    if(v < r1){
      q1++
    }else if(v < r2){
      q2++;
    }else if(v < r3){
      q3++;
    }else{
      q4++;
    }
  }

  //childTest.assert(false, `${q1} | ${q2} | ${q3} | ${q4}`);

  childTest.assert(Math.abs(q1 - q2) < 20, "Should be approximately the same amount of values across the range with Uniform distribution", { todo: true });
  childTest.assert(Math.abs(q2 - q3) < 20, "Should be approximately the same amount of values across the range with Uniform distribution", { todo: true });
  childTest.assert(Math.abs(q3 - q4) < 20, "Should be approximately the same amount of values across the range with Uniform distribution", { todo: true });
  childTest.assert(Math.abs(q1 - q4) < 20, "Should be approximately the same amount of values across the range with Uniform distribution", { todo: true });

  childTest.end();
});
