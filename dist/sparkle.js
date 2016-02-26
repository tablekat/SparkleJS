(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Sparkle = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
})();
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
})();
exports.ScalarSpread = ScalarSpread;

},{"./Vector2":2}],2:[function(require,module,exports){
var Vector2 = (function () {
    function Vector2(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    Vector2.fromPolar = function (r, th) {
        return new Vector2(r * Math.cos(th), r * Math.sin(th));
    };
    Vector2.prototype.copy = function (v) {
        if (v && v.x && v.y) {
            v.x = this.x;
            v.y = this.y;
            return this;
        }
        else {
            return this.clone();
        }
    };
    Vector2.prototype.clone = function () {
        return new Vector2(this.x, this.y);
    };
    Vector2.prototype.toString = function () {
        return "(" + this.x + "," + this.y + ")";
    };
    Vector2.prototype.add = function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    };
    Vector2.prototype.plus = function (v) {
        var v2 = this.clone();
        v2.x += v.x;
        v2.y += v.y;
        return v2;
    };
    Vector2.prototype.subtract = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };
    Vector2.prototype.minus = function (v) {
        var v2 = this.clone();
        v2.x -= v.x;
        v2.y -= v.y;
        return v2;
    };
    Vector2.prototype.mult = function (x, y) {
        if (x instanceof Vector2) {
            this.x *= x.x;
            this.y *= x.y;
        }
        else {
            this.x *= x;
            this.y *= typeof y === "number" ? y : x;
        }
        return this;
    };
    Vector2.prototype.hadamard = function (vec) {
        this.x *= vec.x;
        this.y *= vec.y;
        return this;
    };
    Vector2.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Vector2.prototype.lengthSq = function () {
        return this.x * this.x + this.y * this.y;
    };
    Vector2.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y;
    };
    Vector2.prototype.dist = function (v) {
        return new Vector2(this.x - v.x, this.y - v.y).length();
    };
    Vector2.prototype.normalize = function () {
        var length = this.length();
        this.x /= length;
        this.y /= length;
        return this;
    };
    return Vector2;
})();
exports.Vector2 = Vector2;

},{}],3:[function(require,module,exports){
var particleSystem_1 = require("./particleSystem");
var Emitter = (function () {
    function Emitter(domElem, args) {
        this.particleSystem = new particleSystem_1.ParticleSystem(args);
        this.domElem = domElem;
        this.rate = args.rate || 16;
        this.onEmitterDeath = args.onEmitterDeath;
    }
    Emitter.prototype.start = function () {
        var _this = this;
        this.interval = setInterval(function () { return _this.update(); }, this.rate);
        return this;
    };
    Emitter.prototype.stop = function () {
        clearInterval(this.interval);
        return this;
    };
    Emitter.prototype.update = function () {
        var dt = this.rate / 1000;
        var offset = this.domElem.offset();
        var offsetX = offset.left + this.domElem.outerWidth() / 2;
        var offsetY = offset.top + this.domElem.outerHeight() / 2;
        this.particleSystem.update(dt, offsetX, offsetY);
        if (!this.particleSystem.alive) {
            this.stop();
            if (typeof this.onEmitterDeath === "function")
                this.onEmitterDeath();
        }
    };
    return Emitter;
})();
exports.Emitter = Emitter;

},{"./particleSystem":5}],4:[function(require,module,exports){
var Vector2_1 = require("./Vector2");
var Particle = (function () {
    function Particle(args) {
        this.accelerationField = args.accelerationField;
        this.position = args.position ? args.position.clone() : new Vector2_1.Vector2();
        this.velocity = args.velocity ? args.velocity.clone() : new Vector2_1.Vector2();
        this.acceleration = args.acceleration ? args.acceleration.clone() : new Vector2_1.Vector2();
        this.higherOrder = [];
        if (Array.isArray(args.higherOrder)) {
            for (var i = 0; i < args.higherOrder.length; ++i) {
                this.higherOrder.push(args.higherOrder[i] ? args.higherOrder[i].clone() : new Vector2_1.Vector2());
            }
        }
        this.maxLife = typeof args.maxLife == "number" ? args.maxLife : 1;
        this.life = 0;
        this.alive = true;
        this.elem = null;
        this.createElement();
    }
    Particle.prototype.update = function (dt) {
        this.life += dt;
        if (this.maxLife <= this.life) {
            this.alive = false;
            this.elem && this.elem.remove();
            this.elem = null;
        }
        if (this.accelerationField) {
            this.updateByField(dt);
        }
        else {
            this.updateByTaylor(dt);
        }
    };
    Particle.prototype.updateElement = function (offsetX, offsetY) {
        if (!this.alive || !this.elem)
            return;
        this.elem.css("left", this.position.x + offsetX);
        this.elem.css("top", this.position.y + offsetY);
    };
    Particle.prototype.updateByField = function (dt) {
        var accel = this.accelerationField(this.position);
        this.velocity.add(accel.sample());
        this.position.add(this.velocity);
    };
    Particle.prototype.updateByTaylor = function (dt) {
        var del = null;
        for (var i = this.higherOrder.length - 1; i >= 0; ++i) {
            if (del) {
                this.higherOrder[i].add(del);
            }
            del = this.higherOrder[i];
        }
        if (del) {
            this.acceleration.add(del);
        }
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
    };
    Particle.prototype.createElement = function () {
        var elem = $("<div></div>");
        elem.css("position", "absolute");
        this.dustElement(elem);
        this.blendModeElement(elem);
        $("body").append(elem);
        this.elem = elem;
    };
    Particle.prototype.circleElement = function (elem) {
        var radius = 2.5;
        elem
            .css("width", (2 * radius) + "px")
            .css("height", (2 * radius) + "px")
            .css("border-radius", (2 * radius) + "px")
            .css("background", "red");
    };
    Particle.prototype.dustElement = function (elem) {
        var color = { r: 0, g: 0, b: 0 };
        var ccolor = "rgba(0, 0, 0, 1)";
        var radius = 3.5;
        elem
            .css("width", (2 * radius) + "px")
            .css("height", (2 * radius) + "px")
            .css("border-radius", (2 * radius) + "px")
            .css("background", "red")
            .css("background", "radial-gradient(ellipse at center, " + ccolor + " 0%,rgba(0,0,0,0) 70%)");
    };
    Particle.prototype.fireElement = function (elem) {
        var radius = 9;
        elem
            .css("width", (2 * radius) + "px")
            .css("height", (2 * radius) + "px")
            .css("border-radius", (2 * radius) + "px")
            .css("background", "red")
            .css("background", "radial-gradient(ellipse at center, rgba(249,249,49,1) 0%,rgba(252,47,47,0.62) 31%,rgba(244,57,51,0) 70%)");
    };
    Particle.prototype.blendModeElement = function (elem) {
        elem
            .css("background-blend-mode", "multiply");
    };
    return Particle;
})();
exports.Particle = Particle;

},{"./Vector2":2}],5:[function(require,module,exports){
var particle_1 = require("./particle");
var Spread_1 = require("./Spread");
var ParticleSystem = (function () {
    function ParticleSystem(args) {
        this.life = 0;
        this.lastParticleAdded = 0;
        this.dying = false;
        this.alive = true;
        this.config = args;
        this.particles = [];
        this.maxLife = args.maxLife ? new Spread_1.ScalarSpread(args.maxLife) : new Spread_1.ScalarSpread(5);
        this.maxParticles = args.maxParticles || 100;
        this.emitterMaxLife = args.emitterMaxLife ? args.emitterMaxLife : null;
        this.accelerationField = args.accelerationField;
        this.position = new Spread_1.VectorSpread(args.position);
        this.velocity = new Spread_1.VectorSpread(args.velocity);
        this.acceleration = new Spread_1.VectorSpread(args.acceleration);
        this.higherOrder = [];
        if (args.gravity)
            this.acceleration.value.add(args.gravity);
        if (Array.isArray(args.higherOrder)) {
            for (var i = 0; i < args.higherOrder.length; ++i) {
                this.higherOrder.push(new Spread_1.VectorSpread(args.higherOrder[i]));
            }
        }
    }
    ParticleSystem.prototype.update = function (dt, offsetX, offsetY) {
        this.life += dt;
        if (!this.alive)
            return;
        if (this.dying && this.particles.length == 0) {
            this.alive = false;
            return;
        }
        if (typeof this.emitterMaxLife === "number" && this.emitterMaxLife > 0 && this.life >= this.emitterMaxLife) {
            this.dying = true;
        }
        var newParticles = [];
        for (var i = 0; i < this.particles.length; ++i) {
            var p = this.particles[i];
            p.update(dt);
            if (!p.alive)
                continue;
            p.updateElement(offsetX, offsetY);
            newParticles.push(p);
        }
        var cycleDuration = this.maxLife.value * this.maxParticles;
        if (!this.dying && newParticles.length < this.maxParticles) {
            newParticles.push(new particle_1.Particle({
                maxLife: this.maxLife.sample(),
                position: this.position.sample(),
                velocity: this.velocity && this.velocity.sample(),
                acceleration: this.acceleration && this.acceleration.sample(),
                higherOrder: this.higherOrder && this.higherOrder.map(function (x) { return x.sample(); }),
                accelerationField: this.accelerationField
            }));
        }
        this.particles = newParticles;
    };
    return ParticleSystem;
})();
exports.ParticleSystem = ParticleSystem;

},{"./Spread":1,"./particle":4}],6:[function(require,module,exports){
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

},{"./Spread":1,"./Vector2":2,"./emitter":3}]},{},[6])(6)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9TcHJlYWQuanMiLCJzcmMvVmVjdG9yMi5qcyIsInNyYy9lbWl0dGVyLmpzIiwic3JjL3BhcnRpY2xlLmpzIiwic3JjL3BhcnRpY2xlU3lzdGVtLmpzIiwic3JjL3NwYXJrbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgVmVjdG9yMl8xID0gcmVxdWlyZShcIi4vVmVjdG9yMlwiKTtcclxuKGZ1bmN0aW9uIChTcHJlYWRUeXBlKSB7XHJcbiAgICBTcHJlYWRUeXBlW1NwcmVhZFR5cGVbXCJVbmlmb3JtXCJdID0gMF0gPSBcIlVuaWZvcm1cIjtcclxuICAgIFNwcmVhZFR5cGVbU3ByZWFkVHlwZVtcIk5vcm1hbFwiXSA9IDFdID0gXCJOb3JtYWxcIjtcclxufSkoZXhwb3J0cy5TcHJlYWRUeXBlIHx8IChleHBvcnRzLlNwcmVhZFR5cGUgPSB7fSkpO1xyXG52YXIgU3ByZWFkVHlwZSA9IGV4cG9ydHMuU3ByZWFkVHlwZTtcclxudmFyIFZlY3RvclNwcmVhZCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBWZWN0b3JTcHJlYWQodmFsdWUsIHNwcmVhZCwgc3ByZWFkVHlwZSkge1xyXG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFZlY3RvcjJfMS5WZWN0b3IyIHx8ICF2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWUgfHwgbmV3IFZlY3RvcjJfMS5WZWN0b3IyKDAsIDApO1xyXG4gICAgICAgICAgICB0aGlzLnNwcmVhZCA9IHNwcmVhZCB8fCBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoMCwgMCk7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHNwcmVhZFR5cGUgfHwgU3ByZWFkVHlwZS5Ob3JtYWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWUudmFsdWUgfHwgbmV3IFZlY3RvcjJfMS5WZWN0b3IyKDAsIDApO1xyXG4gICAgICAgICAgICB0aGlzLnNwcmVhZCA9IHZhbHVlLnNwcmVhZCB8fCBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoMCwgMCk7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHZhbHVlLnR5cGUgfHwgU3ByZWFkVHlwZS5Ob3JtYWw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgVmVjdG9yU3ByZWFkLnByb3RvdHlwZS5zYW1wbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHJhbmRSLCByYW5kVGg7XHJcbiAgICAgICAgcmFuZFRoID0gTWF0aC5QSSAqIDIgKiBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT0gU3ByZWFkVHlwZS5Vbmlmb3JtKSB7XHJcbiAgICAgICAgICAgIHJhbmRSID0gTWF0aC5yYW5kb20oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJhbmRSID0gKChNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkpIC0gMykgLyAzO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcmFuZFYgPSBWZWN0b3IyXzEuVmVjdG9yMi5mcm9tUG9sYXIocmFuZFIsIHJhbmRUaCk7XHJcbiAgICAgICAgcmV0dXJuIHJhbmRWLmhhZGFtYXJkKHRoaXMuc3ByZWFkKS5hZGQodGhpcy52YWx1ZSk7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yU3ByZWFkLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoc3ByKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZS5hZGQoc3ByLnZhbHVlKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gVmVjdG9yU3ByZWFkO1xyXG59KSgpO1xyXG5leHBvcnRzLlZlY3RvclNwcmVhZCA9IFZlY3RvclNwcmVhZDtcclxudmFyIFNjYWxhclNwcmVhZCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBTY2FsYXJTcHJlYWQodmFsdWUsIHNwcmVhZCwgc3ByZWFkVHlwZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gXCJudW1iZXJcIiB8fCAhdmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlIHx8IDA7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByZWFkID0gc3ByZWFkIHx8IDA7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHNwcmVhZFR5cGUgfHwgU3ByZWFkVHlwZS5Ob3JtYWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWUudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByZWFkID0gdmFsdWUuc3ByZWFkO1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSB2YWx1ZS50eXBlIHx8IFNwcmVhZFR5cGUuTm9ybWFsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFNjYWxhclNwcmVhZC5wcm90b3R5cGUuc2FtcGxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciByYW5kUjtcclxuICAgICAgICBpZiAodGhpcy50eXBlID09IFNwcmVhZFR5cGUuVW5pZm9ybSkge1xyXG4gICAgICAgICAgICByYW5kUiA9IE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByYW5kUiA9ICgoTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpKSAtIDMpIC8gMztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJhbmRSICogdGhpcy5zcHJlYWQgKyB0aGlzLnZhbHVlO1xyXG4gICAgfTtcclxuICAgIFNjYWxhclNwcmVhZC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHNwcikge1xyXG4gICAgICAgIHRoaXMudmFsdWUgKz0gc3ByO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBTY2FsYXJTcHJlYWQ7XHJcbn0pKCk7XHJcbmV4cG9ydHMuU2NhbGFyU3ByZWFkID0gU2NhbGFyU3ByZWFkO1xyXG4iLCJ2YXIgVmVjdG9yMiA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBWZWN0b3IyKHgsIHkpIHtcclxuICAgICAgICB0aGlzLnggPSB4IHx8IDA7XHJcbiAgICAgICAgdGhpcy55ID0geSB8fCAwO1xyXG4gICAgfVxyXG4gICAgVmVjdG9yMi5mcm9tUG9sYXIgPSBmdW5jdGlvbiAociwgdGgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIociAqIE1hdGguY29zKHRoKSwgciAqIE1hdGguc2luKHRoKSk7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgaWYgKHYgJiYgdi54ICYmIHYueSkge1xyXG4gICAgICAgICAgICB2LnggPSB0aGlzLng7XHJcbiAgICAgICAgICAgIHYueSA9IHRoaXMueTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54LCB0aGlzLnkpO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBcIihcIiArIHRoaXMueCArIFwiLFwiICsgdGhpcy55ICsgXCIpXCI7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICB0aGlzLnggKz0gdi54O1xyXG4gICAgICAgIHRoaXMueSArPSB2Lnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUucGx1cyA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgdmFyIHYyID0gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIHYyLnggKz0gdi54O1xyXG4gICAgICAgIHYyLnkgKz0gdi55O1xyXG4gICAgICAgIHJldHVybiB2MjtcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5zdWJ0cmFjdCA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgdGhpcy54IC09IHYueDtcclxuICAgICAgICB0aGlzLnkgLT0gdi55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLm1pbnVzID0gZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICB2YXIgdjIgPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgdjIueCAtPSB2Lng7XHJcbiAgICAgICAgdjIueSAtPSB2Lnk7XHJcbiAgICAgICAgcmV0dXJuIHYyO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLm11bHQgPSBmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICAgIGlmICh4IGluc3RhbmNlb2YgVmVjdG9yMikge1xyXG4gICAgICAgICAgICB0aGlzLnggKj0geC54O1xyXG4gICAgICAgICAgICB0aGlzLnkgKj0geC55O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ICo9IHg7XHJcbiAgICAgICAgICAgIHRoaXMueSAqPSB0eXBlb2YgeSA9PT0gXCJudW1iZXJcIiA/IHkgOiB4O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5oYWRhbWFyZCA9IGZ1bmN0aW9uICh2ZWMpIHtcclxuICAgICAgICB0aGlzLnggKj0gdmVjLng7XHJcbiAgICAgICAgdGhpcy55ICo9IHZlYy55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSk7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUubGVuZ3RoU3EgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueTtcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbiAodikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKiB2LnggKyB0aGlzLnkgKiB2Lnk7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUuZGlzdCA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCAtIHYueCwgdGhpcy55IC0gdi55KS5sZW5ndGgoKTtcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoKCk7XHJcbiAgICAgICAgdGhpcy54IC89IGxlbmd0aDtcclxuICAgICAgICB0aGlzLnkgLz0gbGVuZ3RoO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBWZWN0b3IyO1xyXG59KSgpO1xyXG5leHBvcnRzLlZlY3RvcjIgPSBWZWN0b3IyO1xyXG4iLCJ2YXIgcGFydGljbGVTeXN0ZW1fMSA9IHJlcXVpcmUoXCIuL3BhcnRpY2xlU3lzdGVtXCIpO1xyXG52YXIgRW1pdHRlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBFbWl0dGVyKGRvbUVsZW0sIGFyZ3MpIHtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlU3lzdGVtID0gbmV3IHBhcnRpY2xlU3lzdGVtXzEuUGFydGljbGVTeXN0ZW0oYXJncyk7XHJcbiAgICAgICAgdGhpcy5kb21FbGVtID0gZG9tRWxlbTtcclxuICAgICAgICB0aGlzLnJhdGUgPSBhcmdzLnJhdGUgfHwgMTY7XHJcbiAgICAgICAgdGhpcy5vbkVtaXR0ZXJEZWF0aCA9IGFyZ3Mub25FbWl0dGVyRGVhdGg7XHJcbiAgICB9XHJcbiAgICBFbWl0dGVyLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy51cGRhdGUoKTsgfSwgdGhpcy5yYXRlKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBFbWl0dGVyLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgRW1pdHRlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBkdCA9IHRoaXMucmF0ZSAvIDEwMDA7XHJcbiAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMuZG9tRWxlbS5vZmZzZXQoKTtcclxuICAgICAgICB2YXIgb2Zmc2V0WCA9IG9mZnNldC5sZWZ0ICsgdGhpcy5kb21FbGVtLm91dGVyV2lkdGgoKSAvIDI7XHJcbiAgICAgICAgdmFyIG9mZnNldFkgPSBvZmZzZXQudG9wICsgdGhpcy5kb21FbGVtLm91dGVySGVpZ2h0KCkgLyAyO1xyXG4gICAgICAgIHRoaXMucGFydGljbGVTeXN0ZW0udXBkYXRlKGR0LCBvZmZzZXRYLCBvZmZzZXRZKTtcclxuICAgICAgICBpZiAoIXRoaXMucGFydGljbGVTeXN0ZW0uYWxpdmUpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5vbkVtaXR0ZXJEZWF0aCA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkVtaXR0ZXJEZWF0aCgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gRW1pdHRlcjtcclxufSkoKTtcclxuZXhwb3J0cy5FbWl0dGVyID0gRW1pdHRlcjtcclxuIiwidmFyIFZlY3RvcjJfMSA9IHJlcXVpcmUoXCIuL1ZlY3RvcjJcIik7XHJcbnZhciBQYXJ0aWNsZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBQYXJ0aWNsZShhcmdzKSB7XHJcbiAgICAgICAgdGhpcy5hY2NlbGVyYXRpb25GaWVsZCA9IGFyZ3MuYWNjZWxlcmF0aW9uRmllbGQ7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IGFyZ3MucG9zaXRpb24gPyBhcmdzLnBvc2l0aW9uLmNsb25lKCkgOiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoKTtcclxuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gYXJncy52ZWxvY2l0eSA/IGFyZ3MudmVsb2NpdHkuY2xvbmUoKSA6IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigpO1xyXG4gICAgICAgIHRoaXMuYWNjZWxlcmF0aW9uID0gYXJncy5hY2NlbGVyYXRpb24gPyBhcmdzLmFjY2VsZXJhdGlvbi5jbG9uZSgpIDogbmV3IFZlY3RvcjJfMS5WZWN0b3IyKCk7XHJcbiAgICAgICAgdGhpcy5oaWdoZXJPcmRlciA9IFtdO1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGFyZ3MuaGlnaGVyT3JkZXIpKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5oaWdoZXJPcmRlci5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWdoZXJPcmRlci5wdXNoKGFyZ3MuaGlnaGVyT3JkZXJbaV0gPyBhcmdzLmhpZ2hlck9yZGVyW2ldLmNsb25lKCkgOiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5tYXhMaWZlID0gdHlwZW9mIGFyZ3MubWF4TGlmZSA9PSBcIm51bWJlclwiID8gYXJncy5tYXhMaWZlIDogMTtcclxuICAgICAgICB0aGlzLmxpZmUgPSAwO1xyXG4gICAgICAgIHRoaXMuYWxpdmUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZWxlbSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KCk7XHJcbiAgICB9XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGR0KSB7XHJcbiAgICAgICAgdGhpcy5saWZlICs9IGR0O1xyXG4gICAgICAgIGlmICh0aGlzLm1heExpZmUgPD0gdGhpcy5saWZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWxpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5lbGVtICYmIHRoaXMuZWxlbS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5lbGVtID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuYWNjZWxlcmF0aW9uRmllbGQpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVCeUZpZWxkKGR0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQnlUYXlsb3IoZHQpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUudXBkYXRlRWxlbWVudCA9IGZ1bmN0aW9uIChvZmZzZXRYLCBvZmZzZXRZKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmFsaXZlIHx8ICF0aGlzLmVsZW0pXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLmVsZW0uY3NzKFwibGVmdFwiLCB0aGlzLnBvc2l0aW9uLnggKyBvZmZzZXRYKTtcclxuICAgICAgICB0aGlzLmVsZW0uY3NzKFwidG9wXCIsIHRoaXMucG9zaXRpb24ueSArIG9mZnNldFkpO1xyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS51cGRhdGVCeUZpZWxkID0gZnVuY3Rpb24gKGR0KSB7XHJcbiAgICAgICAgdmFyIGFjY2VsID0gdGhpcy5hY2NlbGVyYXRpb25GaWVsZCh0aGlzLnBvc2l0aW9uKTtcclxuICAgICAgICB0aGlzLnZlbG9jaXR5LmFkZChhY2NlbC5zYW1wbGUoKSk7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbi5hZGQodGhpcy52ZWxvY2l0eSk7XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGUucHJvdG90eXBlLnVwZGF0ZUJ5VGF5bG9yID0gZnVuY3Rpb24gKGR0KSB7XHJcbiAgICAgICAgdmFyIGRlbCA9IG51bGw7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IHRoaXMuaGlnaGVyT3JkZXIubGVuZ3RoIC0gMTsgaSA+PSAwOyArK2kpIHtcclxuICAgICAgICAgICAgaWYgKGRlbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWdoZXJPcmRlcltpXS5hZGQoZGVsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkZWwgPSB0aGlzLmhpZ2hlck9yZGVyW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWNjZWxlcmF0aW9uLmFkZChkZWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnZlbG9jaXR5LmFkZCh0aGlzLmFjY2VsZXJhdGlvbik7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbi5hZGQodGhpcy52ZWxvY2l0eSk7XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGUucHJvdG90eXBlLmNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGVsZW0gPSAkKFwiPGRpdj48L2Rpdj5cIik7XHJcbiAgICAgICAgZWxlbS5jc3MoXCJwb3NpdGlvblwiLCBcImFic29sdXRlXCIpO1xyXG4gICAgICAgIHRoaXMuZHVzdEVsZW1lbnQoZWxlbSk7XHJcbiAgICAgICAgdGhpcy5ibGVuZE1vZGVFbGVtZW50KGVsZW0pO1xyXG4gICAgICAgICQoXCJib2R5XCIpLmFwcGVuZChlbGVtKTtcclxuICAgICAgICB0aGlzLmVsZW0gPSBlbGVtO1xyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jaXJjbGVFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgICB2YXIgcmFkaXVzID0gMi41O1xyXG4gICAgICAgIGVsZW1cclxuICAgICAgICAgICAgLmNzcyhcIndpZHRoXCIsICgyICogcmFkaXVzKSArIFwicHhcIilcclxuICAgICAgICAgICAgLmNzcyhcImhlaWdodFwiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJib3JkZXItcmFkaXVzXCIsICgyICogcmFkaXVzKSArIFwicHhcIilcclxuICAgICAgICAgICAgLmNzcyhcImJhY2tncm91bmRcIiwgXCJyZWRcIik7XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGUucHJvdG90eXBlLmR1c3RFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgICB2YXIgY29sb3IgPSB7IHI6IDAsIGc6IDAsIGI6IDAgfTtcclxuICAgICAgICB2YXIgY2NvbG9yID0gXCJyZ2JhKDAsIDAsIDAsIDEpXCI7XHJcbiAgICAgICAgdmFyIHJhZGl1cyA9IDMuNTtcclxuICAgICAgICBlbGVtXHJcbiAgICAgICAgICAgIC5jc3MoXCJ3aWR0aFwiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJoZWlnaHRcIiwgKDIgKiByYWRpdXMpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwiYm9yZGVyLXJhZGl1c1wiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJiYWNrZ3JvdW5kXCIsIFwicmVkXCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJiYWNrZ3JvdW5kXCIsIFwicmFkaWFsLWdyYWRpZW50KGVsbGlwc2UgYXQgY2VudGVyLCBcIiArIGNjb2xvciArIFwiIDAlLHJnYmEoMCwwLDAsMCkgNzAlKVwiKTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuZmlyZUVsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbSkge1xyXG4gICAgICAgIHZhciByYWRpdXMgPSA5O1xyXG4gICAgICAgIGVsZW1cclxuICAgICAgICAgICAgLmNzcyhcIndpZHRoXCIsICgyICogcmFkaXVzKSArIFwicHhcIilcclxuICAgICAgICAgICAgLmNzcyhcImhlaWdodFwiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJib3JkZXItcmFkaXVzXCIsICgyICogcmFkaXVzKSArIFwicHhcIilcclxuICAgICAgICAgICAgLmNzcyhcImJhY2tncm91bmRcIiwgXCJyZWRcIilcclxuICAgICAgICAgICAgLmNzcyhcImJhY2tncm91bmRcIiwgXCJyYWRpYWwtZ3JhZGllbnQoZWxsaXBzZSBhdCBjZW50ZXIsIHJnYmEoMjQ5LDI0OSw0OSwxKSAwJSxyZ2JhKDI1Miw0Nyw0NywwLjYyKSAzMSUscmdiYSgyNDQsNTcsNTEsMCkgNzAlKVwiKTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuYmxlbmRNb2RlRWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtKSB7XHJcbiAgICAgICAgZWxlbVxyXG4gICAgICAgICAgICAuY3NzKFwiYmFja2dyb3VuZC1ibGVuZC1tb2RlXCIsIFwibXVsdGlwbHlcIik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFBhcnRpY2xlO1xyXG59KSgpO1xyXG5leHBvcnRzLlBhcnRpY2xlID0gUGFydGljbGU7XHJcbiIsInZhciBwYXJ0aWNsZV8xID0gcmVxdWlyZShcIi4vcGFydGljbGVcIik7XHJcbnZhciBTcHJlYWRfMSA9IHJlcXVpcmUoXCIuL1NwcmVhZFwiKTtcclxudmFyIFBhcnRpY2xlU3lzdGVtID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFBhcnRpY2xlU3lzdGVtKGFyZ3MpIHtcclxuICAgICAgICB0aGlzLmxpZmUgPSAwO1xyXG4gICAgICAgIHRoaXMubGFzdFBhcnRpY2xlQWRkZWQgPSAwO1xyXG4gICAgICAgIHRoaXMuZHlpbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmFsaXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IGFyZ3M7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMgPSBbXTtcclxuICAgICAgICB0aGlzLm1heExpZmUgPSBhcmdzLm1heExpZmUgPyBuZXcgU3ByZWFkXzEuU2NhbGFyU3ByZWFkKGFyZ3MubWF4TGlmZSkgOiBuZXcgU3ByZWFkXzEuU2NhbGFyU3ByZWFkKDUpO1xyXG4gICAgICAgIHRoaXMubWF4UGFydGljbGVzID0gYXJncy5tYXhQYXJ0aWNsZXMgfHwgMTAwO1xyXG4gICAgICAgIHRoaXMuZW1pdHRlck1heExpZmUgPSBhcmdzLmVtaXR0ZXJNYXhMaWZlID8gYXJncy5lbWl0dGVyTWF4TGlmZSA6IG51bGw7XHJcbiAgICAgICAgdGhpcy5hY2NlbGVyYXRpb25GaWVsZCA9IGFyZ3MuYWNjZWxlcmF0aW9uRmllbGQ7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBTcHJlYWRfMS5WZWN0b3JTcHJlYWQoYXJncy5wb3NpdGlvbik7XHJcbiAgICAgICAgdGhpcy52ZWxvY2l0eSA9IG5ldyBTcHJlYWRfMS5WZWN0b3JTcHJlYWQoYXJncy52ZWxvY2l0eSk7XHJcbiAgICAgICAgdGhpcy5hY2NlbGVyYXRpb24gPSBuZXcgU3ByZWFkXzEuVmVjdG9yU3ByZWFkKGFyZ3MuYWNjZWxlcmF0aW9uKTtcclxuICAgICAgICB0aGlzLmhpZ2hlck9yZGVyID0gW107XHJcbiAgICAgICAgaWYgKGFyZ3MuZ3Jhdml0eSlcclxuICAgICAgICAgICAgdGhpcy5hY2NlbGVyYXRpb24udmFsdWUuYWRkKGFyZ3MuZ3Jhdml0eSk7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJncy5oaWdoZXJPcmRlcikpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmhpZ2hlck9yZGVyLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZ2hlck9yZGVyLnB1c2gobmV3IFNwcmVhZF8xLlZlY3RvclNwcmVhZChhcmdzLmhpZ2hlck9yZGVyW2ldKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBQYXJ0aWNsZVN5c3RlbS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGR0LCBvZmZzZXRYLCBvZmZzZXRZKSB7XHJcbiAgICAgICAgdGhpcy5saWZlICs9IGR0O1xyXG4gICAgICAgIGlmICghdGhpcy5hbGl2ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGlmICh0aGlzLmR5aW5nICYmIHRoaXMucGFydGljbGVzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWxpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuZW1pdHRlck1heExpZmUgPT09IFwibnVtYmVyXCIgJiYgdGhpcy5lbWl0dGVyTWF4TGlmZSA+IDAgJiYgdGhpcy5saWZlID49IHRoaXMuZW1pdHRlck1heExpZmUpIHtcclxuICAgICAgICAgICAgdGhpcy5keWluZyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBuZXdQYXJ0aWNsZXMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGFydGljbGVzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIHZhciBwID0gdGhpcy5wYXJ0aWNsZXNbaV07XHJcbiAgICAgICAgICAgIHAudXBkYXRlKGR0KTtcclxuICAgICAgICAgICAgaWYgKCFwLmFsaXZlKVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIHAudXBkYXRlRWxlbWVudChvZmZzZXRYLCBvZmZzZXRZKTtcclxuICAgICAgICAgICAgbmV3UGFydGljbGVzLnB1c2gocCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBjeWNsZUR1cmF0aW9uID0gdGhpcy5tYXhMaWZlLnZhbHVlICogdGhpcy5tYXhQYXJ0aWNsZXM7XHJcbiAgICAgICAgaWYgKCF0aGlzLmR5aW5nICYmIG5ld1BhcnRpY2xlcy5sZW5ndGggPCB0aGlzLm1heFBhcnRpY2xlcykge1xyXG4gICAgICAgICAgICBuZXdQYXJ0aWNsZXMucHVzaChuZXcgcGFydGljbGVfMS5QYXJ0aWNsZSh7XHJcbiAgICAgICAgICAgICAgICBtYXhMaWZlOiB0aGlzLm1heExpZmUuc2FtcGxlKCksXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogdGhpcy5wb3NpdGlvbi5zYW1wbGUoKSxcclxuICAgICAgICAgICAgICAgIHZlbG9jaXR5OiB0aGlzLnZlbG9jaXR5ICYmIHRoaXMudmVsb2NpdHkuc2FtcGxlKCksXHJcbiAgICAgICAgICAgICAgICBhY2NlbGVyYXRpb246IHRoaXMuYWNjZWxlcmF0aW9uICYmIHRoaXMuYWNjZWxlcmF0aW9uLnNhbXBsZSgpLFxyXG4gICAgICAgICAgICAgICAgaGlnaGVyT3JkZXI6IHRoaXMuaGlnaGVyT3JkZXIgJiYgdGhpcy5oaWdoZXJPcmRlci5tYXAoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHguc2FtcGxlKCk7IH0pLFxyXG4gICAgICAgICAgICAgICAgYWNjZWxlcmF0aW9uRmllbGQ6IHRoaXMuYWNjZWxlcmF0aW9uRmllbGRcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBhcnRpY2xlcyA9IG5ld1BhcnRpY2xlcztcclxuICAgIH07XHJcbiAgICByZXR1cm4gUGFydGljbGVTeXN0ZW07XHJcbn0pKCk7XHJcbmV4cG9ydHMuUGFydGljbGVTeXN0ZW0gPSBQYXJ0aWNsZVN5c3RlbTtcclxuIiwidmFyIFNwcmVhZF8xID0gcmVxdWlyZShcIi4vU3ByZWFkXCIpO1xyXG5leHBvcnRzLlZlY3RvclNwcmVhZCA9IFNwcmVhZF8xLlZlY3RvclNwcmVhZDtcclxuZXhwb3J0cy5TY2FsYXJTcHJlYWQgPSBTcHJlYWRfMS5TY2FsYXJTcHJlYWQ7XHJcbnZhciBWZWN0b3IyXzEgPSByZXF1aXJlKFwiLi9WZWN0b3IyXCIpO1xyXG5leHBvcnRzLlZlY3RvcjIgPSBWZWN0b3IyXzEuVmVjdG9yMjtcclxudmFyIGVtaXR0ZXJfMSA9IHJlcXVpcmUoXCIuL2VtaXR0ZXJcIik7XHJcbmV4cG9ydHMuRW1pdHRlciA9IGVtaXR0ZXJfMS5FbWl0dGVyO1xyXG52YXIgZW1pdHRlcl8yID0gcmVxdWlyZShcIi4vZW1pdHRlclwiKTtcclxudmFyIFZlY3RvcjJfMiA9IHJlcXVpcmUoXCIuL1ZlY3RvcjJcIik7XHJcbmZ1bmN0aW9uIHNwYXJrbGUoJGVsZW0pIHtcclxuICAgIG5ldyBlbWl0dGVyXzIuRW1pdHRlcigkZWxlbSwge1xyXG4gICAgICAgIG1heFBhcnRpY2xlczogMTAwLFxyXG4gICAgICAgIG1heExpZmU6IHtcclxuICAgICAgICAgICAgdmFsdWU6IDEsXHJcbiAgICAgICAgICAgIHNwcmVhZDogMC41XHJcbiAgICAgICAgfSxcclxuICAgICAgICB2ZWxvY2l0eToge1xyXG4gICAgICAgICAgICB2YWx1ZTogbmV3IFZlY3RvcjJfMi5WZWN0b3IyKDAsIC01KSxcclxuICAgICAgICAgICAgc3ByZWFkOiBuZXcgVmVjdG9yMl8yLlZlY3RvcjIoNywgMilcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdyYXZpdHk6IG5ldyBWZWN0b3IyXzIuVmVjdG9yMigwLCAwLjIpXHJcbiAgICB9KS5zdGFydCgpO1xyXG59XHJcbmV4cG9ydHMuc3BhcmtsZSA9IHNwYXJrbGU7XHJcbiJdfQ==
