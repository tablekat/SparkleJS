
var tap = require('tap');

var Vector2 = require('../src/Vector2.js').Vector2;

var v1 = new Vector2();
tap.equal(v1.x, 0, "No arguments should result in zero vector");
tap.equal(v1.y, 0, "No arguments should result in zero vector");

var v2 = new Vector2(3, 4);
tap.equal(v2.x, 3, "Vector has correct coordinates");
tap.equal(v2.y, 4, "Vector has correct coordinates");

var v3 = Vector2.fromPolar(3, Math.PI / 6);
tap.equal(v3.x, 3 * Math.cos(Math.PI / 6), "fromPolar");
tap.equal(v3.y, 3 * Math.sin(Math.PI / 6), "fromPolar");

(() => {
  var v = v3.clone();
  tap.notEqual(v3, v, "Clone should create new vector");
  tap.equal(v3.x, v.x, " -- but with same properties");
  tap.equal(v3.y, v.y, " -- but with same properties");
})();

(() => {
  var v = v3.copy();
  tap.notEqual(v3, v, "Copy with no arguments should clone");
  tap.equal(v3.x, v.x, " -- but with same properties");
  tap.equal(v3.y, v.y, " -- but with same properties");
})();

(() => {
  var v = new Vector2();
  v3.copy(v); // Should this be swapped around??
  tap.notEqual(v3, v, "Copy should be a different instance");
  tap.equal(v3.x, v.x, " -- but with same properties");
  tap.equal(v3.y, v.y, " -- but with same properties");
})();

tap.same(v2.toString(), "(3,4)", "toString");

(() => {
  var v = new Vector2(3, 7);
  var v_ = v.plus(v3);
  tap.notEqual(v_, v, "plus results in new instance");
  tap.equal(v3.x + 3, v_.x, "plus");
  tap.equal(v3.y + 7, v_.y, "plus");

  var v = new Vector2(3, 7).add(v3);
  tap.equal(v3.x + 3, v.x, "add");
  tap.equal(v3.y + 7, v.y, "add");
})();

(() => {
  var v = new Vector2(3, 7);
  var v_ = v.minus(v3);
  tap.notEqual(v_, v, "minus results in new instance");
  tap.equal(3 - v3.x, v_.x, "minus");
  tap.equal(7 - v3.y, v_.y, "minus");

  var v = new Vector2(3, 7).subtract(v3);
  tap.equal(3 - v3.x, v.x, "subtract");
  tap.equal(7 - v3.y, v.y, "subtract");
})();

(() => {
  var v = new Vector2(3, 7).hadamard(v3);
  tap.equal(3 * v3.x, v.x, "hadamard product");
  tap.equal(7 * v3.y, v.y, "hadamard product");
})();

tap.same(v3.length(), 3, v3.length() + " =? " + 3);
tap.equal(v2.lengthSq(), 25);

tap.equal(new Vector2(2, 7).dot(v2), 2 * 3 + 4 * 7);

function floatEqual(x, y){
  if(typeof x !== "number" || typeof y !== "number") return false;
  return x.toString().substring(0, 8) == y.toString().substring(0, 8); // ...
}

tap.assert(floatEqual(new Vector2(1, 1).normalize().y, Vector2.fromPolar(1, Math.PI / 4).y), "Normalize");
tap.assert(floatEqual(new Vector2(1, 1).normalize().x, Vector2.fromPolar(1, Math.PI / 4).x), "Normalize");
