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
            this.custom = null;
        }
        else {
            this.value = value.value || new Vector2_1.Vector2(0, 0);
            this.spread = value.spread || new Vector2_1.Vector2(0, 0);
            this.type = value.type || SpreadType.Normal;
            this.custom = value.custom || null;
        }
    }
    VectorSpread.prototype.sample = function () {
        if (this.custom) {
            return this.custom();
        }
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
            this.custom = null;
        }
        else {
            this.value = value.value;
            this.spread = value.spread;
            this.type = value.type || SpreadType.Normal;
            this.custom = value.custom || null;
        }
    }
    ScalarSpread.isArg = function (obj) {
        return obj &&
            (typeof obj.value == "number" ||
                typeof obj.spread == "number" ||
                typeof obj.custom == "function");
    };
    ScalarSpread.prototype.sample = function () {
        if (this.custom) {
            return this.custom();
        }
        var randR;
        if (this.type == SpreadType.Uniform || this.type == SpreadType.RectUniform) {
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
        this.updateLock = false;
        this.domElem = $("<div></div>")
            .addClass("sparkle-emitter")
            .css("position", "absolute")
            .css("top", "0px")
            .css("left", "0px");
        if (typeof args.zIndex === "number")
            this.domElem.css("z-index", args.zIndex);
        $("body").append(this.domElem);
        args.emitterElem = this.domElem;
        args.emitterRate = args.rate || 16;
        this.particleSystem = new particleSystem_1.ParticleSystem(args);
        this.parentElem = parentElem;
        this.rate = args.rate || 16;
        this.onEmitterDeath = args.onEmitterDeath;
        this.zIndex = typeof args.zIndex === "number" ? args.zIndex : "auto";
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
        if (this.updateLock)
            return;
        this.updateLock = true;
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
        this.updateLock = false;
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
        this.elemFactory = args.elemFactory;
        this.emitterRate = args.emitterRate || 16;
        this.scale = args.scale || 1;
        this.rotation = args.rotation || 0;
        this.rotationVelocity = args.rotationVelocity || 0;
        this.setupOpacity(args.opacity);
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
        this.newElement();
        this.updateElement(-3000, -3000);
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
        this.rotation += this.rotationVelocity;
    };
    Particle.prototype.updateElement = function (offsetX, offsetY) {
        if (!this.alive || !this.elem)
            return;
        this.elem
            .css("left", this.position.x + offsetX + "px")
            .css("top", this.position.y + offsetY + "px")
            .css("opacity", this.currentOpacity());
        this.elem.css("transform", "translate(-50%, -50%) rotate(" + Math.floor(this.rotation) + "deg) scale(" + this.scale + ")");
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
    Particle.prototype.currentLife = function () {
        return this.life / this.maxLife;
    };
    Particle.prototype.setupOpacity = function (opacity) {
        if (typeof opacity == "number") {
            this.opacityNumber = opacity;
        }
        else if (Array.isArray(opacity)) {
            opacity.sort(function (a, b) { return a.life - b.life; });
            this.opacityArray = opacity;
        }
        else if (typeof opacity == "function") {
            this.opacityFunction = opacity;
        }
        else {
            this.opacityNumber = 1;
        }
    };
    Particle.prototype.currentOpacity = function () {
        if (Array.isArray(this.opacityArray)) {
            var life = this.currentLife();
            var prev = null, next = null;
            for (var i = 0; i < this.opacityArray.length; ++i) {
                var op = this.opacityArray[i];
                if (op.life <= life)
                    prev = op;
                else if (!next)
                    next = op;
            }
            if (prev && next) {
                var dLife = next.life - prev.life;
                var dOpacity = next.value - prev.value;
                var amountInto = life - prev.life;
                var percentAcross = amountInto / dLife;
                var opacityOffset = percentAcross * dOpacity;
                return opacityOffset + prev.value;
            }
            else if (prev) {
                return prev.value;
            }
            else if (next) {
                return next.value;
            }
            else {
                return 1;
            }
        }
        else if (typeof this.opacityFunction == "function") {
            var life = this.currentLife();
            return this.opacityFunction(life);
        }
        else if (typeof this.opacityNumber == "number") {
            return this.opacityNumber;
        }
        else {
            return 1;
        }
    };
    Particle.prototype.newElement = function () {
        if (this.elemFactory) {
            this.elem = this.elemFactory();
        }
        else {
            this.createElement();
        }
        this.emitterElem.prepend(this.elem);
    };
    Particle.prototype.createElement = function () {
        var elem = $("<div></div>");
        elem.css("position", "absolute");
        this.dustElement(elem);
        this.blendModeElement(elem);
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
        this.emitterRate = args.emitterRate || 16;
        this.accelerationField = args.accelerationField;
        this.particleElemFactory = args.particleElemFactory;
        this.scale = new Spread_1.ScalarSpread(args.scale);
        this.rotation = new Spread_1.ScalarSpread(args.rotation);
        this.rotationVelocity = new Spread_1.ScalarSpread(args.rotationVelocity);
        if (typeof args.opacity === "number" || Spread_1.ScalarSpread.isArg(args.opacity)) {
            this.opacity = new Spread_1.ScalarSpread(args.opacity);
        }
        else {
            this.opacity = args.opacity;
        }
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
        var cycleDuration = 5;
        var cycleTicks = cycleDuration / (this.emitterRate / 1000);
        var newParticlesPerTick = this.maxParticles / cycleTicks;
        if (Math.random() < (newParticlesPerTick - Math.floor(newParticlesPerTick))) {
            newParticlesPerTick = Math.ceil(newParticlesPerTick);
        }
        else {
            newParticlesPerTick = Math.floor(newParticlesPerTick);
        }
        if (!this.dying && newParticles.length < this.maxParticles) {
            for (var i = 0; i < newParticlesPerTick; ++i) {
                newParticles.push(this.createParticle());
            }
        }
        this.particles = newParticles;
    };
    ParticleSystem.prototype.createParticle = function () {
        return new particle_1.Particle({
            maxLife: this.maxLife.sample(),
            position: this.position.sample(),
            velocity: this.velocity && this.velocity.sample(),
            acceleration: this.acceleration && this.acceleration.sample(),
            higherOrder: this.higherOrder && this.higherOrder.map(function (x) { return x.sample(); }),
            accelerationField: this.accelerationField,
            emitterElem: this.emitterElem || $("body"),
            elemFactory: this.particleElemFactory,
            scale: this.scale.sample(),
            rotation: this.rotation.sample(),
            rotationVelocity: this.rotationVelocity.sample(),
            opacity: (this.opacity instanceof Spread_1.ScalarSpread) ?
                this.opacity.sample() :
                this.opacity,
        });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL1VzZXJzL2JlbmppL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9TcHJlYWQuanMiLCJzcmMvVmVjdG9yMi5qcyIsInNyYy9lbWl0dGVyLmpzIiwic3JjL3BhcnRpY2xlLmpzIiwic3JjL3BhcnRpY2xlU3lzdGVtLmpzIiwic3JjL3NwYXJrbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBWZWN0b3IyXzEgPSByZXF1aXJlKFwiLi9WZWN0b3IyXCIpO1xyXG4oZnVuY3Rpb24gKFNwcmVhZFR5cGUpIHtcclxuICAgIFNwcmVhZFR5cGVbU3ByZWFkVHlwZVtcIlVuaWZvcm1cIl0gPSAwXSA9IFwiVW5pZm9ybVwiO1xyXG4gICAgU3ByZWFkVHlwZVtTcHJlYWRUeXBlW1wiTm9ybWFsXCJdID0gMV0gPSBcIk5vcm1hbFwiO1xyXG4gICAgU3ByZWFkVHlwZVtTcHJlYWRUeXBlW1wiUmVjdFVuaWZvcm1cIl0gPSAyXSA9IFwiUmVjdFVuaWZvcm1cIjtcclxufSkoZXhwb3J0cy5TcHJlYWRUeXBlIHx8IChleHBvcnRzLlNwcmVhZFR5cGUgPSB7fSkpO1xyXG52YXIgU3ByZWFkVHlwZSA9IGV4cG9ydHMuU3ByZWFkVHlwZTtcclxudmFyIFZlY3RvclNwcmVhZCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBWZWN0b3JTcHJlYWQodmFsdWUsIHNwcmVhZCwgc3ByZWFkVHlwZSkge1xyXG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFZlY3RvcjJfMS5WZWN0b3IyIHx8ICF2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWUgfHwgbmV3IFZlY3RvcjJfMS5WZWN0b3IyKDAsIDApO1xyXG4gICAgICAgICAgICB0aGlzLnNwcmVhZCA9IHNwcmVhZCB8fCBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoMCwgMCk7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHNwcmVhZFR5cGUgfHwgU3ByZWFkVHlwZS5Ob3JtYWw7XHJcbiAgICAgICAgICAgIHRoaXMuY3VzdG9tID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZS52YWx1ZSB8fCBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoMCwgMCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByZWFkID0gdmFsdWUuc3ByZWFkIHx8IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigwLCAwKTtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gdmFsdWUudHlwZSB8fCBTcHJlYWRUeXBlLk5vcm1hbDtcclxuICAgICAgICAgICAgdGhpcy5jdXN0b20gPSB2YWx1ZS5jdXN0b20gfHwgbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBWZWN0b3JTcHJlYWQucHJvdG90eXBlLnNhbXBsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXN0b20pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VzdG9tKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT0gU3ByZWFkVHlwZS5SZWN0VW5pZm9ybSkge1xyXG4gICAgICAgICAgICB2YXIgcmFuZFggPSAoMiAqIE1hdGgucmFuZG9tKCkgLSAxKSAqIHRoaXMuc3ByZWFkLng7XHJcbiAgICAgICAgICAgIHZhciByYW5kWSA9ICgyICogTWF0aC5yYW5kb20oKSAtIDEpICogdGhpcy5zcHJlYWQueTtcclxuICAgICAgICAgICAgdmFyIHJhbmRWID0gbmV3IFZlY3RvcjJfMS5WZWN0b3IyKHJhbmRYLCByYW5kWSk7XHJcbiAgICAgICAgICAgIHJldHVybiByYW5kVi5hZGQodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgcmFuZFIsIHJhbmRUaDtcclxuICAgICAgICAgICAgcmFuZFRoID0gTWF0aC5QSSAqIDIgKiBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy50eXBlID09IFNwcmVhZFR5cGUuVW5pZm9ybSkge1xyXG4gICAgICAgICAgICAgICAgcmFuZFIgPSBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmFuZFIgPSAoKE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSkgLSAzKSAvIDM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHJhbmRWID0gVmVjdG9yMl8xLlZlY3RvcjIuZnJvbVBvbGFyKHJhbmRSLCByYW5kVGgpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmFuZFYuaGFkYW1hcmQodGhpcy5zcHJlYWQpLmFkZCh0aGlzLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yU3ByZWFkLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoc3ByKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZS5hZGQoc3ByLnZhbHVlKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gVmVjdG9yU3ByZWFkO1xyXG59KSgpO1xyXG5leHBvcnRzLlZlY3RvclNwcmVhZCA9IFZlY3RvclNwcmVhZDtcclxudmFyIFNjYWxhclNwcmVhZCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBTY2FsYXJTcHJlYWQodmFsdWUsIHNwcmVhZCwgc3ByZWFkVHlwZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gXCJudW1iZXJcIiB8fCAhdmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlIHx8IDA7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByZWFkID0gc3ByZWFkIHx8IDA7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHNwcmVhZFR5cGUgfHwgU3ByZWFkVHlwZS5Ob3JtYWw7XHJcbiAgICAgICAgICAgIHRoaXMuY3VzdG9tID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZS52YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5zcHJlYWQgPSB2YWx1ZS5zcHJlYWQ7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHZhbHVlLnR5cGUgfHwgU3ByZWFkVHlwZS5Ob3JtYWw7XHJcbiAgICAgICAgICAgIHRoaXMuY3VzdG9tID0gdmFsdWUuY3VzdG9tIHx8IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgU2NhbGFyU3ByZWFkLmlzQXJnID0gZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgIHJldHVybiBvYmogJiZcclxuICAgICAgICAgICAgKHR5cGVvZiBvYmoudmFsdWUgPT0gXCJudW1iZXJcIiB8fFxyXG4gICAgICAgICAgICAgICAgdHlwZW9mIG9iai5zcHJlYWQgPT0gXCJudW1iZXJcIiB8fFxyXG4gICAgICAgICAgICAgICAgdHlwZW9mIG9iai5jdXN0b20gPT0gXCJmdW5jdGlvblwiKTtcclxuICAgIH07XHJcbiAgICBTY2FsYXJTcHJlYWQucHJvdG90eXBlLnNhbXBsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXN0b20pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VzdG9tKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByYW5kUjtcclxuICAgICAgICBpZiAodGhpcy50eXBlID09IFNwcmVhZFR5cGUuVW5pZm9ybSB8fCB0aGlzLnR5cGUgPT0gU3ByZWFkVHlwZS5SZWN0VW5pZm9ybSkge1xyXG4gICAgICAgICAgICByYW5kUiA9IE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByYW5kUiA9ICgoTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpKSAtIDMpIC8gMztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJhbmRSICogdGhpcy5zcHJlYWQgKyB0aGlzLnZhbHVlO1xyXG4gICAgfTtcclxuICAgIFNjYWxhclNwcmVhZC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHNwcikge1xyXG4gICAgICAgIHRoaXMudmFsdWUgKz0gc3ByO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBTY2FsYXJTcHJlYWQ7XHJcbn0pKCk7XHJcbmV4cG9ydHMuU2NhbGFyU3ByZWFkID0gU2NhbGFyU3ByZWFkO1xyXG4iLCJ2YXIgVmVjdG9yMiA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBWZWN0b3IyKHgsIHkpIHtcclxuICAgICAgICB0aGlzLnggPSB4IHx8IDA7XHJcbiAgICAgICAgdGhpcy55ID0geSB8fCAwO1xyXG4gICAgfVxyXG4gICAgVmVjdG9yMi5mcm9tUG9sYXIgPSBmdW5jdGlvbiAociwgdGgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIociAqIE1hdGguY29zKHRoKSwgciAqIE1hdGguc2luKHRoKSk7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgaWYgKHYgJiYgdi54ICYmIHYueSkge1xyXG4gICAgICAgICAgICB2LnggPSB0aGlzLng7XHJcbiAgICAgICAgICAgIHYueSA9IHRoaXMueTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54LCB0aGlzLnkpO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBcIihcIiArIHRoaXMueCArIFwiLFwiICsgdGhpcy55ICsgXCIpXCI7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICB0aGlzLnggKz0gdi54O1xyXG4gICAgICAgIHRoaXMueSArPSB2Lnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUucGx1cyA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgdmFyIHYyID0gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIHYyLnggKz0gdi54O1xyXG4gICAgICAgIHYyLnkgKz0gdi55O1xyXG4gICAgICAgIHJldHVybiB2MjtcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5zdWJ0cmFjdCA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgdGhpcy54IC09IHYueDtcclxuICAgICAgICB0aGlzLnkgLT0gdi55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLm1pbnVzID0gZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICB2YXIgdjIgPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgdjIueCAtPSB2Lng7XHJcbiAgICAgICAgdjIueSAtPSB2Lnk7XHJcbiAgICAgICAgcmV0dXJuIHYyO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLm11bHQgPSBmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICAgIGlmICh4IGluc3RhbmNlb2YgVmVjdG9yMikge1xyXG4gICAgICAgICAgICB0aGlzLnggKj0geC54O1xyXG4gICAgICAgICAgICB0aGlzLnkgKj0geC55O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ICo9IHg7XHJcbiAgICAgICAgICAgIHRoaXMueSAqPSB0eXBlb2YgeSA9PT0gXCJudW1iZXJcIiA/IHkgOiB4O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5oYWRhbWFyZCA9IGZ1bmN0aW9uICh2ZWMpIHtcclxuICAgICAgICB0aGlzLnggKj0gdmVjLng7XHJcbiAgICAgICAgdGhpcy55ICo9IHZlYy55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSk7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUubGVuZ3RoU3EgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueTtcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbiAodikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKiB2LnggKyB0aGlzLnkgKiB2Lnk7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUuZGlzdCA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCAtIHYueCwgdGhpcy55IC0gdi55KS5sZW5ndGgoKTtcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoKCk7XHJcbiAgICAgICAgdGhpcy54IC89IGxlbmd0aDtcclxuICAgICAgICB0aGlzLnkgLz0gbGVuZ3RoO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBWZWN0b3IyO1xyXG59KSgpO1xyXG5leHBvcnRzLlZlY3RvcjIgPSBWZWN0b3IyO1xyXG4iLCJ2YXIgcGFydGljbGVTeXN0ZW1fMSA9IHJlcXVpcmUoXCIuL3BhcnRpY2xlU3lzdGVtXCIpO1xyXG52YXIgRW1pdHRlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBFbWl0dGVyKHBhcmVudEVsZW0sIGFyZ3MpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUxvY2sgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmRvbUVsZW0gPSAkKFwiPGRpdj48L2Rpdj5cIilcclxuICAgICAgICAgICAgLmFkZENsYXNzKFwic3BhcmtsZS1lbWl0dGVyXCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJwb3NpdGlvblwiLCBcImFic29sdXRlXCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJ0b3BcIiwgXCIwcHhcIilcclxuICAgICAgICAgICAgLmNzcyhcImxlZnRcIiwgXCIwcHhcIik7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBhcmdzLnpJbmRleCA9PT0gXCJudW1iZXJcIilcclxuICAgICAgICAgICAgdGhpcy5kb21FbGVtLmNzcyhcInotaW5kZXhcIiwgYXJncy56SW5kZXgpO1xyXG4gICAgICAgICQoXCJib2R5XCIpLmFwcGVuZCh0aGlzLmRvbUVsZW0pO1xyXG4gICAgICAgIGFyZ3MuZW1pdHRlckVsZW0gPSB0aGlzLmRvbUVsZW07XHJcbiAgICAgICAgYXJncy5lbWl0dGVyUmF0ZSA9IGFyZ3MucmF0ZSB8fCAxNjtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlU3lzdGVtID0gbmV3IHBhcnRpY2xlU3lzdGVtXzEuUGFydGljbGVTeXN0ZW0oYXJncyk7XHJcbiAgICAgICAgdGhpcy5wYXJlbnRFbGVtID0gcGFyZW50RWxlbTtcclxuICAgICAgICB0aGlzLnJhdGUgPSBhcmdzLnJhdGUgfHwgMTY7XHJcbiAgICAgICAgdGhpcy5vbkVtaXR0ZXJEZWF0aCA9IGFyZ3Mub25FbWl0dGVyRGVhdGg7XHJcbiAgICAgICAgdGhpcy56SW5kZXggPSB0eXBlb2YgYXJncy56SW5kZXggPT09IFwibnVtYmVyXCIgPyBhcmdzLnpJbmRleCA6IFwiYXV0b1wiO1xyXG4gICAgfVxyXG4gICAgRW1pdHRlci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMudXBkYXRlKCk7IH0sIHRoaXMucmF0ZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgRW1pdHRlci5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIEVtaXR0ZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy51cGRhdGVMb2NrKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy51cGRhdGVMb2NrID0gdHJ1ZTtcclxuICAgICAgICB2YXIgZHQgPSB0aGlzLnJhdGUgLyAxMDAwO1xyXG4gICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLnBhcmVudEVsZW0ub2Zmc2V0KCk7XHJcbiAgICAgICAgdmFyIG9mZnNldFggPSBvZmZzZXQubGVmdCArIHRoaXMucGFyZW50RWxlbS5vdXRlcldpZHRoKCkgLyAyO1xyXG4gICAgICAgIHZhciBvZmZzZXRZID0gb2Zmc2V0LnRvcCArIHRoaXMucGFyZW50RWxlbS5vdXRlckhlaWdodCgpIC8gMjtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlU3lzdGVtLnVwZGF0ZShkdCwgb2Zmc2V0WCwgb2Zmc2V0WSk7XHJcbiAgICAgICAgaWYgKCF0aGlzLnBhcnRpY2xlU3lzdGVtLmFsaXZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgICAgICB0aGlzLmRvbUVsZW0ucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5vbkVtaXR0ZXJEZWF0aCA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkVtaXR0ZXJEZWF0aCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZUxvY2sgPSBmYWxzZTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gRW1pdHRlcjtcclxufSkoKTtcclxuZXhwb3J0cy5FbWl0dGVyID0gRW1pdHRlcjtcclxuIiwidmFyIFZlY3RvcjJfMSA9IHJlcXVpcmUoXCIuL1ZlY3RvcjJcIik7XHJcbnZhciBQYXJ0aWNsZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBQYXJ0aWNsZShhcmdzKSB7XHJcbiAgICAgICAgdGhpcy5lbWl0dGVyRWxlbSA9IGFyZ3MuZW1pdHRlckVsZW0gfHwgJChcImJvZHlcIik7XHJcbiAgICAgICAgdGhpcy5hY2NlbGVyYXRpb25GaWVsZCA9IGFyZ3MuYWNjZWxlcmF0aW9uRmllbGQ7XHJcbiAgICAgICAgdGhpcy5lbGVtRmFjdG9yeSA9IGFyZ3MuZWxlbUZhY3Rvcnk7XHJcbiAgICAgICAgdGhpcy5lbWl0dGVyUmF0ZSA9IGFyZ3MuZW1pdHRlclJhdGUgfHwgMTY7XHJcbiAgICAgICAgdGhpcy5zY2FsZSA9IGFyZ3Muc2NhbGUgfHwgMTtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uID0gYXJncy5yb3RhdGlvbiB8fCAwO1xyXG4gICAgICAgIHRoaXMucm90YXRpb25WZWxvY2l0eSA9IGFyZ3Mucm90YXRpb25WZWxvY2l0eSB8fCAwO1xyXG4gICAgICAgIHRoaXMuc2V0dXBPcGFjaXR5KGFyZ3Mub3BhY2l0eSk7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IGFyZ3MucG9zaXRpb24gPyBhcmdzLnBvc2l0aW9uLmNsb25lKCkgOiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoKTtcclxuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gYXJncy52ZWxvY2l0eSA/IGFyZ3MudmVsb2NpdHkuY2xvbmUoKSA6IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigpO1xyXG4gICAgICAgIHRoaXMuYWNjZWxlcmF0aW9uID0gYXJncy5hY2NlbGVyYXRpb24gPyBhcmdzLmFjY2VsZXJhdGlvbi5jbG9uZSgpIDogbmV3IFZlY3RvcjJfMS5WZWN0b3IyKCk7XHJcbiAgICAgICAgdGhpcy5oaWdoZXJPcmRlciA9IFtdO1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGFyZ3MuaGlnaGVyT3JkZXIpKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5oaWdoZXJPcmRlci5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWdoZXJPcmRlci5wdXNoKGFyZ3MuaGlnaGVyT3JkZXJbaV0gPyBhcmdzLmhpZ2hlck9yZGVyW2ldLmNsb25lKCkgOiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5tYXhMaWZlID0gdHlwZW9mIGFyZ3MubWF4TGlmZSA9PSBcIm51bWJlclwiID8gYXJncy5tYXhMaWZlIDogMTtcclxuICAgICAgICB0aGlzLmxpZmUgPSAwO1xyXG4gICAgICAgIHRoaXMuYWxpdmUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZWxlbSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5uZXdFbGVtZW50KCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVFbGVtZW50KC0zMDAwLCAtMzAwMCk7XHJcbiAgICB9XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGR0KSB7XHJcbiAgICAgICAgdGhpcy5saWZlICs9IGR0O1xyXG4gICAgICAgIGlmICh0aGlzLm1heExpZmUgPD0gdGhpcy5saWZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWxpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5lbGVtICYmIHRoaXMuZWxlbS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5lbGVtID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuYWNjZWxlcmF0aW9uRmllbGQpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVCeUZpZWxkKGR0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQnlUYXlsb3IoZHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJvdGF0aW9uICs9IHRoaXMucm90YXRpb25WZWxvY2l0eTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUudXBkYXRlRWxlbWVudCA9IGZ1bmN0aW9uIChvZmZzZXRYLCBvZmZzZXRZKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmFsaXZlIHx8ICF0aGlzLmVsZW0pXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLmVsZW1cclxuICAgICAgICAgICAgLmNzcyhcImxlZnRcIiwgdGhpcy5wb3NpdGlvbi54ICsgb2Zmc2V0WCArIFwicHhcIilcclxuICAgICAgICAgICAgLmNzcyhcInRvcFwiLCB0aGlzLnBvc2l0aW9uLnkgKyBvZmZzZXRZICsgXCJweFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwib3BhY2l0eVwiLCB0aGlzLmN1cnJlbnRPcGFjaXR5KCkpO1xyXG4gICAgICAgIHRoaXMuZWxlbS5jc3MoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoLTUwJSwgLTUwJSkgcm90YXRlKFwiICsgTWF0aC5mbG9vcih0aGlzLnJvdGF0aW9uKSArIFwiZGVnKSBzY2FsZShcIiArIHRoaXMuc2NhbGUgKyBcIilcIik7XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGUucHJvdG90eXBlLnVwZGF0ZUJ5RmllbGQgPSBmdW5jdGlvbiAoZHQpIHtcclxuICAgICAgICB2YXIgYWNjZWwgPSB0aGlzLmFjY2VsZXJhdGlvbkZpZWxkKHRoaXMucG9zaXRpb24pO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkuYWRkKGFjY2VsLnNhbXBsZSgpKTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLmFkZCh0aGlzLnZlbG9jaXR5KTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUudXBkYXRlQnlUYXlsb3IgPSBmdW5jdGlvbiAoZHQpIHtcclxuICAgICAgICB2YXIgZGVsID0gbnVsbDtcclxuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy5oaWdoZXJPcmRlci5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xyXG4gICAgICAgICAgICBpZiAoZGVsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZ2hlck9yZGVyW2ldLmFkZChkZWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRlbCA9IHRoaXMuaGlnaGVyT3JkZXJbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5hY2NlbGVyYXRpb24uYWRkKGRlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudmVsb2NpdHkuYWRkKHRoaXMuYWNjZWxlcmF0aW9uKTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLmFkZCh0aGlzLnZlbG9jaXR5KTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3VycmVudExpZmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGlmZSAvIHRoaXMubWF4TGlmZTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuc2V0dXBPcGFjaXR5ID0gZnVuY3Rpb24gKG9wYWNpdHkpIHtcclxuICAgICAgICBpZiAodHlwZW9mIG9wYWNpdHkgPT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICB0aGlzLm9wYWNpdHlOdW1iZXIgPSBvcGFjaXR5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KG9wYWNpdHkpKSB7XHJcbiAgICAgICAgICAgIG9wYWNpdHkuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYS5saWZlIC0gYi5saWZlOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5vcGFjaXR5QXJyYXkgPSBvcGFjaXR5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2Ygb3BhY2l0eSA9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5vcGFjaXR5RnVuY3Rpb24gPSBvcGFjaXR5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vcGFjaXR5TnVtYmVyID0gMTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGUucHJvdG90eXBlLmN1cnJlbnRPcGFjaXR5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMub3BhY2l0eUFycmF5KSkge1xyXG4gICAgICAgICAgICB2YXIgbGlmZSA9IHRoaXMuY3VycmVudExpZmUoKTtcclxuICAgICAgICAgICAgdmFyIHByZXYgPSBudWxsLCBuZXh0ID0gbnVsbDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wYWNpdHlBcnJheS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9wID0gdGhpcy5vcGFjaXR5QXJyYXlbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAob3AubGlmZSA8PSBsaWZlKVxyXG4gICAgICAgICAgICAgICAgICAgIHByZXYgPSBvcDtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCFuZXh0KVxyXG4gICAgICAgICAgICAgICAgICAgIG5leHQgPSBvcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJldiAmJiBuZXh0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZExpZmUgPSBuZXh0LmxpZmUgLSBwcmV2LmxpZmU7XHJcbiAgICAgICAgICAgICAgICB2YXIgZE9wYWNpdHkgPSBuZXh0LnZhbHVlIC0gcHJldi52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHZhciBhbW91bnRJbnRvID0gbGlmZSAtIHByZXYubGlmZTtcclxuICAgICAgICAgICAgICAgIHZhciBwZXJjZW50QWNyb3NzID0gYW1vdW50SW50byAvIGRMaWZlO1xyXG4gICAgICAgICAgICAgICAgdmFyIG9wYWNpdHlPZmZzZXQgPSBwZXJjZW50QWNyb3NzICogZE9wYWNpdHk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3BhY2l0eU9mZnNldCArIHByZXYudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAocHJldikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZXYudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAobmV4dCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgdGhpcy5vcGFjaXR5RnVuY3Rpb24gPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIHZhciBsaWZlID0gdGhpcy5jdXJyZW50TGlmZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcGFjaXR5RnVuY3Rpb24obGlmZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiB0aGlzLm9wYWNpdHlOdW1iZXIgPT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcGFjaXR5TnVtYmVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5uZXdFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmVsZW1GYWN0b3J5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbSA9IHRoaXMuZWxlbUZhY3RvcnkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmVtaXR0ZXJFbGVtLnByZXBlbmQodGhpcy5lbGVtKTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZWxlbSA9ICQoXCI8ZGl2PjwvZGl2PlwiKTtcclxuICAgICAgICBlbGVtLmNzcyhcInBvc2l0aW9uXCIsIFwiYWJzb2x1dGVcIik7XHJcbiAgICAgICAgdGhpcy5kdXN0RWxlbWVudChlbGVtKTtcclxuICAgICAgICB0aGlzLmJsZW5kTW9kZUVsZW1lbnQoZWxlbSk7XHJcbiAgICAgICAgdGhpcy5lbGVtID0gZWxlbTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY2lyY2xlRWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtKSB7XHJcbiAgICAgICAgdmFyIHJhZGl1cyA9IDIuNTtcclxuICAgICAgICBlbGVtXHJcbiAgICAgICAgICAgIC5jc3MoXCJ3aWR0aFwiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJoZWlnaHRcIiwgKDIgKiByYWRpdXMpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwiYm9yZGVyLXJhZGl1c1wiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJiYWNrZ3JvdW5kXCIsIFwicmVkXCIpO1xyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5kdXN0RWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtKSB7XHJcbiAgICAgICAgdmFyIGNvbG9yID0geyByOiAwLCBnOiAwLCBiOiAwIH07XHJcbiAgICAgICAgdmFyIGNjb2xvciA9IFwicmdiYSgwLCAwLCAwLCAxKVwiO1xyXG4gICAgICAgIHZhciByYWRpdXMgPSAzLjU7XHJcbiAgICAgICAgZWxlbVxyXG4gICAgICAgICAgICAuY3NzKFwid2lkdGhcIiwgKDIgKiByYWRpdXMpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwiaGVpZ2h0XCIsICgyICogcmFkaXVzKSArIFwicHhcIilcclxuICAgICAgICAgICAgLmNzcyhcImJvcmRlci1yYWRpdXNcIiwgKDIgKiByYWRpdXMpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwiYmFja2dyb3VuZFwiLCBcInJlZFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwiYmFja2dyb3VuZFwiLCBcInJhZGlhbC1ncmFkaWVudChlbGxpcHNlIGF0IGNlbnRlciwgXCIgKyBjY29sb3IgKyBcIiAwJSxyZ2JhKDAsMCwwLDApIDcwJSlcIik7XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGUucHJvdG90eXBlLmZpcmVFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgICB2YXIgcmFkaXVzID0gOTtcclxuICAgICAgICBlbGVtXHJcbiAgICAgICAgICAgIC5jc3MoXCJ3aWR0aFwiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJoZWlnaHRcIiwgKDIgKiByYWRpdXMpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwiYm9yZGVyLXJhZGl1c1wiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJiYWNrZ3JvdW5kXCIsIFwicmVkXCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJiYWNrZ3JvdW5kXCIsIFwicmFkaWFsLWdyYWRpZW50KGVsbGlwc2UgYXQgY2VudGVyLCByZ2JhKDI0OSwyNDksNDksMSkgMCUscmdiYSgyNTIsNDcsNDcsMC42MikgMzElLHJnYmEoMjQ0LDU3LDUxLDApIDcwJSlcIik7XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGUucHJvdG90eXBlLmJsZW5kTW9kZUVsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbSkge1xyXG4gICAgICAgIGVsZW1cclxuICAgICAgICAgICAgLmNzcyhcImJhY2tncm91bmQtYmxlbmQtbW9kZVwiLCBcIm11bHRpcGx5XCIpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBQYXJ0aWNsZTtcclxufSkoKTtcclxuZXhwb3J0cy5QYXJ0aWNsZSA9IFBhcnRpY2xlO1xyXG4iLCJ2YXIgcGFydGljbGVfMSA9IHJlcXVpcmUoXCIuL3BhcnRpY2xlXCIpO1xyXG52YXIgU3ByZWFkXzEgPSByZXF1aXJlKFwiLi9TcHJlYWRcIik7XHJcbnZhciBQYXJ0aWNsZVN5c3RlbSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBQYXJ0aWNsZVN5c3RlbShhcmdzKSB7XHJcbiAgICAgICAgdGhpcy5saWZlID0gMDtcclxuICAgICAgICB0aGlzLmxhc3RQYXJ0aWNsZUFkZGVkID0gMDtcclxuICAgICAgICB0aGlzLmR5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5hbGl2ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBhcmdzO1xyXG4gICAgICAgIHRoaXMucGFydGljbGVzID0gW107XHJcbiAgICAgICAgdGhpcy5tYXhMaWZlID0gYXJncy5tYXhMaWZlID8gbmV3IFNwcmVhZF8xLlNjYWxhclNwcmVhZChhcmdzLm1heExpZmUpIDogbmV3IFNwcmVhZF8xLlNjYWxhclNwcmVhZCg1KTtcclxuICAgICAgICB0aGlzLm1heFBhcnRpY2xlcyA9IGFyZ3MubWF4UGFydGljbGVzIHx8IDEwMDtcclxuICAgICAgICB0aGlzLmVtaXR0ZXJNYXhMaWZlID0gYXJncy5lbWl0dGVyTWF4TGlmZSA/IGFyZ3MuZW1pdHRlck1heExpZmUgOiBudWxsO1xyXG4gICAgICAgIHRoaXMuZW1pdHRlckVsZW0gPSBhcmdzLmVtaXR0ZXJFbGVtIHx8ICQoXCJib2R5XCIpO1xyXG4gICAgICAgIHRoaXMuZW1pdHRlclJhdGUgPSBhcmdzLmVtaXR0ZXJSYXRlIHx8IDE2O1xyXG4gICAgICAgIHRoaXMuYWNjZWxlcmF0aW9uRmllbGQgPSBhcmdzLmFjY2VsZXJhdGlvbkZpZWxkO1xyXG4gICAgICAgIHRoaXMucGFydGljbGVFbGVtRmFjdG9yeSA9IGFyZ3MucGFydGljbGVFbGVtRmFjdG9yeTtcclxuICAgICAgICB0aGlzLnNjYWxlID0gbmV3IFNwcmVhZF8xLlNjYWxhclNwcmVhZChhcmdzLnNjYWxlKTtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uID0gbmV3IFNwcmVhZF8xLlNjYWxhclNwcmVhZChhcmdzLnJvdGF0aW9uKTtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uVmVsb2NpdHkgPSBuZXcgU3ByZWFkXzEuU2NhbGFyU3ByZWFkKGFyZ3Mucm90YXRpb25WZWxvY2l0eSk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBhcmdzLm9wYWNpdHkgPT09IFwibnVtYmVyXCIgfHwgU3ByZWFkXzEuU2NhbGFyU3ByZWFkLmlzQXJnKGFyZ3Mub3BhY2l0eSkpIHtcclxuICAgICAgICAgICAgdGhpcy5vcGFjaXR5ID0gbmV3IFNwcmVhZF8xLlNjYWxhclNwcmVhZChhcmdzLm9wYWNpdHkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vcGFjaXR5ID0gYXJncy5vcGFjaXR5O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFNwcmVhZF8xLlZlY3RvclNwcmVhZChhcmdzLnBvc2l0aW9uKTtcclxuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gbmV3IFNwcmVhZF8xLlZlY3RvclNwcmVhZChhcmdzLnZlbG9jaXR5KTtcclxuICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbiA9IG5ldyBTcHJlYWRfMS5WZWN0b3JTcHJlYWQoYXJncy5hY2NlbGVyYXRpb24pO1xyXG4gICAgICAgIHRoaXMuaGlnaGVyT3JkZXIgPSBbXTtcclxuICAgICAgICBpZiAoYXJncy5ncmF2aXR5KVxyXG4gICAgICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbi52YWx1ZS5hZGQoYXJncy5ncmF2aXR5KTtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShhcmdzLmhpZ2hlck9yZGVyKSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MuaGlnaGVyT3JkZXIubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlnaGVyT3JkZXIucHVzaChuZXcgU3ByZWFkXzEuVmVjdG9yU3ByZWFkKGFyZ3MuaGlnaGVyT3JkZXJbaV0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFBhcnRpY2xlU3lzdGVtLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZHQsIG9mZnNldFgsIG9mZnNldFkpIHtcclxuICAgICAgICB0aGlzLmxpZmUgKz0gZHQ7XHJcbiAgICAgICAgaWYgKCF0aGlzLmFsaXZlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYgKHRoaXMuZHlpbmcgJiYgdGhpcy5wYXJ0aWNsZXMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5hbGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5lbWl0dGVyTWF4TGlmZSA9PT0gXCJudW1iZXJcIiAmJiB0aGlzLmVtaXR0ZXJNYXhMaWZlID4gMCAmJiB0aGlzLmxpZmUgPj0gdGhpcy5lbWl0dGVyTWF4TGlmZSkge1xyXG4gICAgICAgICAgICB0aGlzLmR5aW5nID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG5ld1BhcnRpY2xlcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wYXJ0aWNsZXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgdmFyIHAgPSB0aGlzLnBhcnRpY2xlc1tpXTtcclxuICAgICAgICAgICAgcC51cGRhdGUoZHQpO1xyXG4gICAgICAgICAgICBpZiAoIXAuYWxpdmUpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgcC51cGRhdGVFbGVtZW50KG9mZnNldFgsIG9mZnNldFkpO1xyXG4gICAgICAgICAgICBuZXdQYXJ0aWNsZXMucHVzaChwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGN5Y2xlRHVyYXRpb24gPSA1O1xyXG4gICAgICAgIHZhciBjeWNsZVRpY2tzID0gY3ljbGVEdXJhdGlvbiAvICh0aGlzLmVtaXR0ZXJSYXRlIC8gMTAwMCk7XHJcbiAgICAgICAgdmFyIG5ld1BhcnRpY2xlc1BlclRpY2sgPSB0aGlzLm1heFBhcnRpY2xlcyAvIGN5Y2xlVGlja3M7XHJcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAobmV3UGFydGljbGVzUGVyVGljayAtIE1hdGguZmxvb3IobmV3UGFydGljbGVzUGVyVGljaykpKSB7XHJcbiAgICAgICAgICAgIG5ld1BhcnRpY2xlc1BlclRpY2sgPSBNYXRoLmNlaWwobmV3UGFydGljbGVzUGVyVGljayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBuZXdQYXJ0aWNsZXNQZXJUaWNrID0gTWF0aC5mbG9vcihuZXdQYXJ0aWNsZXNQZXJUaWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLmR5aW5nICYmIG5ld1BhcnRpY2xlcy5sZW5ndGggPCB0aGlzLm1heFBhcnRpY2xlcykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5ld1BhcnRpY2xlc1BlclRpY2s7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgbmV3UGFydGljbGVzLnB1c2godGhpcy5jcmVhdGVQYXJ0aWNsZSgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBhcnRpY2xlcyA9IG5ld1BhcnRpY2xlcztcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZVN5c3RlbS5wcm90b3R5cGUuY3JlYXRlUGFydGljbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXJ0aWNsZV8xLlBhcnRpY2xlKHtcclxuICAgICAgICAgICAgbWF4TGlmZTogdGhpcy5tYXhMaWZlLnNhbXBsZSgpLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogdGhpcy5wb3NpdGlvbi5zYW1wbGUoKSxcclxuICAgICAgICAgICAgdmVsb2NpdHk6IHRoaXMudmVsb2NpdHkgJiYgdGhpcy52ZWxvY2l0eS5zYW1wbGUoKSxcclxuICAgICAgICAgICAgYWNjZWxlcmF0aW9uOiB0aGlzLmFjY2VsZXJhdGlvbiAmJiB0aGlzLmFjY2VsZXJhdGlvbi5zYW1wbGUoKSxcclxuICAgICAgICAgICAgaGlnaGVyT3JkZXI6IHRoaXMuaGlnaGVyT3JkZXIgJiYgdGhpcy5oaWdoZXJPcmRlci5tYXAoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHguc2FtcGxlKCk7IH0pLFxyXG4gICAgICAgICAgICBhY2NlbGVyYXRpb25GaWVsZDogdGhpcy5hY2NlbGVyYXRpb25GaWVsZCxcclxuICAgICAgICAgICAgZW1pdHRlckVsZW06IHRoaXMuZW1pdHRlckVsZW0gfHwgJChcImJvZHlcIiksXHJcbiAgICAgICAgICAgIGVsZW1GYWN0b3J5OiB0aGlzLnBhcnRpY2xlRWxlbUZhY3RvcnksXHJcbiAgICAgICAgICAgIHNjYWxlOiB0aGlzLnNjYWxlLnNhbXBsZSgpLFxyXG4gICAgICAgICAgICByb3RhdGlvbjogdGhpcy5yb3RhdGlvbi5zYW1wbGUoKSxcclxuICAgICAgICAgICAgcm90YXRpb25WZWxvY2l0eTogdGhpcy5yb3RhdGlvblZlbG9jaXR5LnNhbXBsZSgpLFxyXG4gICAgICAgICAgICBvcGFjaXR5OiAodGhpcy5vcGFjaXR5IGluc3RhbmNlb2YgU3ByZWFkXzEuU2NhbGFyU3ByZWFkKSA/XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wYWNpdHkuc2FtcGxlKCkgOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5vcGFjaXR5LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBQYXJ0aWNsZVN5c3RlbTtcclxufSkoKTtcclxuZXhwb3J0cy5QYXJ0aWNsZVN5c3RlbSA9IFBhcnRpY2xlU3lzdGVtO1xyXG4iLCJ2YXIgU3ByZWFkXzEgPSByZXF1aXJlKFwiLi9TcHJlYWRcIik7XHJcbmV4cG9ydHMuVmVjdG9yU3ByZWFkID0gU3ByZWFkXzEuVmVjdG9yU3ByZWFkO1xyXG5leHBvcnRzLlNjYWxhclNwcmVhZCA9IFNwcmVhZF8xLlNjYWxhclNwcmVhZDtcclxuZXhwb3J0cy5TcHJlYWRUeXBlID0gU3ByZWFkXzEuU3ByZWFkVHlwZTtcclxudmFyIFZlY3RvcjJfMSA9IHJlcXVpcmUoXCIuL1ZlY3RvcjJcIik7XHJcbmV4cG9ydHMuVmVjdG9yMiA9IFZlY3RvcjJfMS5WZWN0b3IyO1xyXG52YXIgZW1pdHRlcl8xID0gcmVxdWlyZShcIi4vZW1pdHRlclwiKTtcclxuZXhwb3J0cy5FbWl0dGVyID0gZW1pdHRlcl8xLkVtaXR0ZXI7XHJcbnZhciBlbWl0dGVyXzIgPSByZXF1aXJlKFwiLi9lbWl0dGVyXCIpO1xyXG52YXIgVmVjdG9yMl8yID0gcmVxdWlyZShcIi4vVmVjdG9yMlwiKTtcclxuZnVuY3Rpb24gc3BhcmtsZSgkZWxlbSkge1xyXG4gICAgbmV3IGVtaXR0ZXJfMi5FbWl0dGVyKCRlbGVtLCB7XHJcbiAgICAgICAgbWF4UGFydGljbGVzOiAxMDAsXHJcbiAgICAgICAgbWF4TGlmZToge1xyXG4gICAgICAgICAgICB2YWx1ZTogMSxcclxuICAgICAgICAgICAgc3ByZWFkOiAwLjVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHZlbG9jaXR5OiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBuZXcgVmVjdG9yMl8yLlZlY3RvcjIoMCwgLTUpLFxyXG4gICAgICAgICAgICBzcHJlYWQ6IG5ldyBWZWN0b3IyXzIuVmVjdG9yMig3LCAyKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ3Jhdml0eTogbmV3IFZlY3RvcjJfMi5WZWN0b3IyKDAsIDAuMilcclxuICAgIH0pLnN0YXJ0KCk7XHJcbn1cclxuZXhwb3J0cy5zcGFya2xlID0gc3BhcmtsZTtcclxuIl19
