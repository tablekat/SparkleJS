"use strict";
var Spread_1 = require("./Spread");
exports.VectorSpread = Spread_1.VectorSpread;
exports.ScalarSpread = Spread_1.ScalarSpread;
var Vector2_1 = require("./Vector2");
exports.Vector2 = Vector2_1.Vector2;
var emitter_1 = require("./emitter");
exports.Emitter = emitter_1.Emitter;
var emitter_2 = require("./emitter");
var Vector2_2 = require("./Vector2");
function sparkle($elem) {
    new emitter_2.Emitter($elem, {
        maxParticles: 100,
        maxLife: {
            value: 1,
            spread: 0.5
        },
        velocity: {
            value: new Vector2_2.Vector2(0, -5),
            spread: new Vector2_2.Vector2(7, 2)
        },
        gravity: new Vector2_2.Vector2(0, 0.2)
    }).start();
}
exports.sparkle = sparkle;
