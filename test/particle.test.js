
var tap = require('tap');

var spread = require('../src/spread.js');

var SpreadType = spread.SpreadType;
var VectorSpread = spread.VectorSpread;
var ScalarSpread = spread.ScalarSpread;
var Vector2 = require('../src/Vector2.js').Vector2;
var Particle = require('../src/Particle.js').Particle;

var fakeSprite = {
  width: 64,
  height: 64
};
var fakeCtx = {
  canvas: {
    width: 100,
    height: 100
  },
  save: () => null,
  translate: () => null,
  rotate: () => null,
  globalAlpha: 0,
  drawImage: () => null,
  restore: () => null
};

tap.test("No spread", (childTest) => {

  childTest.end();
});
