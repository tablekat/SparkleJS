"use strict";
var Vector2_1 = require("./Vector2");
(function (SpreadType) {
    SpreadType[SpreadType["Uniform"] = 0] = "Uniform";
    SpreadType[SpreadType["Normal"] = 1] = "Normal";
})(exports.SpreadType || (exports.SpreadType = {}));
var SpreadType = exports.SpreadType;
var VectorSpread = (function () {
    function VectorSpread(value, spread, spreadType) {
        if (value instanceof Vector2_1.Vector2 || !value) {
            this.value = value || new Vector2_1.Vector2(0, 0);
            this.spread = spread || new Vector2_1.Vector2(0, 0);
            this.type = spreadType || SpreadType.Normal;
        }
        else {
            this.value = value.value || new Vector2_1.Vector2(0, 0);
            this.spread = value.spread || new Vector2_1.Vector2(0, 0);
            this.type = value.type || SpreadType.Normal;
        }
    }
    VectorSpread.prototype.sample = function () {
        var randR, randTh;
        randTh = Math.PI * 2 * Math.random();
        if (this.type == SpreadType.Uniform) {
            randR = Math.random();
        }
        else {
            randR = ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
        }
        var randV = Vector2_1.Vector2.fromPolar(randR, randTh);
        return randV.hadamard(this.spread).add(this.value);
    };
    VectorSpread.prototype.add = function (spr) {
        this.value.add(spr.value);
    };
    return VectorSpread;
}());
exports.VectorSpread = VectorSpread;
var ScalarSpread = (function () {
    function ScalarSpread(value, spread, spreadType) {
        if (typeof value == "number" || !value) {
            this.value = value || 0;
            this.spread = spread || 0;
            this.type = spreadType || SpreadType.Normal;
        }
        else {
            this.value = value.value;
            this.spread = value.spread;
            this.type = value.type || SpreadType.Normal;
        }
    }
    ScalarSpread.prototype.sample = function () {
        var randR;
        if (this.type == SpreadType.Uniform) {
            randR = Math.random();
        }
        else {
            randR = ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
        }
        return randR * this.spread + this.value;
    };
    ScalarSpread.prototype.add = function (spr) {
        this.value += spr;
    };
    return ScalarSpread;
}());
exports.ScalarSpread = ScalarSpread;
