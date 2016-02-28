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
        this.updateElement(-100, -100);
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
        this.emitterElem.append(this.elem);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL1VzZXJzL2JlbmppL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9TcHJlYWQuanMiLCJzcmMvVmVjdG9yMi5qcyIsInNyYy9lbWl0dGVyLmpzIiwic3JjL3BhcnRpY2xlLmpzIiwic3JjL3BhcnRpY2xlU3lzdGVtLmpzIiwic3JjL3NwYXJrbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFZlY3RvcjJfMSA9IHJlcXVpcmUoXCIuL1ZlY3RvcjJcIik7XHJcbihmdW5jdGlvbiAoU3ByZWFkVHlwZSkge1xyXG4gICAgU3ByZWFkVHlwZVtTcHJlYWRUeXBlW1wiVW5pZm9ybVwiXSA9IDBdID0gXCJVbmlmb3JtXCI7XHJcbiAgICBTcHJlYWRUeXBlW1NwcmVhZFR5cGVbXCJOb3JtYWxcIl0gPSAxXSA9IFwiTm9ybWFsXCI7XHJcbiAgICBTcHJlYWRUeXBlW1NwcmVhZFR5cGVbXCJSZWN0VW5pZm9ybVwiXSA9IDJdID0gXCJSZWN0VW5pZm9ybVwiO1xyXG59KShleHBvcnRzLlNwcmVhZFR5cGUgfHwgKGV4cG9ydHMuU3ByZWFkVHlwZSA9IHt9KSk7XHJcbnZhciBTcHJlYWRUeXBlID0gZXhwb3J0cy5TcHJlYWRUeXBlO1xyXG52YXIgVmVjdG9yU3ByZWFkID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFZlY3RvclNwcmVhZCh2YWx1ZSwgc3ByZWFkLCBzcHJlYWRUeXBlKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgVmVjdG9yMl8xLlZlY3RvcjIgfHwgIXZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZSB8fCBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoMCwgMCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByZWFkID0gc3ByZWFkIHx8IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigwLCAwKTtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gc3ByZWFkVHlwZSB8fCBTcHJlYWRUeXBlLk5vcm1hbDtcclxuICAgICAgICAgICAgdGhpcy5jdXN0b20gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlLnZhbHVlIHx8IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigwLCAwKTtcclxuICAgICAgICAgICAgdGhpcy5zcHJlYWQgPSB2YWx1ZS5zcHJlYWQgfHwgbmV3IFZlY3RvcjJfMS5WZWN0b3IyKDAsIDApO1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSB2YWx1ZS50eXBlIHx8IFNwcmVhZFR5cGUuTm9ybWFsO1xyXG4gICAgICAgICAgICB0aGlzLmN1c3RvbSA9IHZhbHVlLmN1c3RvbSB8fCBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFZlY3RvclNwcmVhZC5wcm90b3R5cGUuc2FtcGxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmN1c3RvbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXN0b20oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PSBTcHJlYWRUeXBlLlJlY3RVbmlmb3JtKSB7XHJcbiAgICAgICAgICAgIHZhciByYW5kWCA9ICgyICogTWF0aC5yYW5kb20oKSAtIDEpICogdGhpcy5zcHJlYWQueDtcclxuICAgICAgICAgICAgdmFyIHJhbmRZID0gKDIgKiBNYXRoLnJhbmRvbSgpIC0gMSkgKiB0aGlzLnNwcmVhZC55O1xyXG4gICAgICAgICAgICB2YXIgcmFuZFYgPSBuZXcgVmVjdG9yMl8xLlZlY3RvcjIocmFuZFgsIHJhbmRZKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJhbmRWLmFkZCh0aGlzLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciByYW5kUiwgcmFuZFRoO1xyXG4gICAgICAgICAgICByYW5kVGggPSBNYXRoLlBJICogMiAqIE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT0gU3ByZWFkVHlwZS5Vbmlmb3JtKSB7XHJcbiAgICAgICAgICAgICAgICByYW5kUiA9IE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByYW5kUiA9ICgoTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpKSAtIDMpIC8gMztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcmFuZFYgPSBWZWN0b3IyXzEuVmVjdG9yMi5mcm9tUG9sYXIocmFuZFIsIHJhbmRUaCk7XHJcbiAgICAgICAgICAgIHJldHVybiByYW5kVi5oYWRhbWFyZCh0aGlzLnNwcmVhZCkuYWRkKHRoaXMudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBWZWN0b3JTcHJlYWQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChzcHIpIHtcclxuICAgICAgICB0aGlzLnZhbHVlLmFkZChzcHIudmFsdWUpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBWZWN0b3JTcHJlYWQ7XHJcbn0pKCk7XHJcbmV4cG9ydHMuVmVjdG9yU3ByZWFkID0gVmVjdG9yU3ByZWFkO1xyXG52YXIgU2NhbGFyU3ByZWFkID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFNjYWxhclNwcmVhZCh2YWx1ZSwgc3ByZWFkLCBzcHJlYWRUeXBlKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSBcIm51bWJlclwiIHx8ICF2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWUgfHwgMDtcclxuICAgICAgICAgICAgdGhpcy5zcHJlYWQgPSBzcHJlYWQgfHwgMDtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gc3ByZWFkVHlwZSB8fCBTcHJlYWRUeXBlLk5vcm1hbDtcclxuICAgICAgICAgICAgdGhpcy5jdXN0b20gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlLnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnNwcmVhZCA9IHZhbHVlLnNwcmVhZDtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gdmFsdWUudHlwZSB8fCBTcHJlYWRUeXBlLk5vcm1hbDtcclxuICAgICAgICAgICAgdGhpcy5jdXN0b20gPSB2YWx1ZS5jdXN0b20gfHwgbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBTY2FsYXJTcHJlYWQuaXNBcmcgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgcmV0dXJuIG9iaiAmJlxyXG4gICAgICAgICAgICAodHlwZW9mIG9iai52YWx1ZSA9PSBcIm51bWJlclwiIHx8XHJcbiAgICAgICAgICAgICAgICB0eXBlb2Ygb2JqLnNwcmVhZCA9PSBcIm51bWJlclwiIHx8XHJcbiAgICAgICAgICAgICAgICB0eXBlb2Ygb2JqLmN1c3RvbSA9PSBcImZ1bmN0aW9uXCIpO1xyXG4gICAgfTtcclxuICAgIFNjYWxhclNwcmVhZC5wcm90b3R5cGUuc2FtcGxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmN1c3RvbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXN0b20oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJhbmRSO1xyXG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT0gU3ByZWFkVHlwZS5Vbmlmb3JtIHx8IHRoaXMudHlwZSA9PSBTcHJlYWRUeXBlLlJlY3RVbmlmb3JtKSB7XHJcbiAgICAgICAgICAgIHJhbmRSID0gTWF0aC5yYW5kb20oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJhbmRSID0gKChNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkpIC0gMykgLyAzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmFuZFIgKiB0aGlzLnNwcmVhZCArIHRoaXMudmFsdWU7XHJcbiAgICB9O1xyXG4gICAgU2NhbGFyU3ByZWFkLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoc3ByKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZSArPSBzcHI7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFNjYWxhclNwcmVhZDtcclxufSkoKTtcclxuZXhwb3J0cy5TY2FsYXJTcHJlYWQgPSBTY2FsYXJTcHJlYWQ7XHJcbiIsInZhciBWZWN0b3IyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFZlY3RvcjIoeCwgeSkge1xyXG4gICAgICAgIHRoaXMueCA9IHggfHwgMDtcclxuICAgICAgICB0aGlzLnkgPSB5IHx8IDA7XHJcbiAgICB9XHJcbiAgICBWZWN0b3IyLmZyb21Qb2xhciA9IGZ1bmN0aW9uIChyLCB0aCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMihyICogTWF0aC5jb3ModGgpLCByICogTWF0aC5zaW4odGgpKTtcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICBpZiAodiAmJiB2LnggJiYgdi55KSB7XHJcbiAgICAgICAgICAgIHYueCA9IHRoaXMueDtcclxuICAgICAgICAgICAgdi55ID0gdGhpcy55O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLngsIHRoaXMueSk7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIFwiKFwiICsgdGhpcy54ICsgXCIsXCIgKyB0aGlzLnkgKyBcIilcIjtcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAodikge1xyXG4gICAgICAgIHRoaXMueCArPSB2Lng7XHJcbiAgICAgICAgdGhpcy55ICs9IHYueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5wbHVzID0gZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICB2YXIgdjIgPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgdjIueCArPSB2Lng7XHJcbiAgICAgICAgdjIueSArPSB2Lnk7XHJcbiAgICAgICAgcmV0dXJuIHYyO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLnN1YnRyYWN0ID0gZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICB0aGlzLnggLT0gdi54O1xyXG4gICAgICAgIHRoaXMueSAtPSB2Lnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUubWludXMgPSBmdW5jdGlvbiAodikge1xyXG4gICAgICAgIHZhciB2MiA9IHRoaXMuY2xvbmUoKTtcclxuICAgICAgICB2Mi54IC09IHYueDtcclxuICAgICAgICB2Mi55IC09IHYueTtcclxuICAgICAgICByZXR1cm4gdjI7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUubXVsdCA9IGZ1bmN0aW9uICh4LCB5KSB7XHJcbiAgICAgICAgaWYgKHggaW5zdGFuY2VvZiBWZWN0b3IyKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCAqPSB4Lng7XHJcbiAgICAgICAgICAgIHRoaXMueSAqPSB4Lnk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggKj0geDtcclxuICAgICAgICAgICAgdGhpcy55ICo9IHR5cGVvZiB5ID09PSBcIm51bWJlclwiID8geSA6IHg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLmhhZGFtYXJkID0gZnVuY3Rpb24gKHZlYykge1xyXG4gICAgICAgIHRoaXMueCAqPSB2ZWMueDtcclxuICAgICAgICB0aGlzLnkgKj0gdmVjLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55KTtcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5sZW5ndGhTcSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55O1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHYueCArIHRoaXMueSAqIHYueTtcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5kaXN0ID0gZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54IC0gdi54LCB0aGlzLnkgLSB2LnkpLmxlbmd0aCgpO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGgoKTtcclxuICAgICAgICB0aGlzLnggLz0gbGVuZ3RoO1xyXG4gICAgICAgIHRoaXMueSAvPSBsZW5ndGg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFZlY3RvcjI7XHJcbn0pKCk7XHJcbmV4cG9ydHMuVmVjdG9yMiA9IFZlY3RvcjI7XHJcbiIsInZhciBwYXJ0aWNsZVN5c3RlbV8xID0gcmVxdWlyZShcIi4vcGFydGljbGVTeXN0ZW1cIik7XHJcbnZhciBFbWl0dGVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIEVtaXR0ZXIocGFyZW50RWxlbSwgYXJncykge1xyXG4gICAgICAgIHRoaXMuZG9tRWxlbSA9ICQoXCI8ZGl2PjwvZGl2PlwiKVxyXG4gICAgICAgICAgICAuYWRkQ2xhc3MoXCJzcGFya2xlLWVtaXR0ZXJcIilcclxuICAgICAgICAgICAgLmNzcyhcInBvc2l0aW9uXCIsIFwiYWJzb2x1dGVcIilcclxuICAgICAgICAgICAgLmNzcyhcInRvcFwiLCBcIjBweFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwibGVmdFwiLCBcIjBweFwiKTtcclxuICAgICAgICBpZiAodHlwZW9mIGFyZ3MuekluZGV4ID09PSBcIm51bWJlclwiKVxyXG4gICAgICAgICAgICB0aGlzLmRvbUVsZW0uY3NzKFwiei1pbmRleFwiLCBhcmdzLnpJbmRleCk7XHJcbiAgICAgICAgJChcImJvZHlcIikuYXBwZW5kKHRoaXMuZG9tRWxlbSk7XHJcbiAgICAgICAgYXJncy5lbWl0dGVyRWxlbSA9IHRoaXMuZG9tRWxlbTtcclxuICAgICAgICBhcmdzLmVtaXR0ZXJSYXRlID0gYXJncy5yYXRlIHx8IDE2O1xyXG4gICAgICAgIHRoaXMucGFydGljbGVTeXN0ZW0gPSBuZXcgcGFydGljbGVTeXN0ZW1fMS5QYXJ0aWNsZVN5c3RlbShhcmdzKTtcclxuICAgICAgICB0aGlzLnBhcmVudEVsZW0gPSBwYXJlbnRFbGVtO1xyXG4gICAgICAgIHRoaXMucmF0ZSA9IGFyZ3MucmF0ZSB8fCAxNjtcclxuICAgICAgICB0aGlzLm9uRW1pdHRlckRlYXRoID0gYXJncy5vbkVtaXR0ZXJEZWF0aDtcclxuICAgICAgICB0aGlzLnpJbmRleCA9IHR5cGVvZiBhcmdzLnpJbmRleCA9PT0gXCJudW1iZXJcIiA/IGFyZ3MuekluZGV4IDogXCJhdXRvXCI7XHJcbiAgICB9XHJcbiAgICBFbWl0dGVyLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy51cGRhdGUoKTsgfSwgdGhpcy5yYXRlKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBFbWl0dGVyLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgRW1pdHRlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBkdCA9IHRoaXMucmF0ZSAvIDEwMDA7XHJcbiAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMucGFyZW50RWxlbS5vZmZzZXQoKTtcclxuICAgICAgICB2YXIgb2Zmc2V0WCA9IG9mZnNldC5sZWZ0ICsgdGhpcy5wYXJlbnRFbGVtLm91dGVyV2lkdGgoKSAvIDI7XHJcbiAgICAgICAgdmFyIG9mZnNldFkgPSBvZmZzZXQudG9wICsgdGhpcy5wYXJlbnRFbGVtLm91dGVySGVpZ2h0KCkgLyAyO1xyXG4gICAgICAgIHRoaXMucGFydGljbGVTeXN0ZW0udXBkYXRlKGR0LCBvZmZzZXRYLCBvZmZzZXRZKTtcclxuICAgICAgICBpZiAoIXRoaXMucGFydGljbGVTeXN0ZW0uYWxpdmUpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZG9tRWxlbS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9uRW1pdHRlckRlYXRoID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uRW1pdHRlckRlYXRoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHJldHVybiBFbWl0dGVyO1xyXG59KSgpO1xyXG5leHBvcnRzLkVtaXR0ZXIgPSBFbWl0dGVyO1xyXG4iLCJ2YXIgVmVjdG9yMl8xID0gcmVxdWlyZShcIi4vVmVjdG9yMlwiKTtcclxudmFyIFBhcnRpY2xlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFBhcnRpY2xlKGFyZ3MpIHtcclxuICAgICAgICB0aGlzLmVtaXR0ZXJFbGVtID0gYXJncy5lbWl0dGVyRWxlbSB8fCAkKFwiYm9keVwiKTtcclxuICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbkZpZWxkID0gYXJncy5hY2NlbGVyYXRpb25GaWVsZDtcclxuICAgICAgICB0aGlzLmVsZW1GYWN0b3J5ID0gYXJncy5lbGVtRmFjdG9yeTtcclxuICAgICAgICB0aGlzLmVtaXR0ZXJSYXRlID0gYXJncy5lbWl0dGVyUmF0ZSB8fCAxNjtcclxuICAgICAgICB0aGlzLnNjYWxlID0gYXJncy5zY2FsZSB8fCAxO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gPSBhcmdzLnJvdGF0aW9uIHx8IDA7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvblZlbG9jaXR5ID0gYXJncy5yb3RhdGlvblZlbG9jaXR5IHx8IDA7XHJcbiAgICAgICAgdGhpcy5zZXR1cE9wYWNpdHkoYXJncy5vcGFjaXR5KTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gYXJncy5wb3NpdGlvbiA/IGFyZ3MucG9zaXRpb24uY2xvbmUoKSA6IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigpO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBhcmdzLnZlbG9jaXR5ID8gYXJncy52ZWxvY2l0eS5jbG9uZSgpIDogbmV3IFZlY3RvcjJfMS5WZWN0b3IyKCk7XHJcbiAgICAgICAgdGhpcy5hY2NlbGVyYXRpb24gPSBhcmdzLmFjY2VsZXJhdGlvbiA/IGFyZ3MuYWNjZWxlcmF0aW9uLmNsb25lKCkgOiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoKTtcclxuICAgICAgICB0aGlzLmhpZ2hlck9yZGVyID0gW107XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJncy5oaWdoZXJPcmRlcikpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmhpZ2hlck9yZGVyLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZ2hlck9yZGVyLnB1c2goYXJncy5oaWdoZXJPcmRlcltpXSA/IGFyZ3MuaGlnaGVyT3JkZXJbaV0uY2xvbmUoKSA6IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1heExpZmUgPSB0eXBlb2YgYXJncy5tYXhMaWZlID09IFwibnVtYmVyXCIgPyBhcmdzLm1heExpZmUgOiAxO1xyXG4gICAgICAgIHRoaXMubGlmZSA9IDA7XHJcbiAgICAgICAgdGhpcy5hbGl2ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5lbGVtID0gbnVsbDtcclxuICAgICAgICB0aGlzLm5ld0VsZW1lbnQoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUVsZW1lbnQoLTEwMCwgLTEwMCk7XHJcbiAgICB9XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGR0KSB7XHJcbiAgICAgICAgdGhpcy5saWZlICs9IGR0O1xyXG4gICAgICAgIGlmICh0aGlzLm1heExpZmUgPD0gdGhpcy5saWZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWxpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5lbGVtICYmIHRoaXMuZWxlbS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5lbGVtID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuYWNjZWxlcmF0aW9uRmllbGQpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVCeUZpZWxkKGR0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQnlUYXlsb3IoZHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJvdGF0aW9uICs9IHRoaXMucm90YXRpb25WZWxvY2l0eTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUudXBkYXRlRWxlbWVudCA9IGZ1bmN0aW9uIChvZmZzZXRYLCBvZmZzZXRZKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmFsaXZlIHx8ICF0aGlzLmVsZW0pXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLmVsZW1cclxuICAgICAgICAgICAgLmNzcyhcImxlZnRcIiwgdGhpcy5wb3NpdGlvbi54ICsgb2Zmc2V0WCArIFwicHhcIilcclxuICAgICAgICAgICAgLmNzcyhcInRvcFwiLCB0aGlzLnBvc2l0aW9uLnkgKyBvZmZzZXRZICsgXCJweFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwib3BhY2l0eVwiLCB0aGlzLmN1cnJlbnRPcGFjaXR5KCkpO1xyXG4gICAgICAgIHRoaXMuZWxlbS5jc3MoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoLTUwJSwgLTUwJSkgcm90YXRlKFwiICsgTWF0aC5mbG9vcih0aGlzLnJvdGF0aW9uKSArIFwiZGVnKSBzY2FsZShcIiArIHRoaXMuc2NhbGUgKyBcIilcIik7XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGUucHJvdG90eXBlLnVwZGF0ZUJ5RmllbGQgPSBmdW5jdGlvbiAoZHQpIHtcclxuICAgICAgICB2YXIgYWNjZWwgPSB0aGlzLmFjY2VsZXJhdGlvbkZpZWxkKHRoaXMucG9zaXRpb24pO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkuYWRkKGFjY2VsLnNhbXBsZSgpKTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLmFkZCh0aGlzLnZlbG9jaXR5KTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUudXBkYXRlQnlUYXlsb3IgPSBmdW5jdGlvbiAoZHQpIHtcclxuICAgICAgICB2YXIgZGVsID0gbnVsbDtcclxuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy5oaWdoZXJPcmRlci5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xyXG4gICAgICAgICAgICBpZiAoZGVsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZ2hlck9yZGVyW2ldLmFkZChkZWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRlbCA9IHRoaXMuaGlnaGVyT3JkZXJbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5hY2NlbGVyYXRpb24uYWRkKGRlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudmVsb2NpdHkuYWRkKHRoaXMuYWNjZWxlcmF0aW9uKTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLmFkZCh0aGlzLnZlbG9jaXR5KTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3VycmVudExpZmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGlmZSAvIHRoaXMubWF4TGlmZTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuc2V0dXBPcGFjaXR5ID0gZnVuY3Rpb24gKG9wYWNpdHkpIHtcclxuICAgICAgICBpZiAodHlwZW9mIG9wYWNpdHkgPT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICB0aGlzLm9wYWNpdHlOdW1iZXIgPSBvcGFjaXR5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KG9wYWNpdHkpKSB7XHJcbiAgICAgICAgICAgIG9wYWNpdHkuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYS5saWZlIC0gYi5saWZlOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5vcGFjaXR5QXJyYXkgPSBvcGFjaXR5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2Ygb3BhY2l0eSA9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5vcGFjaXR5RnVuY3Rpb24gPSBvcGFjaXR5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vcGFjaXR5TnVtYmVyID0gMTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGUucHJvdG90eXBlLmN1cnJlbnRPcGFjaXR5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMub3BhY2l0eUFycmF5KSkge1xyXG4gICAgICAgICAgICB2YXIgbGlmZSA9IHRoaXMuY3VycmVudExpZmUoKTtcclxuICAgICAgICAgICAgdmFyIHByZXYgPSBudWxsLCBuZXh0ID0gbnVsbDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wYWNpdHlBcnJheS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9wID0gdGhpcy5vcGFjaXR5QXJyYXlbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAob3AubGlmZSA8PSBsaWZlKVxyXG4gICAgICAgICAgICAgICAgICAgIHByZXYgPSBvcDtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCFuZXh0KVxyXG4gICAgICAgICAgICAgICAgICAgIG5leHQgPSBvcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJldiAmJiBuZXh0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZExpZmUgPSBuZXh0LmxpZmUgLSBwcmV2LmxpZmU7XHJcbiAgICAgICAgICAgICAgICB2YXIgZE9wYWNpdHkgPSBuZXh0LnZhbHVlIC0gcHJldi52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHZhciBhbW91bnRJbnRvID0gbGlmZSAtIHByZXYubGlmZTtcclxuICAgICAgICAgICAgICAgIHZhciBwZXJjZW50QWNyb3NzID0gYW1vdW50SW50byAvIGRMaWZlO1xyXG4gICAgICAgICAgICAgICAgdmFyIG9wYWNpdHlPZmZzZXQgPSBwZXJjZW50QWNyb3NzICogZE9wYWNpdHk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3BhY2l0eU9mZnNldCArIHByZXYudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAocHJldikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZXYudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAobmV4dCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgdGhpcy5vcGFjaXR5RnVuY3Rpb24gPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIHZhciBsaWZlID0gdGhpcy5jdXJyZW50TGlmZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcGFjaXR5RnVuY3Rpb24obGlmZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiB0aGlzLm9wYWNpdHlOdW1iZXIgPT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcGFjaXR5TnVtYmVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5uZXdFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmVsZW1GYWN0b3J5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbSA9IHRoaXMuZWxlbUZhY3RvcnkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmVtaXR0ZXJFbGVtLmFwcGVuZCh0aGlzLmVsZW0pO1xyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBlbGVtID0gJChcIjxkaXY+PC9kaXY+XCIpO1xyXG4gICAgICAgIGVsZW0uY3NzKFwicG9zaXRpb25cIiwgXCJhYnNvbHV0ZVwiKTtcclxuICAgICAgICB0aGlzLmR1c3RFbGVtZW50KGVsZW0pO1xyXG4gICAgICAgIHRoaXMuYmxlbmRNb2RlRWxlbWVudChlbGVtKTtcclxuICAgICAgICB0aGlzLmVsZW0gPSBlbGVtO1xyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jaXJjbGVFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgICB2YXIgcmFkaXVzID0gMi41O1xyXG4gICAgICAgIGVsZW1cclxuICAgICAgICAgICAgLmNzcyhcIndpZHRoXCIsICgyICogcmFkaXVzKSArIFwicHhcIilcclxuICAgICAgICAgICAgLmNzcyhcImhlaWdodFwiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJib3JkZXItcmFkaXVzXCIsICgyICogcmFkaXVzKSArIFwicHhcIilcclxuICAgICAgICAgICAgLmNzcyhcImJhY2tncm91bmRcIiwgXCJyZWRcIik7XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGUucHJvdG90eXBlLmR1c3RFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgICB2YXIgY29sb3IgPSB7IHI6IDAsIGc6IDAsIGI6IDAgfTtcclxuICAgICAgICB2YXIgY2NvbG9yID0gXCJyZ2JhKDAsIDAsIDAsIDEpXCI7XHJcbiAgICAgICAgdmFyIHJhZGl1cyA9IDMuNTtcclxuICAgICAgICBlbGVtXHJcbiAgICAgICAgICAgIC5jc3MoXCJ3aWR0aFwiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJoZWlnaHRcIiwgKDIgKiByYWRpdXMpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwiYm9yZGVyLXJhZGl1c1wiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJiYWNrZ3JvdW5kXCIsIFwicmVkXCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJiYWNrZ3JvdW5kXCIsIFwicmFkaWFsLWdyYWRpZW50KGVsbGlwc2UgYXQgY2VudGVyLCBcIiArIGNjb2xvciArIFwiIDAlLHJnYmEoMCwwLDAsMCkgNzAlKVwiKTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuZmlyZUVsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbSkge1xyXG4gICAgICAgIHZhciByYWRpdXMgPSA5O1xyXG4gICAgICAgIGVsZW1cclxuICAgICAgICAgICAgLmNzcyhcIndpZHRoXCIsICgyICogcmFkaXVzKSArIFwicHhcIilcclxuICAgICAgICAgICAgLmNzcyhcImhlaWdodFwiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJib3JkZXItcmFkaXVzXCIsICgyICogcmFkaXVzKSArIFwicHhcIilcclxuICAgICAgICAgICAgLmNzcyhcImJhY2tncm91bmRcIiwgXCJyZWRcIilcclxuICAgICAgICAgICAgLmNzcyhcImJhY2tncm91bmRcIiwgXCJyYWRpYWwtZ3JhZGllbnQoZWxsaXBzZSBhdCBjZW50ZXIsIHJnYmEoMjQ5LDI0OSw0OSwxKSAwJSxyZ2JhKDI1Miw0Nyw0NywwLjYyKSAzMSUscmdiYSgyNDQsNTcsNTEsMCkgNzAlKVwiKTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuYmxlbmRNb2RlRWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtKSB7XHJcbiAgICAgICAgZWxlbVxyXG4gICAgICAgICAgICAuY3NzKFwiYmFja2dyb3VuZC1ibGVuZC1tb2RlXCIsIFwibXVsdGlwbHlcIik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFBhcnRpY2xlO1xyXG59KSgpO1xyXG5leHBvcnRzLlBhcnRpY2xlID0gUGFydGljbGU7XHJcbiIsInZhciBwYXJ0aWNsZV8xID0gcmVxdWlyZShcIi4vcGFydGljbGVcIik7XHJcbnZhciBTcHJlYWRfMSA9IHJlcXVpcmUoXCIuL1NwcmVhZFwiKTtcclxudmFyIFBhcnRpY2xlU3lzdGVtID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFBhcnRpY2xlU3lzdGVtKGFyZ3MpIHtcclxuICAgICAgICB0aGlzLmxpZmUgPSAwO1xyXG4gICAgICAgIHRoaXMubGFzdFBhcnRpY2xlQWRkZWQgPSAwO1xyXG4gICAgICAgIHRoaXMuZHlpbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmFsaXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IGFyZ3M7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMgPSBbXTtcclxuICAgICAgICB0aGlzLm1heExpZmUgPSBhcmdzLm1heExpZmUgPyBuZXcgU3ByZWFkXzEuU2NhbGFyU3ByZWFkKGFyZ3MubWF4TGlmZSkgOiBuZXcgU3ByZWFkXzEuU2NhbGFyU3ByZWFkKDUpO1xyXG4gICAgICAgIHRoaXMubWF4UGFydGljbGVzID0gYXJncy5tYXhQYXJ0aWNsZXMgfHwgMTAwO1xyXG4gICAgICAgIHRoaXMuZW1pdHRlck1heExpZmUgPSBhcmdzLmVtaXR0ZXJNYXhMaWZlID8gYXJncy5lbWl0dGVyTWF4TGlmZSA6IG51bGw7XHJcbiAgICAgICAgdGhpcy5lbWl0dGVyRWxlbSA9IGFyZ3MuZW1pdHRlckVsZW0gfHwgJChcImJvZHlcIik7XHJcbiAgICAgICAgdGhpcy5lbWl0dGVyUmF0ZSA9IGFyZ3MuZW1pdHRlclJhdGUgfHwgMTY7XHJcbiAgICAgICAgdGhpcy5hY2NlbGVyYXRpb25GaWVsZCA9IGFyZ3MuYWNjZWxlcmF0aW9uRmllbGQ7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZUVsZW1GYWN0b3J5ID0gYXJncy5wYXJ0aWNsZUVsZW1GYWN0b3J5O1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSBuZXcgU3ByZWFkXzEuU2NhbGFyU3ByZWFkKGFyZ3Muc2NhbGUpO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gPSBuZXcgU3ByZWFkXzEuU2NhbGFyU3ByZWFkKGFyZ3Mucm90YXRpb24pO1xyXG4gICAgICAgIHRoaXMucm90YXRpb25WZWxvY2l0eSA9IG5ldyBTcHJlYWRfMS5TY2FsYXJTcHJlYWQoYXJncy5yb3RhdGlvblZlbG9jaXR5KTtcclxuICAgICAgICBpZiAodHlwZW9mIGFyZ3Mub3BhY2l0eSA9PT0gXCJudW1iZXJcIiB8fCBTcHJlYWRfMS5TY2FsYXJTcHJlYWQuaXNBcmcoYXJncy5vcGFjaXR5KSkge1xyXG4gICAgICAgICAgICB0aGlzLm9wYWNpdHkgPSBuZXcgU3ByZWFkXzEuU2NhbGFyU3ByZWFkKGFyZ3Mub3BhY2l0eSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm9wYWNpdHkgPSBhcmdzLm9wYWNpdHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgU3ByZWFkXzEuVmVjdG9yU3ByZWFkKGFyZ3MucG9zaXRpb24pO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBuZXcgU3ByZWFkXzEuVmVjdG9yU3ByZWFkKGFyZ3MudmVsb2NpdHkpO1xyXG4gICAgICAgIHRoaXMuYWNjZWxlcmF0aW9uID0gbmV3IFNwcmVhZF8xLlZlY3RvclNwcmVhZChhcmdzLmFjY2VsZXJhdGlvbik7XHJcbiAgICAgICAgdGhpcy5oaWdoZXJPcmRlciA9IFtdO1xyXG4gICAgICAgIGlmIChhcmdzLmdyYXZpdHkpXHJcbiAgICAgICAgICAgIHRoaXMuYWNjZWxlcmF0aW9uLnZhbHVlLmFkZChhcmdzLmdyYXZpdHkpO1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGFyZ3MuaGlnaGVyT3JkZXIpKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5oaWdoZXJPcmRlci5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWdoZXJPcmRlci5wdXNoKG5ldyBTcHJlYWRfMS5WZWN0b3JTcHJlYWQoYXJncy5oaWdoZXJPcmRlcltpXSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgUGFydGljbGVTeXN0ZW0ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkdCwgb2Zmc2V0WCwgb2Zmc2V0WSkge1xyXG4gICAgICAgIHRoaXMubGlmZSArPSBkdDtcclxuICAgICAgICBpZiAoIXRoaXMuYWxpdmUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBpZiAodGhpcy5keWluZyAmJiB0aGlzLnBhcnRpY2xlcy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmFsaXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmVtaXR0ZXJNYXhMaWZlID09PSBcIm51bWJlclwiICYmIHRoaXMuZW1pdHRlck1heExpZmUgPiAwICYmIHRoaXMubGlmZSA+PSB0aGlzLmVtaXR0ZXJNYXhMaWZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHlpbmcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbmV3UGFydGljbGVzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBhcnRpY2xlcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICB2YXIgcCA9IHRoaXMucGFydGljbGVzW2ldO1xyXG4gICAgICAgICAgICBwLnVwZGF0ZShkdCk7XHJcbiAgICAgICAgICAgIGlmICghcC5hbGl2ZSlcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBwLnVwZGF0ZUVsZW1lbnQob2Zmc2V0WCwgb2Zmc2V0WSk7XHJcbiAgICAgICAgICAgIG5ld1BhcnRpY2xlcy5wdXNoKHApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgY3ljbGVEdXJhdGlvbiA9IDU7XHJcbiAgICAgICAgdmFyIGN5Y2xlVGlja3MgPSBjeWNsZUR1cmF0aW9uIC8gKHRoaXMuZW1pdHRlclJhdGUgLyAxMDAwKTtcclxuICAgICAgICB2YXIgbmV3UGFydGljbGVzUGVyVGljayA9IHRoaXMubWF4UGFydGljbGVzIC8gY3ljbGVUaWNrcztcclxuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IChuZXdQYXJ0aWNsZXNQZXJUaWNrIC0gTWF0aC5mbG9vcihuZXdQYXJ0aWNsZXNQZXJUaWNrKSkpIHtcclxuICAgICAgICAgICAgbmV3UGFydGljbGVzUGVyVGljayA9IE1hdGguY2VpbChuZXdQYXJ0aWNsZXNQZXJUaWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG5ld1BhcnRpY2xlc1BlclRpY2sgPSBNYXRoLmZsb29yKG5ld1BhcnRpY2xlc1BlclRpY2spO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuZHlpbmcgJiYgbmV3UGFydGljbGVzLmxlbmd0aCA8IHRoaXMubWF4UGFydGljbGVzKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmV3UGFydGljbGVzUGVyVGljazsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQYXJ0aWNsZXMucHVzaCh0aGlzLmNyZWF0ZVBhcnRpY2xlKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucGFydGljbGVzID0gbmV3UGFydGljbGVzO1xyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlU3lzdGVtLnByb3RvdHlwZS5jcmVhdGVQYXJ0aWNsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IHBhcnRpY2xlXzEuUGFydGljbGUoe1xyXG4gICAgICAgICAgICBtYXhMaWZlOiB0aGlzLm1heExpZmUuc2FtcGxlKCksXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiB0aGlzLnBvc2l0aW9uLnNhbXBsZSgpLFxyXG4gICAgICAgICAgICB2ZWxvY2l0eTogdGhpcy52ZWxvY2l0eSAmJiB0aGlzLnZlbG9jaXR5LnNhbXBsZSgpLFxyXG4gICAgICAgICAgICBhY2NlbGVyYXRpb246IHRoaXMuYWNjZWxlcmF0aW9uICYmIHRoaXMuYWNjZWxlcmF0aW9uLnNhbXBsZSgpLFxyXG4gICAgICAgICAgICBoaWdoZXJPcmRlcjogdGhpcy5oaWdoZXJPcmRlciAmJiB0aGlzLmhpZ2hlck9yZGVyLm1hcChmdW5jdGlvbiAoeCkgeyByZXR1cm4geC5zYW1wbGUoKTsgfSksXHJcbiAgICAgICAgICAgIGFjY2VsZXJhdGlvbkZpZWxkOiB0aGlzLmFjY2VsZXJhdGlvbkZpZWxkLFxyXG4gICAgICAgICAgICBlbWl0dGVyRWxlbTogdGhpcy5lbWl0dGVyRWxlbSB8fCAkKFwiYm9keVwiKSxcclxuICAgICAgICAgICAgZWxlbUZhY3Rvcnk6IHRoaXMucGFydGljbGVFbGVtRmFjdG9yeSxcclxuICAgICAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGUuc2FtcGxlKCksXHJcbiAgICAgICAgICAgIHJvdGF0aW9uOiB0aGlzLnJvdGF0aW9uLnNhbXBsZSgpLFxyXG4gICAgICAgICAgICByb3RhdGlvblZlbG9jaXR5OiB0aGlzLnJvdGF0aW9uVmVsb2NpdHkuc2FtcGxlKCksXHJcbiAgICAgICAgICAgIG9wYWNpdHk6ICh0aGlzLm9wYWNpdHkgaW5zdGFuY2VvZiBTcHJlYWRfMS5TY2FsYXJTcHJlYWQpID9cclxuICAgICAgICAgICAgICAgIHRoaXMub3BhY2l0eS5zYW1wbGUoKSA6XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wYWNpdHksXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFBhcnRpY2xlU3lzdGVtO1xyXG59KSgpO1xyXG5leHBvcnRzLlBhcnRpY2xlU3lzdGVtID0gUGFydGljbGVTeXN0ZW07XHJcbiIsInZhciBTcHJlYWRfMSA9IHJlcXVpcmUoXCIuL1NwcmVhZFwiKTtcclxuZXhwb3J0cy5WZWN0b3JTcHJlYWQgPSBTcHJlYWRfMS5WZWN0b3JTcHJlYWQ7XHJcbmV4cG9ydHMuU2NhbGFyU3ByZWFkID0gU3ByZWFkXzEuU2NhbGFyU3ByZWFkO1xyXG5leHBvcnRzLlNwcmVhZFR5cGUgPSBTcHJlYWRfMS5TcHJlYWRUeXBlO1xyXG52YXIgVmVjdG9yMl8xID0gcmVxdWlyZShcIi4vVmVjdG9yMlwiKTtcclxuZXhwb3J0cy5WZWN0b3IyID0gVmVjdG9yMl8xLlZlY3RvcjI7XHJcbnZhciBlbWl0dGVyXzEgPSByZXF1aXJlKFwiLi9lbWl0dGVyXCIpO1xyXG5leHBvcnRzLkVtaXR0ZXIgPSBlbWl0dGVyXzEuRW1pdHRlcjtcclxudmFyIGVtaXR0ZXJfMiA9IHJlcXVpcmUoXCIuL2VtaXR0ZXJcIik7XHJcbnZhciBWZWN0b3IyXzIgPSByZXF1aXJlKFwiLi9WZWN0b3IyXCIpO1xyXG5mdW5jdGlvbiBzcGFya2xlKCRlbGVtKSB7XHJcbiAgICBuZXcgZW1pdHRlcl8yLkVtaXR0ZXIoJGVsZW0sIHtcclxuICAgICAgICBtYXhQYXJ0aWNsZXM6IDEwMCxcclxuICAgICAgICBtYXhMaWZlOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiAxLFxyXG4gICAgICAgICAgICBzcHJlYWQ6IDAuNVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdmVsb2NpdHk6IHtcclxuICAgICAgICAgICAgdmFsdWU6IG5ldyBWZWN0b3IyXzIuVmVjdG9yMigwLCAtNSksXHJcbiAgICAgICAgICAgIHNwcmVhZDogbmV3IFZlY3RvcjJfMi5WZWN0b3IyKDcsIDIpXHJcbiAgICAgICAgfSxcclxuICAgICAgICBncmF2aXR5OiBuZXcgVmVjdG9yMl8yLlZlY3RvcjIoMCwgMC4yKVxyXG4gICAgfSkuc3RhcnQoKTtcclxufVxyXG5leHBvcnRzLnNwYXJrbGUgPSBzcGFya2xlO1xyXG4iXX0=
