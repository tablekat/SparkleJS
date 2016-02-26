(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Sparkle = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Vector2_1 = require("./Vector2");
(function (SpreadType) {
    SpreadType[SpreadType["Uniform"] = 0] = "Uniform";
    SpreadType[SpreadType["Normal"] = 1] = "Normal";
    SpreadType[SpreadType["RectUniform"] = 2] = "RectUniform";
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
        if (this.type == SpreadType.RectUniform) {
            var randX = (2 * Math.random() - 1) * this.spread.x;
            var randY = (2 * Math.random() - 1) * this.spread.y;
            var randV = new Vector2_1.Vector2(randX, randY);
            return randV.add(this.value);
        }
        else {
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
        }
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
    function Emitter(parentElem, args) {
        this.domElem = $("<div></div>")
            .addClass("sparkle-emitter")
            .css("position", "absolute")
            .css("top", "0px")
            .css("left", "0px");
        $("body").append(this.domElem);
        args.emitterElem = this.domElem;
        this.particleSystem = new particleSystem_1.ParticleSystem(args);
        this.parentElem = parentElem;
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
        var offset = this.parentElem.offset();
        var offsetX = offset.left + this.parentElem.outerWidth() / 2;
        var offsetY = offset.top + this.parentElem.outerHeight() / 2;
        this.particleSystem.update(dt, offsetX, offsetY);
        if (!this.particleSystem.alive) {
            this.stop();
            this.domElem.remove();
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
        this.emitterElem = args.emitterElem || $("body");
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
        for (var i = this.higherOrder.length - 1; i >= 0; --i) {
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
        this.emitterElem.append(elem);
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
        this.emitterElem = args.emitterElem || $("body");
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
                accelerationField: this.accelerationField,
                emitterElem: this.emitterElem || $("body")
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
exports.SpreadType = Spread_1.SpreadType;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9TcHJlYWQuanMiLCJzcmMvVmVjdG9yMi5qcyIsInNyYy9lbWl0dGVyLmpzIiwic3JjL3BhcnRpY2xlLmpzIiwic3JjL3BhcnRpY2xlU3lzdGVtLmpzIiwic3JjL3NwYXJrbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgVmVjdG9yMl8xID0gcmVxdWlyZShcIi4vVmVjdG9yMlwiKTtcclxuKGZ1bmN0aW9uIChTcHJlYWRUeXBlKSB7XHJcbiAgICBTcHJlYWRUeXBlW1NwcmVhZFR5cGVbXCJVbmlmb3JtXCJdID0gMF0gPSBcIlVuaWZvcm1cIjtcclxuICAgIFNwcmVhZFR5cGVbU3ByZWFkVHlwZVtcIk5vcm1hbFwiXSA9IDFdID0gXCJOb3JtYWxcIjtcclxuICAgIFNwcmVhZFR5cGVbU3ByZWFkVHlwZVtcIlJlY3RVbmlmb3JtXCJdID0gMl0gPSBcIlJlY3RVbmlmb3JtXCI7XHJcbn0pKGV4cG9ydHMuU3ByZWFkVHlwZSB8fCAoZXhwb3J0cy5TcHJlYWRUeXBlID0ge30pKTtcclxudmFyIFNwcmVhZFR5cGUgPSBleHBvcnRzLlNwcmVhZFR5cGU7XHJcbnZhciBWZWN0b3JTcHJlYWQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gVmVjdG9yU3ByZWFkKHZhbHVlLCBzcHJlYWQsIHNwcmVhZFR5cGUpIHtcclxuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBWZWN0b3IyXzEuVmVjdG9yMiB8fCAhdmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlIHx8IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigwLCAwKTtcclxuICAgICAgICAgICAgdGhpcy5zcHJlYWQgPSBzcHJlYWQgfHwgbmV3IFZlY3RvcjJfMS5WZWN0b3IyKDAsIDApO1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBzcHJlYWRUeXBlIHx8IFNwcmVhZFR5cGUuTm9ybWFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlLnZhbHVlIHx8IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigwLCAwKTtcclxuICAgICAgICAgICAgdGhpcy5zcHJlYWQgPSB2YWx1ZS5zcHJlYWQgfHwgbmV3IFZlY3RvcjJfMS5WZWN0b3IyKDAsIDApO1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSB2YWx1ZS50eXBlIHx8IFNwcmVhZFR5cGUuTm9ybWFsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFZlY3RvclNwcmVhZC5wcm90b3R5cGUuc2FtcGxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT0gU3ByZWFkVHlwZS5SZWN0VW5pZm9ybSkge1xyXG4gICAgICAgICAgICB2YXIgcmFuZFggPSAoMiAqIE1hdGgucmFuZG9tKCkgLSAxKSAqIHRoaXMuc3ByZWFkLng7XHJcbiAgICAgICAgICAgIHZhciByYW5kWSA9ICgyICogTWF0aC5yYW5kb20oKSAtIDEpICogdGhpcy5zcHJlYWQueTtcclxuICAgICAgICAgICAgdmFyIHJhbmRWID0gbmV3IFZlY3RvcjJfMS5WZWN0b3IyKHJhbmRYLCByYW5kWSk7XHJcbiAgICAgICAgICAgIHJldHVybiByYW5kVi5hZGQodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgcmFuZFIsIHJhbmRUaDtcclxuICAgICAgICAgICAgcmFuZFRoID0gTWF0aC5QSSAqIDIgKiBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy50eXBlID09IFNwcmVhZFR5cGUuVW5pZm9ybSkge1xyXG4gICAgICAgICAgICAgICAgcmFuZFIgPSBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmFuZFIgPSAoKE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSkgLSAzKSAvIDM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHJhbmRWID0gVmVjdG9yMl8xLlZlY3RvcjIuZnJvbVBvbGFyKHJhbmRSLCByYW5kVGgpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmFuZFYuaGFkYW1hcmQodGhpcy5zcHJlYWQpLmFkZCh0aGlzLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yU3ByZWFkLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoc3ByKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZS5hZGQoc3ByLnZhbHVlKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gVmVjdG9yU3ByZWFkO1xyXG59KSgpO1xyXG5leHBvcnRzLlZlY3RvclNwcmVhZCA9IFZlY3RvclNwcmVhZDtcclxudmFyIFNjYWxhclNwcmVhZCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBTY2FsYXJTcHJlYWQodmFsdWUsIHNwcmVhZCwgc3ByZWFkVHlwZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gXCJudW1iZXJcIiB8fCAhdmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlIHx8IDA7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByZWFkID0gc3ByZWFkIHx8IDA7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHNwcmVhZFR5cGUgfHwgU3ByZWFkVHlwZS5Ob3JtYWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWUudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByZWFkID0gdmFsdWUuc3ByZWFkO1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSB2YWx1ZS50eXBlIHx8IFNwcmVhZFR5cGUuTm9ybWFsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFNjYWxhclNwcmVhZC5wcm90b3R5cGUuc2FtcGxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciByYW5kUjtcclxuICAgICAgICBpZiAodGhpcy50eXBlID09IFNwcmVhZFR5cGUuVW5pZm9ybSkge1xyXG4gICAgICAgICAgICByYW5kUiA9IE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByYW5kUiA9ICgoTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpKSAtIDMpIC8gMztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJhbmRSICogdGhpcy5zcHJlYWQgKyB0aGlzLnZhbHVlO1xyXG4gICAgfTtcclxuICAgIFNjYWxhclNwcmVhZC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHNwcikge1xyXG4gICAgICAgIHRoaXMudmFsdWUgKz0gc3ByO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBTY2FsYXJTcHJlYWQ7XHJcbn0pKCk7XHJcbmV4cG9ydHMuU2NhbGFyU3ByZWFkID0gU2NhbGFyU3ByZWFkO1xyXG4iLCJ2YXIgVmVjdG9yMiA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBWZWN0b3IyKHgsIHkpIHtcclxuICAgICAgICB0aGlzLnggPSB4IHx8IDA7XHJcbiAgICAgICAgdGhpcy55ID0geSB8fCAwO1xyXG4gICAgfVxyXG4gICAgVmVjdG9yMi5mcm9tUG9sYXIgPSBmdW5jdGlvbiAociwgdGgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIociAqIE1hdGguY29zKHRoKSwgciAqIE1hdGguc2luKHRoKSk7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgaWYgKHYgJiYgdi54ICYmIHYueSkge1xyXG4gICAgICAgICAgICB2LnggPSB0aGlzLng7XHJcbiAgICAgICAgICAgIHYueSA9IHRoaXMueTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54LCB0aGlzLnkpO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBcIihcIiArIHRoaXMueCArIFwiLFwiICsgdGhpcy55ICsgXCIpXCI7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICB0aGlzLnggKz0gdi54O1xyXG4gICAgICAgIHRoaXMueSArPSB2Lnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUucGx1cyA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgdmFyIHYyID0gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIHYyLnggKz0gdi54O1xyXG4gICAgICAgIHYyLnkgKz0gdi55O1xyXG4gICAgICAgIHJldHVybiB2MjtcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5zdWJ0cmFjdCA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgdGhpcy54IC09IHYueDtcclxuICAgICAgICB0aGlzLnkgLT0gdi55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLm1pbnVzID0gZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICB2YXIgdjIgPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgdjIueCAtPSB2Lng7XHJcbiAgICAgICAgdjIueSAtPSB2Lnk7XHJcbiAgICAgICAgcmV0dXJuIHYyO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLm11bHQgPSBmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICAgIGlmICh4IGluc3RhbmNlb2YgVmVjdG9yMikge1xyXG4gICAgICAgICAgICB0aGlzLnggKj0geC54O1xyXG4gICAgICAgICAgICB0aGlzLnkgKj0geC55O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ICo9IHg7XHJcbiAgICAgICAgICAgIHRoaXMueSAqPSB0eXBlb2YgeSA9PT0gXCJudW1iZXJcIiA/IHkgOiB4O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5oYWRhbWFyZCA9IGZ1bmN0aW9uICh2ZWMpIHtcclxuICAgICAgICB0aGlzLnggKj0gdmVjLng7XHJcbiAgICAgICAgdGhpcy55ICo9IHZlYy55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSk7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUubGVuZ3RoU3EgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueTtcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbiAodikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKiB2LnggKyB0aGlzLnkgKiB2Lnk7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUuZGlzdCA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCAtIHYueCwgdGhpcy55IC0gdi55KS5sZW5ndGgoKTtcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoKCk7XHJcbiAgICAgICAgdGhpcy54IC89IGxlbmd0aDtcclxuICAgICAgICB0aGlzLnkgLz0gbGVuZ3RoO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBWZWN0b3IyO1xyXG59KSgpO1xyXG5leHBvcnRzLlZlY3RvcjIgPSBWZWN0b3IyO1xyXG4iLCJ2YXIgcGFydGljbGVTeXN0ZW1fMSA9IHJlcXVpcmUoXCIuL3BhcnRpY2xlU3lzdGVtXCIpO1xyXG52YXIgRW1pdHRlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBFbWl0dGVyKHBhcmVudEVsZW0sIGFyZ3MpIHtcclxuICAgICAgICB0aGlzLmRvbUVsZW0gPSAkKFwiPGRpdj48L2Rpdj5cIilcclxuICAgICAgICAgICAgLmFkZENsYXNzKFwic3BhcmtsZS1lbWl0dGVyXCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJwb3NpdGlvblwiLCBcImFic29sdXRlXCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJ0b3BcIiwgXCIwcHhcIilcclxuICAgICAgICAgICAgLmNzcyhcImxlZnRcIiwgXCIwcHhcIik7XHJcbiAgICAgICAgJChcImJvZHlcIikuYXBwZW5kKHRoaXMuZG9tRWxlbSk7XHJcbiAgICAgICAgYXJncy5lbWl0dGVyRWxlbSA9IHRoaXMuZG9tRWxlbTtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlU3lzdGVtID0gbmV3IHBhcnRpY2xlU3lzdGVtXzEuUGFydGljbGVTeXN0ZW0oYXJncyk7XHJcbiAgICAgICAgdGhpcy5wYXJlbnRFbGVtID0gcGFyZW50RWxlbTtcclxuICAgICAgICB0aGlzLnJhdGUgPSBhcmdzLnJhdGUgfHwgMTY7XHJcbiAgICAgICAgdGhpcy5vbkVtaXR0ZXJEZWF0aCA9IGFyZ3Mub25FbWl0dGVyRGVhdGg7XHJcbiAgICB9XHJcbiAgICBFbWl0dGVyLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy51cGRhdGUoKTsgfSwgdGhpcy5yYXRlKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBFbWl0dGVyLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgRW1pdHRlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBkdCA9IHRoaXMucmF0ZSAvIDEwMDA7XHJcbiAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMucGFyZW50RWxlbS5vZmZzZXQoKTtcclxuICAgICAgICB2YXIgb2Zmc2V0WCA9IG9mZnNldC5sZWZ0ICsgdGhpcy5wYXJlbnRFbGVtLm91dGVyV2lkdGgoKSAvIDI7XHJcbiAgICAgICAgdmFyIG9mZnNldFkgPSBvZmZzZXQudG9wICsgdGhpcy5wYXJlbnRFbGVtLm91dGVySGVpZ2h0KCkgLyAyO1xyXG4gICAgICAgIHRoaXMucGFydGljbGVTeXN0ZW0udXBkYXRlKGR0LCBvZmZzZXRYLCBvZmZzZXRZKTtcclxuICAgICAgICBpZiAoIXRoaXMucGFydGljbGVTeXN0ZW0uYWxpdmUpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZG9tRWxlbS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9uRW1pdHRlckRlYXRoID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uRW1pdHRlckRlYXRoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHJldHVybiBFbWl0dGVyO1xyXG59KSgpO1xyXG5leHBvcnRzLkVtaXR0ZXIgPSBFbWl0dGVyO1xyXG4iLCJ2YXIgVmVjdG9yMl8xID0gcmVxdWlyZShcIi4vVmVjdG9yMlwiKTtcclxudmFyIFBhcnRpY2xlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFBhcnRpY2xlKGFyZ3MpIHtcclxuICAgICAgICB0aGlzLmVtaXR0ZXJFbGVtID0gYXJncy5lbWl0dGVyRWxlbSB8fCAkKFwiYm9keVwiKTtcclxuICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbkZpZWxkID0gYXJncy5hY2NlbGVyYXRpb25GaWVsZDtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gYXJncy5wb3NpdGlvbiA/IGFyZ3MucG9zaXRpb24uY2xvbmUoKSA6IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigpO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBhcmdzLnZlbG9jaXR5ID8gYXJncy52ZWxvY2l0eS5jbG9uZSgpIDogbmV3IFZlY3RvcjJfMS5WZWN0b3IyKCk7XHJcbiAgICAgICAgdGhpcy5hY2NlbGVyYXRpb24gPSBhcmdzLmFjY2VsZXJhdGlvbiA/IGFyZ3MuYWNjZWxlcmF0aW9uLmNsb25lKCkgOiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoKTtcclxuICAgICAgICB0aGlzLmhpZ2hlck9yZGVyID0gW107XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJncy5oaWdoZXJPcmRlcikpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmhpZ2hlck9yZGVyLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZ2hlck9yZGVyLnB1c2goYXJncy5oaWdoZXJPcmRlcltpXSA/IGFyZ3MuaGlnaGVyT3JkZXJbaV0uY2xvbmUoKSA6IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1heExpZmUgPSB0eXBlb2YgYXJncy5tYXhMaWZlID09IFwibnVtYmVyXCIgPyBhcmdzLm1heExpZmUgOiAxO1xyXG4gICAgICAgIHRoaXMubGlmZSA9IDA7XHJcbiAgICAgICAgdGhpcy5hbGl2ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5lbGVtID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNyZWF0ZUVsZW1lbnQoKTtcclxuICAgIH1cclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZHQpIHtcclxuICAgICAgICB0aGlzLmxpZmUgKz0gZHQ7XHJcbiAgICAgICAgaWYgKHRoaXMubWF4TGlmZSA8PSB0aGlzLmxpZmUpIHtcclxuICAgICAgICAgICAgdGhpcy5hbGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmVsZW0gJiYgdGhpcy5lbGVtLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmVsZW0gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5hY2NlbGVyYXRpb25GaWVsZCkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUJ5RmllbGQoZHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVCeVRheWxvcihkdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS51cGRhdGVFbGVtZW50ID0gZnVuY3Rpb24gKG9mZnNldFgsIG9mZnNldFkpIHtcclxuICAgICAgICBpZiAoIXRoaXMuYWxpdmUgfHwgIXRoaXMuZWxlbSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuZWxlbS5jc3MoXCJsZWZ0XCIsIHRoaXMucG9zaXRpb24ueCArIG9mZnNldFgpO1xyXG4gICAgICAgIHRoaXMuZWxlbS5jc3MoXCJ0b3BcIiwgdGhpcy5wb3NpdGlvbi55ICsgb2Zmc2V0WSk7XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGUucHJvdG90eXBlLnVwZGF0ZUJ5RmllbGQgPSBmdW5jdGlvbiAoZHQpIHtcclxuICAgICAgICB2YXIgYWNjZWwgPSB0aGlzLmFjY2VsZXJhdGlvbkZpZWxkKHRoaXMucG9zaXRpb24pO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkuYWRkKGFjY2VsLnNhbXBsZSgpKTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLmFkZCh0aGlzLnZlbG9jaXR5KTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUudXBkYXRlQnlUYXlsb3IgPSBmdW5jdGlvbiAoZHQpIHtcclxuICAgICAgICB2YXIgZGVsID0gbnVsbDtcclxuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy5oaWdoZXJPcmRlci5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xyXG4gICAgICAgICAgICBpZiAoZGVsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZ2hlck9yZGVyW2ldLmFkZChkZWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRlbCA9IHRoaXMuaGlnaGVyT3JkZXJbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5hY2NlbGVyYXRpb24uYWRkKGRlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudmVsb2NpdHkuYWRkKHRoaXMuYWNjZWxlcmF0aW9uKTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLmFkZCh0aGlzLnZlbG9jaXR5KTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZWxlbSA9ICQoXCI8ZGl2PjwvZGl2PlwiKTtcclxuICAgICAgICBlbGVtLmNzcyhcInBvc2l0aW9uXCIsIFwiYWJzb2x1dGVcIik7XHJcbiAgICAgICAgdGhpcy5kdXN0RWxlbWVudChlbGVtKTtcclxuICAgICAgICB0aGlzLmJsZW5kTW9kZUVsZW1lbnQoZWxlbSk7XHJcbiAgICAgICAgdGhpcy5lbWl0dGVyRWxlbS5hcHBlbmQoZWxlbSk7XHJcbiAgICAgICAgdGhpcy5lbGVtID0gZWxlbTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY2lyY2xlRWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtKSB7XHJcbiAgICAgICAgdmFyIHJhZGl1cyA9IDIuNTtcclxuICAgICAgICBlbGVtXHJcbiAgICAgICAgICAgIC5jc3MoXCJ3aWR0aFwiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJoZWlnaHRcIiwgKDIgKiByYWRpdXMpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwiYm9yZGVyLXJhZGl1c1wiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJiYWNrZ3JvdW5kXCIsIFwicmVkXCIpO1xyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5kdXN0RWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtKSB7XHJcbiAgICAgICAgdmFyIGNvbG9yID0geyByOiAwLCBnOiAwLCBiOiAwIH07XHJcbiAgICAgICAgdmFyIGNjb2xvciA9IFwicmdiYSgwLCAwLCAwLCAxKVwiO1xyXG4gICAgICAgIHZhciByYWRpdXMgPSAzLjU7XHJcbiAgICAgICAgZWxlbVxyXG4gICAgICAgICAgICAuY3NzKFwid2lkdGhcIiwgKDIgKiByYWRpdXMpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwiaGVpZ2h0XCIsICgyICogcmFkaXVzKSArIFwicHhcIilcclxuICAgICAgICAgICAgLmNzcyhcImJvcmRlci1yYWRpdXNcIiwgKDIgKiByYWRpdXMpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwiYmFja2dyb3VuZFwiLCBcInJlZFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwiYmFja2dyb3VuZFwiLCBcInJhZGlhbC1ncmFkaWVudChlbGxpcHNlIGF0IGNlbnRlciwgXCIgKyBjY29sb3IgKyBcIiAwJSxyZ2JhKDAsMCwwLDApIDcwJSlcIik7XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGUucHJvdG90eXBlLmZpcmVFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgICB2YXIgcmFkaXVzID0gOTtcclxuICAgICAgICBlbGVtXHJcbiAgICAgICAgICAgIC5jc3MoXCJ3aWR0aFwiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJoZWlnaHRcIiwgKDIgKiByYWRpdXMpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwiYm9yZGVyLXJhZGl1c1wiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJiYWNrZ3JvdW5kXCIsIFwicmVkXCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJiYWNrZ3JvdW5kXCIsIFwicmFkaWFsLWdyYWRpZW50KGVsbGlwc2UgYXQgY2VudGVyLCByZ2JhKDI0OSwyNDksNDksMSkgMCUscmdiYSgyNTIsNDcsNDcsMC42MikgMzElLHJnYmEoMjQ0LDU3LDUxLDApIDcwJSlcIik7XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGUucHJvdG90eXBlLmJsZW5kTW9kZUVsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbSkge1xyXG4gICAgICAgIGVsZW1cclxuICAgICAgICAgICAgLmNzcyhcImJhY2tncm91bmQtYmxlbmQtbW9kZVwiLCBcIm11bHRpcGx5XCIpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBQYXJ0aWNsZTtcclxufSkoKTtcclxuZXhwb3J0cy5QYXJ0aWNsZSA9IFBhcnRpY2xlO1xyXG4iLCJ2YXIgcGFydGljbGVfMSA9IHJlcXVpcmUoXCIuL3BhcnRpY2xlXCIpO1xyXG52YXIgU3ByZWFkXzEgPSByZXF1aXJlKFwiLi9TcHJlYWRcIik7XHJcbnZhciBQYXJ0aWNsZVN5c3RlbSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBQYXJ0aWNsZVN5c3RlbShhcmdzKSB7XHJcbiAgICAgICAgdGhpcy5saWZlID0gMDtcclxuICAgICAgICB0aGlzLmxhc3RQYXJ0aWNsZUFkZGVkID0gMDtcclxuICAgICAgICB0aGlzLmR5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5hbGl2ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBhcmdzO1xyXG4gICAgICAgIHRoaXMucGFydGljbGVzID0gW107XHJcbiAgICAgICAgdGhpcy5tYXhMaWZlID0gYXJncy5tYXhMaWZlID8gbmV3IFNwcmVhZF8xLlNjYWxhclNwcmVhZChhcmdzLm1heExpZmUpIDogbmV3IFNwcmVhZF8xLlNjYWxhclNwcmVhZCg1KTtcclxuICAgICAgICB0aGlzLm1heFBhcnRpY2xlcyA9IGFyZ3MubWF4UGFydGljbGVzIHx8IDEwMDtcclxuICAgICAgICB0aGlzLmVtaXR0ZXJNYXhMaWZlID0gYXJncy5lbWl0dGVyTWF4TGlmZSA/IGFyZ3MuZW1pdHRlck1heExpZmUgOiBudWxsO1xyXG4gICAgICAgIHRoaXMuZW1pdHRlckVsZW0gPSBhcmdzLmVtaXR0ZXJFbGVtIHx8ICQoXCJib2R5XCIpO1xyXG4gICAgICAgIHRoaXMuYWNjZWxlcmF0aW9uRmllbGQgPSBhcmdzLmFjY2VsZXJhdGlvbkZpZWxkO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgU3ByZWFkXzEuVmVjdG9yU3ByZWFkKGFyZ3MucG9zaXRpb24pO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBuZXcgU3ByZWFkXzEuVmVjdG9yU3ByZWFkKGFyZ3MudmVsb2NpdHkpO1xyXG4gICAgICAgIHRoaXMuYWNjZWxlcmF0aW9uID0gbmV3IFNwcmVhZF8xLlZlY3RvclNwcmVhZChhcmdzLmFjY2VsZXJhdGlvbik7XHJcbiAgICAgICAgdGhpcy5oaWdoZXJPcmRlciA9IFtdO1xyXG4gICAgICAgIGlmIChhcmdzLmdyYXZpdHkpXHJcbiAgICAgICAgICAgIHRoaXMuYWNjZWxlcmF0aW9uLnZhbHVlLmFkZChhcmdzLmdyYXZpdHkpO1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGFyZ3MuaGlnaGVyT3JkZXIpKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5oaWdoZXJPcmRlci5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWdoZXJPcmRlci5wdXNoKG5ldyBTcHJlYWRfMS5WZWN0b3JTcHJlYWQoYXJncy5oaWdoZXJPcmRlcltpXSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgUGFydGljbGVTeXN0ZW0ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkdCwgb2Zmc2V0WCwgb2Zmc2V0WSkge1xyXG4gICAgICAgIHRoaXMubGlmZSArPSBkdDtcclxuICAgICAgICBpZiAoIXRoaXMuYWxpdmUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBpZiAodGhpcy5keWluZyAmJiB0aGlzLnBhcnRpY2xlcy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmFsaXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmVtaXR0ZXJNYXhMaWZlID09PSBcIm51bWJlclwiICYmIHRoaXMuZW1pdHRlck1heExpZmUgPiAwICYmIHRoaXMubGlmZSA+PSB0aGlzLmVtaXR0ZXJNYXhMaWZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHlpbmcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbmV3UGFydGljbGVzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBhcnRpY2xlcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICB2YXIgcCA9IHRoaXMucGFydGljbGVzW2ldO1xyXG4gICAgICAgICAgICBwLnVwZGF0ZShkdCk7XHJcbiAgICAgICAgICAgIGlmICghcC5hbGl2ZSlcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBwLnVwZGF0ZUVsZW1lbnQob2Zmc2V0WCwgb2Zmc2V0WSk7XHJcbiAgICAgICAgICAgIG5ld1BhcnRpY2xlcy5wdXNoKHApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY3ljbGVEdXJhdGlvbiA9IHRoaXMubWF4TGlmZS52YWx1ZSAqIHRoaXMubWF4UGFydGljbGVzO1xyXG4gICAgICAgIGlmICghdGhpcy5keWluZyAmJiBuZXdQYXJ0aWNsZXMubGVuZ3RoIDwgdGhpcy5tYXhQYXJ0aWNsZXMpIHtcclxuICAgICAgICAgICAgbmV3UGFydGljbGVzLnB1c2gobmV3IHBhcnRpY2xlXzEuUGFydGljbGUoe1xyXG4gICAgICAgICAgICAgICAgbWF4TGlmZTogdGhpcy5tYXhMaWZlLnNhbXBsZSgpLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IHRoaXMucG9zaXRpb24uc2FtcGxlKCksXHJcbiAgICAgICAgICAgICAgICB2ZWxvY2l0eTogdGhpcy52ZWxvY2l0eSAmJiB0aGlzLnZlbG9jaXR5LnNhbXBsZSgpLFxyXG4gICAgICAgICAgICAgICAgYWNjZWxlcmF0aW9uOiB0aGlzLmFjY2VsZXJhdGlvbiAmJiB0aGlzLmFjY2VsZXJhdGlvbi5zYW1wbGUoKSxcclxuICAgICAgICAgICAgICAgIGhpZ2hlck9yZGVyOiB0aGlzLmhpZ2hlck9yZGVyICYmIHRoaXMuaGlnaGVyT3JkZXIubWFwKGZ1bmN0aW9uICh4KSB7IHJldHVybiB4LnNhbXBsZSgpOyB9KSxcclxuICAgICAgICAgICAgICAgIGFjY2VsZXJhdGlvbkZpZWxkOiB0aGlzLmFjY2VsZXJhdGlvbkZpZWxkLFxyXG4gICAgICAgICAgICAgICAgZW1pdHRlckVsZW06IHRoaXMuZW1pdHRlckVsZW0gfHwgJChcImJvZHlcIilcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBhcnRpY2xlcyA9IG5ld1BhcnRpY2xlcztcclxuICAgIH07XHJcbiAgICByZXR1cm4gUGFydGljbGVTeXN0ZW07XHJcbn0pKCk7XHJcbmV4cG9ydHMuUGFydGljbGVTeXN0ZW0gPSBQYXJ0aWNsZVN5c3RlbTtcclxuIiwidmFyIFNwcmVhZF8xID0gcmVxdWlyZShcIi4vU3ByZWFkXCIpO1xyXG5leHBvcnRzLlZlY3RvclNwcmVhZCA9IFNwcmVhZF8xLlZlY3RvclNwcmVhZDtcclxuZXhwb3J0cy5TY2FsYXJTcHJlYWQgPSBTcHJlYWRfMS5TY2FsYXJTcHJlYWQ7XHJcbmV4cG9ydHMuU3ByZWFkVHlwZSA9IFNwcmVhZF8xLlNwcmVhZFR5cGU7XHJcbnZhciBWZWN0b3IyXzEgPSByZXF1aXJlKFwiLi9WZWN0b3IyXCIpO1xyXG5leHBvcnRzLlZlY3RvcjIgPSBWZWN0b3IyXzEuVmVjdG9yMjtcclxudmFyIGVtaXR0ZXJfMSA9IHJlcXVpcmUoXCIuL2VtaXR0ZXJcIik7XHJcbmV4cG9ydHMuRW1pdHRlciA9IGVtaXR0ZXJfMS5FbWl0dGVyO1xyXG52YXIgZW1pdHRlcl8yID0gcmVxdWlyZShcIi4vZW1pdHRlclwiKTtcclxudmFyIFZlY3RvcjJfMiA9IHJlcXVpcmUoXCIuL1ZlY3RvcjJcIik7XHJcbmZ1bmN0aW9uIHNwYXJrbGUoJGVsZW0pIHtcclxuICAgIG5ldyBlbWl0dGVyXzIuRW1pdHRlcigkZWxlbSwge1xyXG4gICAgICAgIG1heFBhcnRpY2xlczogMTAwLFxyXG4gICAgICAgIG1heExpZmU6IHtcclxuICAgICAgICAgICAgdmFsdWU6IDEsXHJcbiAgICAgICAgICAgIHNwcmVhZDogMC41XHJcbiAgICAgICAgfSxcclxuICAgICAgICB2ZWxvY2l0eToge1xyXG4gICAgICAgICAgICB2YWx1ZTogbmV3IFZlY3RvcjJfMi5WZWN0b3IyKDAsIC01KSxcclxuICAgICAgICAgICAgc3ByZWFkOiBuZXcgVmVjdG9yMl8yLlZlY3RvcjIoNywgMilcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdyYXZpdHk6IG5ldyBWZWN0b3IyXzIuVmVjdG9yMigwLCAwLjIpXHJcbiAgICB9KS5zdGFydCgpO1xyXG59XHJcbmV4cG9ydHMuc3BhcmtsZSA9IHNwYXJrbGU7XHJcbiJdfQ==
