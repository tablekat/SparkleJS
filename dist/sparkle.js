(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Sparkle = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./Vector2":2}],2:[function(require,module,exports){
"use strict";
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
    Vector2.prototype.minus = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
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
        return Math.sqrt(this.x * v.x + this.y * v.y);
    };
    return Vector2;
}());
exports.Vector2 = Vector2;

},{}],3:[function(require,module,exports){
"use strict";
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
        this.particleSystem.update(dt, offset.left, offset.top);
        if (!this.particleSystem.alive) {
            this.stop();
            if (typeof this.onEmitterDeath === "function")
                this.onEmitterDeath();
        }
    };
    return Emitter;
}());
exports.Emitter = Emitter;

},{"./particleSystem":5}],4:[function(require,module,exports){
"use strict";
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
            this.elem.remove();
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
        elem
            .css("width", "5px")
            .css("height", "5px")
            .css("border-radius", "5px")
            .css("background", "red");
        $("body").append(elem);
        this.elem = elem;
    };
    return Particle;
}());
exports.Particle = Particle;

},{"./Vector2":2}],5:[function(require,module,exports){
"use strict";
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
}());
exports.ParticleSystem = ParticleSystem;

},{"./Spread":1,"./particle":4}],6:[function(require,module,exports){
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

},{"./Spread":1,"./Vector2":2,"./emitter":3}]},{},[6])(6)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL1VzZXJzL2JlbmppL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9TcHJlYWQuanMiLCJzcmMvVmVjdG9yMi5qcyIsInNyYy9lbWl0dGVyLmpzIiwic3JjL3BhcnRpY2xlLmpzIiwic3JjL3BhcnRpY2xlU3lzdGVtLmpzIiwic3JjL3NwYXJrbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBWZWN0b3IyXzEgPSByZXF1aXJlKFwiLi9WZWN0b3IyXCIpO1xyXG4oZnVuY3Rpb24gKFNwcmVhZFR5cGUpIHtcclxuICAgIFNwcmVhZFR5cGVbU3ByZWFkVHlwZVtcIlVuaWZvcm1cIl0gPSAwXSA9IFwiVW5pZm9ybVwiO1xyXG4gICAgU3ByZWFkVHlwZVtTcHJlYWRUeXBlW1wiTm9ybWFsXCJdID0gMV0gPSBcIk5vcm1hbFwiO1xyXG59KShleHBvcnRzLlNwcmVhZFR5cGUgfHwgKGV4cG9ydHMuU3ByZWFkVHlwZSA9IHt9KSk7XHJcbnZhciBTcHJlYWRUeXBlID0gZXhwb3J0cy5TcHJlYWRUeXBlO1xyXG52YXIgVmVjdG9yU3ByZWFkID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFZlY3RvclNwcmVhZCh2YWx1ZSwgc3ByZWFkLCBzcHJlYWRUeXBlKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgVmVjdG9yMl8xLlZlY3RvcjIgfHwgIXZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZSB8fCBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoMCwgMCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByZWFkID0gc3ByZWFkIHx8IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigwLCAwKTtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gc3ByZWFkVHlwZSB8fCBTcHJlYWRUeXBlLk5vcm1hbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZS52YWx1ZSB8fCBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoMCwgMCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByZWFkID0gdmFsdWUuc3ByZWFkIHx8IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigwLCAwKTtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gdmFsdWUudHlwZSB8fCBTcHJlYWRUeXBlLk5vcm1hbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBWZWN0b3JTcHJlYWQucHJvdG90eXBlLnNhbXBsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcmFuZFIsIHJhbmRUaDtcclxuICAgICAgICByYW5kVGggPSBNYXRoLlBJICogMiAqIE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PSBTcHJlYWRUeXBlLlVuaWZvcm0pIHtcclxuICAgICAgICAgICAgcmFuZFIgPSBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmFuZFIgPSAoKE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSkgLSAzKSAvIDM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByYW5kViA9IFZlY3RvcjJfMS5WZWN0b3IyLmZyb21Qb2xhcihyYW5kUiwgcmFuZFRoKTtcclxuICAgICAgICByZXR1cm4gcmFuZFYuaGFkYW1hcmQodGhpcy5zcHJlYWQpLmFkZCh0aGlzLnZhbHVlKTtcclxuICAgIH07XHJcbiAgICBWZWN0b3JTcHJlYWQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChzcHIpIHtcclxuICAgICAgICB0aGlzLnZhbHVlLmFkZChzcHIudmFsdWUpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBWZWN0b3JTcHJlYWQ7XHJcbn0oKSk7XHJcbmV4cG9ydHMuVmVjdG9yU3ByZWFkID0gVmVjdG9yU3ByZWFkO1xyXG52YXIgU2NhbGFyU3ByZWFkID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFNjYWxhclNwcmVhZCh2YWx1ZSwgc3ByZWFkLCBzcHJlYWRUeXBlKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSBcIm51bWJlclwiIHx8ICF2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWUgfHwgMDtcclxuICAgICAgICAgICAgdGhpcy5zcHJlYWQgPSBzcHJlYWQgfHwgMDtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gc3ByZWFkVHlwZSB8fCBTcHJlYWRUeXBlLk5vcm1hbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZS52YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5zcHJlYWQgPSB2YWx1ZS5zcHJlYWQ7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHZhbHVlLnR5cGUgfHwgU3ByZWFkVHlwZS5Ob3JtYWw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgU2NhbGFyU3ByZWFkLnByb3RvdHlwZS5zYW1wbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHJhbmRSO1xyXG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT0gU3ByZWFkVHlwZS5Vbmlmb3JtKSB7XHJcbiAgICAgICAgICAgIHJhbmRSID0gTWF0aC5yYW5kb20oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJhbmRSID0gKChNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkpIC0gMykgLyAzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmFuZFIgKiB0aGlzLnNwcmVhZCArIHRoaXMudmFsdWU7XHJcbiAgICB9O1xyXG4gICAgU2NhbGFyU3ByZWFkLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoc3ByKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZSArPSBzcHI7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFNjYWxhclNwcmVhZDtcclxufSgpKTtcclxuZXhwb3J0cy5TY2FsYXJTcHJlYWQgPSBTY2FsYXJTcHJlYWQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgVmVjdG9yMiA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBWZWN0b3IyKHgsIHkpIHtcclxuICAgICAgICB0aGlzLnggPSB4IHx8IDA7XHJcbiAgICAgICAgdGhpcy55ID0geSB8fCAwO1xyXG4gICAgfVxyXG4gICAgVmVjdG9yMi5mcm9tUG9sYXIgPSBmdW5jdGlvbiAociwgdGgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIociAqIE1hdGguY29zKHRoKSwgciAqIE1hdGguc2luKHRoKSk7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgaWYgKHYgJiYgdi54ICYmIHYueSkge1xyXG4gICAgICAgICAgICB2LnggPSB0aGlzLng7XHJcbiAgICAgICAgICAgIHYueSA9IHRoaXMueTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54LCB0aGlzLnkpO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBcIihcIiArIHRoaXMueCArIFwiLFwiICsgdGhpcy55ICsgXCIpXCI7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICB0aGlzLnggKz0gdi54O1xyXG4gICAgICAgIHRoaXMueSArPSB2Lnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUubWludXMgPSBmdW5jdGlvbiAodikge1xyXG4gICAgICAgIHRoaXMueCAtPSB2Lng7XHJcbiAgICAgICAgdGhpcy55IC09IHYueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5tdWx0ID0gZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgICAgICBpZiAoeCBpbnN0YW5jZW9mIFZlY3RvcjIpIHtcclxuICAgICAgICAgICAgdGhpcy54ICo9IHgueDtcclxuICAgICAgICAgICAgdGhpcy55ICo9IHgueTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCAqPSB4O1xyXG4gICAgICAgICAgICB0aGlzLnkgKj0gdHlwZW9mIHkgPT09IFwibnVtYmVyXCIgPyB5IDogeDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUuaGFkYW1hcmQgPSBmdW5jdGlvbiAodmVjKSB7XHJcbiAgICAgICAgdGhpcy54ICo9IHZlYy54O1xyXG4gICAgICAgIHRoaXMueSAqPSB2ZWMueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkpO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLmxlbmd0aFNxID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnk7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ICogdi54ICsgdGhpcy55ICogdi55O1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLmRpc3QgPSBmdW5jdGlvbiAodikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy54ICogdi54ICsgdGhpcy55ICogdi55KTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gVmVjdG9yMjtcclxufSgpKTtcclxuZXhwb3J0cy5WZWN0b3IyID0gVmVjdG9yMjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBwYXJ0aWNsZVN5c3RlbV8xID0gcmVxdWlyZShcIi4vcGFydGljbGVTeXN0ZW1cIik7XHJcbnZhciBFbWl0dGVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIEVtaXR0ZXIoZG9tRWxlbSwgYXJncykge1xyXG4gICAgICAgIHRoaXMucGFydGljbGVTeXN0ZW0gPSBuZXcgcGFydGljbGVTeXN0ZW1fMS5QYXJ0aWNsZVN5c3RlbShhcmdzKTtcclxuICAgICAgICB0aGlzLmRvbUVsZW0gPSBkb21FbGVtO1xyXG4gICAgICAgIHRoaXMucmF0ZSA9IGFyZ3MucmF0ZSB8fCAxNjtcclxuICAgICAgICB0aGlzLm9uRW1pdHRlckRlYXRoID0gYXJncy5vbkVtaXR0ZXJEZWF0aDtcclxuICAgIH1cclxuICAgIEVtaXR0ZXIucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLnVwZGF0ZSgpOyB9LCB0aGlzLnJhdGUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIEVtaXR0ZXIucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBFbWl0dGVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGR0ID0gdGhpcy5yYXRlIC8gMTAwMDtcclxuICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy5kb21FbGVtLm9mZnNldCgpO1xyXG4gICAgICAgIHRoaXMucGFydGljbGVTeXN0ZW0udXBkYXRlKGR0LCBvZmZzZXQubGVmdCwgb2Zmc2V0LnRvcCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLnBhcnRpY2xlU3lzdGVtLmFsaXZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMub25FbWl0dGVyRGVhdGggPT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICAgICAgICAgIHRoaXMub25FbWl0dGVyRGVhdGgoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIEVtaXR0ZXI7XHJcbn0oKSk7XHJcbmV4cG9ydHMuRW1pdHRlciA9IEVtaXR0ZXI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgVmVjdG9yMl8xID0gcmVxdWlyZShcIi4vVmVjdG9yMlwiKTtcclxudmFyIFBhcnRpY2xlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFBhcnRpY2xlKGFyZ3MpIHtcclxuICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbkZpZWxkID0gYXJncy5hY2NlbGVyYXRpb25GaWVsZDtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gYXJncy5wb3NpdGlvbiA/IGFyZ3MucG9zaXRpb24uY2xvbmUoKSA6IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigpO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBhcmdzLnZlbG9jaXR5ID8gYXJncy52ZWxvY2l0eS5jbG9uZSgpIDogbmV3IFZlY3RvcjJfMS5WZWN0b3IyKCk7XHJcbiAgICAgICAgdGhpcy5hY2NlbGVyYXRpb24gPSBhcmdzLmFjY2VsZXJhdGlvbiA/IGFyZ3MuYWNjZWxlcmF0aW9uLmNsb25lKCkgOiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoKTtcclxuICAgICAgICB0aGlzLmhpZ2hlck9yZGVyID0gW107XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJncy5oaWdoZXJPcmRlcikpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmhpZ2hlck9yZGVyLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZ2hlck9yZGVyLnB1c2goYXJncy5oaWdoZXJPcmRlcltpXSA/IGFyZ3MuaGlnaGVyT3JkZXJbaV0uY2xvbmUoKSA6IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1heExpZmUgPSB0eXBlb2YgYXJncy5tYXhMaWZlID09IFwibnVtYmVyXCIgPyBhcmdzLm1heExpZmUgOiAxO1xyXG4gICAgICAgIHRoaXMubGlmZSA9IDA7XHJcbiAgICAgICAgdGhpcy5hbGl2ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5lbGVtID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNyZWF0ZUVsZW1lbnQoKTtcclxuICAgIH1cclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZHQpIHtcclxuICAgICAgICB0aGlzLmxpZmUgKz0gZHQ7XHJcbiAgICAgICAgaWYgKHRoaXMubWF4TGlmZSA8PSB0aGlzLmxpZmUpIHtcclxuICAgICAgICAgICAgdGhpcy5hbGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmVsZW0ucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmFjY2VsZXJhdGlvbkZpZWxkKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQnlGaWVsZChkdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUJ5VGF5bG9yKGR0KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGUucHJvdG90eXBlLnVwZGF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAob2Zmc2V0WCwgb2Zmc2V0WSkge1xyXG4gICAgICAgIGlmICghdGhpcy5hbGl2ZSB8fCAhdGhpcy5lbGVtKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy5lbGVtLmNzcyhcImxlZnRcIiwgdGhpcy5wb3NpdGlvbi54ICsgb2Zmc2V0WCk7XHJcbiAgICAgICAgdGhpcy5lbGVtLmNzcyhcInRvcFwiLCB0aGlzLnBvc2l0aW9uLnkgKyBvZmZzZXRZKTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUudXBkYXRlQnlGaWVsZCA9IGZ1bmN0aW9uIChkdCkge1xyXG4gICAgICAgIHZhciBhY2NlbCA9IHRoaXMuYWNjZWxlcmF0aW9uRmllbGQodGhpcy5wb3NpdGlvbik7XHJcbiAgICAgICAgdGhpcy52ZWxvY2l0eS5hZGQoYWNjZWwuc2FtcGxlKCkpO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24uYWRkKHRoaXMudmVsb2NpdHkpO1xyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS51cGRhdGVCeVRheWxvciA9IGZ1bmN0aW9uIChkdCkge1xyXG4gICAgICAgIHZhciBkZWwgPSBudWxsO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLmhpZ2hlck9yZGVyLmxlbmd0aCAtIDE7IGkgPj0gMDsgKytpKSB7XHJcbiAgICAgICAgICAgIGlmIChkZWwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlnaGVyT3JkZXJbaV0uYWRkKGRlbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVsID0gdGhpcy5oaWdoZXJPcmRlcltpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRlbCkge1xyXG4gICAgICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbi5hZGQoZGVsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy52ZWxvY2l0eS5hZGQodGhpcy5hY2NlbGVyYXRpb24pO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24uYWRkKHRoaXMudmVsb2NpdHkpO1xyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBlbGVtID0gJChcIjxkaXY+PC9kaXY+XCIpO1xyXG4gICAgICAgIGVsZW0uY3NzKFwicG9zaXRpb25cIiwgXCJhYnNvbHV0ZVwiKTtcclxuICAgICAgICBlbGVtXHJcbiAgICAgICAgICAgIC5jc3MoXCJ3aWR0aFwiLCBcIjVweFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwiaGVpZ2h0XCIsIFwiNXB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJib3JkZXItcmFkaXVzXCIsIFwiNXB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJiYWNrZ3JvdW5kXCIsIFwicmVkXCIpO1xyXG4gICAgICAgICQoXCJib2R5XCIpLmFwcGVuZChlbGVtKTtcclxuICAgICAgICB0aGlzLmVsZW0gPSBlbGVtO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBQYXJ0aWNsZTtcclxufSgpKTtcclxuZXhwb3J0cy5QYXJ0aWNsZSA9IFBhcnRpY2xlO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIHBhcnRpY2xlXzEgPSByZXF1aXJlKFwiLi9wYXJ0aWNsZVwiKTtcclxudmFyIFNwcmVhZF8xID0gcmVxdWlyZShcIi4vU3ByZWFkXCIpO1xyXG52YXIgUGFydGljbGVTeXN0ZW0gPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gUGFydGljbGVTeXN0ZW0oYXJncykge1xyXG4gICAgICAgIHRoaXMubGlmZSA9IDA7XHJcbiAgICAgICAgdGhpcy5sYXN0UGFydGljbGVBZGRlZCA9IDA7XHJcbiAgICAgICAgdGhpcy5keWluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYWxpdmUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gYXJncztcclxuICAgICAgICB0aGlzLnBhcnRpY2xlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMubWF4TGlmZSA9IGFyZ3MubWF4TGlmZSA/IG5ldyBTcHJlYWRfMS5TY2FsYXJTcHJlYWQoYXJncy5tYXhMaWZlKSA6IG5ldyBTcHJlYWRfMS5TY2FsYXJTcHJlYWQoNSk7XHJcbiAgICAgICAgdGhpcy5tYXhQYXJ0aWNsZXMgPSBhcmdzLm1heFBhcnRpY2xlcyB8fCAxMDA7XHJcbiAgICAgICAgdGhpcy5lbWl0dGVyTWF4TGlmZSA9IGFyZ3MuZW1pdHRlck1heExpZmUgPyBhcmdzLmVtaXR0ZXJNYXhMaWZlIDogbnVsbDtcclxuICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbkZpZWxkID0gYXJncy5hY2NlbGVyYXRpb25GaWVsZDtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFNwcmVhZF8xLlZlY3RvclNwcmVhZChhcmdzLnBvc2l0aW9uKTtcclxuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gbmV3IFNwcmVhZF8xLlZlY3RvclNwcmVhZChhcmdzLnZlbG9jaXR5KTtcclxuICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbiA9IG5ldyBTcHJlYWRfMS5WZWN0b3JTcHJlYWQoYXJncy5hY2NlbGVyYXRpb24pO1xyXG4gICAgICAgIHRoaXMuaGlnaGVyT3JkZXIgPSBbXTtcclxuICAgICAgICBpZiAoYXJncy5ncmF2aXR5KVxyXG4gICAgICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbi52YWx1ZS5hZGQoYXJncy5ncmF2aXR5KTtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShhcmdzLmhpZ2hlck9yZGVyKSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MuaGlnaGVyT3JkZXIubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlnaGVyT3JkZXIucHVzaChuZXcgU3ByZWFkXzEuVmVjdG9yU3ByZWFkKGFyZ3MuaGlnaGVyT3JkZXJbaV0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFBhcnRpY2xlU3lzdGVtLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZHQsIG9mZnNldFgsIG9mZnNldFkpIHtcclxuICAgICAgICB0aGlzLmxpZmUgKz0gZHQ7XHJcbiAgICAgICAgaWYgKCF0aGlzLmFsaXZlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYgKHRoaXMuZHlpbmcgJiYgdGhpcy5wYXJ0aWNsZXMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5hbGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5lbWl0dGVyTWF4TGlmZSA9PT0gXCJudW1iZXJcIiAmJiB0aGlzLmVtaXR0ZXJNYXhMaWZlID4gMCAmJiB0aGlzLmxpZmUgPj0gdGhpcy5lbWl0dGVyTWF4TGlmZSkge1xyXG4gICAgICAgICAgICB0aGlzLmR5aW5nID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG5ld1BhcnRpY2xlcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wYXJ0aWNsZXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgdmFyIHAgPSB0aGlzLnBhcnRpY2xlc1tpXTtcclxuICAgICAgICAgICAgcC51cGRhdGUoZHQpO1xyXG4gICAgICAgICAgICBpZiAoIXAuYWxpdmUpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgcC51cGRhdGVFbGVtZW50KG9mZnNldFgsIG9mZnNldFkpO1xyXG4gICAgICAgICAgICBuZXdQYXJ0aWNsZXMucHVzaChwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGN5Y2xlRHVyYXRpb24gPSB0aGlzLm1heExpZmUudmFsdWUgKiB0aGlzLm1heFBhcnRpY2xlcztcclxuICAgICAgICBpZiAoIXRoaXMuZHlpbmcgJiYgbmV3UGFydGljbGVzLmxlbmd0aCA8IHRoaXMubWF4UGFydGljbGVzKSB7XHJcbiAgICAgICAgICAgIG5ld1BhcnRpY2xlcy5wdXNoKG5ldyBwYXJ0aWNsZV8xLlBhcnRpY2xlKHtcclxuICAgICAgICAgICAgICAgIG1heExpZmU6IHRoaXMubWF4TGlmZS5zYW1wbGUoKSxcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiB0aGlzLnBvc2l0aW9uLnNhbXBsZSgpLFxyXG4gICAgICAgICAgICAgICAgdmVsb2NpdHk6IHRoaXMudmVsb2NpdHkgJiYgdGhpcy52ZWxvY2l0eS5zYW1wbGUoKSxcclxuICAgICAgICAgICAgICAgIGFjY2VsZXJhdGlvbjogdGhpcy5hY2NlbGVyYXRpb24gJiYgdGhpcy5hY2NlbGVyYXRpb24uc2FtcGxlKCksXHJcbiAgICAgICAgICAgICAgICBoaWdoZXJPcmRlcjogdGhpcy5oaWdoZXJPcmRlciAmJiB0aGlzLmhpZ2hlck9yZGVyLm1hcChmdW5jdGlvbiAoeCkgeyByZXR1cm4geC5zYW1wbGUoKTsgfSksXHJcbiAgICAgICAgICAgICAgICBhY2NlbGVyYXRpb25GaWVsZDogdGhpcy5hY2NlbGVyYXRpb25GaWVsZFxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGFydGljbGVzID0gbmV3UGFydGljbGVzO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBQYXJ0aWNsZVN5c3RlbTtcclxufSgpKTtcclxuZXhwb3J0cy5QYXJ0aWNsZVN5c3RlbSA9IFBhcnRpY2xlU3lzdGVtO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIFNwcmVhZF8xID0gcmVxdWlyZShcIi4vU3ByZWFkXCIpO1xyXG5leHBvcnRzLlZlY3RvclNwcmVhZCA9IFNwcmVhZF8xLlZlY3RvclNwcmVhZDtcclxuZXhwb3J0cy5TY2FsYXJTcHJlYWQgPSBTcHJlYWRfMS5TY2FsYXJTcHJlYWQ7XHJcbnZhciBWZWN0b3IyXzEgPSByZXF1aXJlKFwiLi9WZWN0b3IyXCIpO1xyXG5leHBvcnRzLlZlY3RvcjIgPSBWZWN0b3IyXzEuVmVjdG9yMjtcclxudmFyIGVtaXR0ZXJfMSA9IHJlcXVpcmUoXCIuL2VtaXR0ZXJcIik7XHJcbmV4cG9ydHMuRW1pdHRlciA9IGVtaXR0ZXJfMS5FbWl0dGVyO1xyXG52YXIgZW1pdHRlcl8yID0gcmVxdWlyZShcIi4vZW1pdHRlclwiKTtcclxudmFyIFZlY3RvcjJfMiA9IHJlcXVpcmUoXCIuL1ZlY3RvcjJcIik7XHJcbmZ1bmN0aW9uIHNwYXJrbGUoJGVsZW0pIHtcclxuICAgIG5ldyBlbWl0dGVyXzIuRW1pdHRlcigkZWxlbSwge1xyXG4gICAgICAgIG1heFBhcnRpY2xlczogMTAwLFxyXG4gICAgICAgIG1heExpZmU6IHtcclxuICAgICAgICAgICAgdmFsdWU6IDEsXHJcbiAgICAgICAgICAgIHNwcmVhZDogMC41XHJcbiAgICAgICAgfSxcclxuICAgICAgICB2ZWxvY2l0eToge1xyXG4gICAgICAgICAgICB2YWx1ZTogbmV3IFZlY3RvcjJfMi5WZWN0b3IyKDAsIC01KSxcclxuICAgICAgICAgICAgc3ByZWFkOiBuZXcgVmVjdG9yMl8yLlZlY3RvcjIoNywgMilcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdyYXZpdHk6IG5ldyBWZWN0b3IyXzIuVmVjdG9yMigwLCAwLjIpXHJcbiAgICB9KS5zdGFydCgpO1xyXG59XHJcbmV4cG9ydHMuc3BhcmtsZSA9IHNwYXJrbGU7XHJcbiJdfQ==
