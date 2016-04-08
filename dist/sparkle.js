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
        this.makeElement(args);
        args.canvas = this.canvas;
        args.tickRate = args.tickRate || 16;
        this.particleSystem = new particleSystem_1.ParticleSystem(args);
        this.parentElem = parentElem;
        this.tickRate = args.tickRate || 16;
        this.onEmitterDeath = args.onEmitterDeath;
        this.zIndex = typeof args.zIndex === "number" ? args.zIndex : "auto";
    }
    Emitter.prototype.makeElement = function (args) {
        this.canvas = $("<canvas></canvas>")
            .addClass("sparkle-emitter")
            .css({
            "position": "absolute",
            "top": "0px",
            "left": "0px",
            "pointer-events": "none"
        });
        if (typeof args.zIndex === "number")
            this.canvas.css("z-index", args.zIndex);
        $("body").append(this.canvas);
        this.ctx = this.canvas[0].getContext('2d');
    };
    Emitter.prototype.start = function () {
        var _this = this;
        this.interval = setInterval(function () { return _this.update(); }, this.tickRate);
        this.render();
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
        var dt = this.tickRate / 1000;
        this.particleSystem.update(dt);
        if (!this.particleSystem.alive) {
            this.stop();
            $(this.canvas).remove();
            if (typeof this.onEmitterDeath === "function")
                this.onEmitterDeath();
        }
        this.updateLock = false;
    };
    Emitter.prototype.render = function () {
        var _this = this;
        if (!this.particleSystem.alive)
            return;
        var offset = this.parentElem.offset();
        var offsetX = offset.left + this.parentElem.outerWidth() / 2;
        var offsetY = offset.top + this.parentElem.outerHeight() / 2;
        this.particleSystem.render(this.ctx, offsetX, offsetY);
        requestAnimationFrame(function () { return _this.render(); });
    };
    return Emitter;
})();
exports.Emitter = Emitter;

},{"./particleSystem":5}],4:[function(require,module,exports){
var Vector2_1 = require("./Vector2");
var Particle = (function () {
    function Particle(args) {
        this.accelerationField = args.accelerationField;
        this.elemFactory = args.elemFactory;
        this.tickRate = args.tickRate || 16;
        this.sprite = args.sprite;
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
    Particle.prototype.render = function (ctx, offsetX, offsetY) {
        ctx.save();
        ctx.translate(this.position.x + offsetX, this.position.y + offsetY);
        var width = this.sprite.width || 1;
        var height = this.sprite.height || 1;
        ctx.translate(this.scale * width / 2, this.scale * height / 2);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.currentOpacity();
        ctx.drawImage(this.sprite, -this.scale * width / 2, -this.scale * height / 2);
        ctx.globalAlpha = 1;
        ctx.restore();
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
        this.canvas = args.canvas;
        this.ctx = args.ctx;
        this.tickRate = args.tickRate || 16;
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
    ParticleSystem.prototype.update = function (dt) {
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
            newParticles.push(p);
        }
        var newParticlesPerTick = this.emitRate;
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
    ParticleSystem.prototype.render = function (ctx, offsetX, offsetY) {
        for (var i = 0; i < this.particles.length; ++i) {
            var p = this.particles[i];
            p.render(ctx, offsetX, offsetY);
        }
    };
    ParticleSystem.prototype.sampleSprite = function () {
    };
    ParticleSystem.prototype.createParticle = function () {
        return new particle_1.Particle({
            maxLife: this.maxLife.sample(),
            position: this.position.sample(),
            velocity: this.velocity && this.velocity.sample(),
            acceleration: this.acceleration && this.acceleration.sample(),
            higherOrder: this.higherOrder && this.higherOrder.map(function (x) { return x.sample(); }),
            accelerationField: this.accelerationField,
            elemFactory: this.particleElemFactory,
            sprite: this.sprite,
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
    var sprite = $("<canvas></canvas>")[0];
    sprite.width = 16;
    sprite.height = 16;
    var ctx = sprite.getContext('2d');
    ctx.beginPath();
    ctx.arc(8, 8, 8, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'red';
    ctx.fill();
    new emitter_2.Emitter($elem, {
        maxParticles: 100,
        emitRate: 1,
        sprite: sprite,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL1VzZXJzL2JlbmppL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9TcHJlYWQuanMiLCJzcmMvVmVjdG9yMi5qcyIsInNyYy9lbWl0dGVyLmpzIiwic3JjL3BhcnRpY2xlLmpzIiwic3JjL3BhcnRpY2xlU3lzdGVtLmpzIiwic3JjL3NwYXJrbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBWZWN0b3IyXzEgPSByZXF1aXJlKFwiLi9WZWN0b3IyXCIpO1xyXG4oZnVuY3Rpb24gKFNwcmVhZFR5cGUpIHtcclxuICAgIFNwcmVhZFR5cGVbU3ByZWFkVHlwZVtcIlVuaWZvcm1cIl0gPSAwXSA9IFwiVW5pZm9ybVwiO1xyXG4gICAgU3ByZWFkVHlwZVtTcHJlYWRUeXBlW1wiTm9ybWFsXCJdID0gMV0gPSBcIk5vcm1hbFwiO1xyXG4gICAgU3ByZWFkVHlwZVtTcHJlYWRUeXBlW1wiUmVjdFVuaWZvcm1cIl0gPSAyXSA9IFwiUmVjdFVuaWZvcm1cIjtcclxufSkoZXhwb3J0cy5TcHJlYWRUeXBlIHx8IChleHBvcnRzLlNwcmVhZFR5cGUgPSB7fSkpO1xyXG52YXIgU3ByZWFkVHlwZSA9IGV4cG9ydHMuU3ByZWFkVHlwZTtcclxudmFyIFZlY3RvclNwcmVhZCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBWZWN0b3JTcHJlYWQodmFsdWUsIHNwcmVhZCwgc3ByZWFkVHlwZSkge1xyXG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFZlY3RvcjJfMS5WZWN0b3IyIHx8ICF2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWUgfHwgbmV3IFZlY3RvcjJfMS5WZWN0b3IyKDAsIDApO1xyXG4gICAgICAgICAgICB0aGlzLnNwcmVhZCA9IHNwcmVhZCB8fCBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoMCwgMCk7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHNwcmVhZFR5cGUgfHwgU3ByZWFkVHlwZS5Ob3JtYWw7XHJcbiAgICAgICAgICAgIHRoaXMuY3VzdG9tID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZS52YWx1ZSB8fCBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoMCwgMCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByZWFkID0gdmFsdWUuc3ByZWFkIHx8IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigwLCAwKTtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gdmFsdWUudHlwZSB8fCBTcHJlYWRUeXBlLk5vcm1hbDtcclxuICAgICAgICAgICAgdGhpcy5jdXN0b20gPSB2YWx1ZS5jdXN0b20gfHwgbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBWZWN0b3JTcHJlYWQucHJvdG90eXBlLnNhbXBsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXN0b20pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VzdG9tKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT0gU3ByZWFkVHlwZS5SZWN0VW5pZm9ybSkge1xyXG4gICAgICAgICAgICB2YXIgcmFuZFggPSAoMiAqIE1hdGgucmFuZG9tKCkgLSAxKSAqIHRoaXMuc3ByZWFkLng7XHJcbiAgICAgICAgICAgIHZhciByYW5kWSA9ICgyICogTWF0aC5yYW5kb20oKSAtIDEpICogdGhpcy5zcHJlYWQueTtcclxuICAgICAgICAgICAgdmFyIHJhbmRWID0gbmV3IFZlY3RvcjJfMS5WZWN0b3IyKHJhbmRYLCByYW5kWSk7XHJcbiAgICAgICAgICAgIHJldHVybiByYW5kVi5hZGQodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgcmFuZFIsIHJhbmRUaDtcclxuICAgICAgICAgICAgcmFuZFRoID0gTWF0aC5QSSAqIDIgKiBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy50eXBlID09IFNwcmVhZFR5cGUuVW5pZm9ybSkge1xyXG4gICAgICAgICAgICAgICAgcmFuZFIgPSBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmFuZFIgPSAoKE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSkgLSAzKSAvIDM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHJhbmRWID0gVmVjdG9yMl8xLlZlY3RvcjIuZnJvbVBvbGFyKHJhbmRSLCByYW5kVGgpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmFuZFYuaGFkYW1hcmQodGhpcy5zcHJlYWQpLmFkZCh0aGlzLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yU3ByZWFkLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoc3ByKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZS5hZGQoc3ByLnZhbHVlKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gVmVjdG9yU3ByZWFkO1xyXG59KSgpO1xyXG5leHBvcnRzLlZlY3RvclNwcmVhZCA9IFZlY3RvclNwcmVhZDtcclxudmFyIFNjYWxhclNwcmVhZCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBTY2FsYXJTcHJlYWQodmFsdWUsIHNwcmVhZCwgc3ByZWFkVHlwZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gXCJudW1iZXJcIiB8fCAhdmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlIHx8IDA7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByZWFkID0gc3ByZWFkIHx8IDA7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHNwcmVhZFR5cGUgfHwgU3ByZWFkVHlwZS5Ob3JtYWw7XHJcbiAgICAgICAgICAgIHRoaXMuY3VzdG9tID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZS52YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5zcHJlYWQgPSB2YWx1ZS5zcHJlYWQ7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHZhbHVlLnR5cGUgfHwgU3ByZWFkVHlwZS5Ob3JtYWw7XHJcbiAgICAgICAgICAgIHRoaXMuY3VzdG9tID0gdmFsdWUuY3VzdG9tIHx8IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgU2NhbGFyU3ByZWFkLmlzQXJnID0gZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgIHJldHVybiBvYmogJiZcclxuICAgICAgICAgICAgKHR5cGVvZiBvYmoudmFsdWUgPT0gXCJudW1iZXJcIiB8fFxyXG4gICAgICAgICAgICAgICAgdHlwZW9mIG9iai5zcHJlYWQgPT0gXCJudW1iZXJcIiB8fFxyXG4gICAgICAgICAgICAgICAgdHlwZW9mIG9iai5jdXN0b20gPT0gXCJmdW5jdGlvblwiKTtcclxuICAgIH07XHJcbiAgICBTY2FsYXJTcHJlYWQucHJvdG90eXBlLnNhbXBsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXN0b20pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VzdG9tKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByYW5kUjtcclxuICAgICAgICBpZiAodGhpcy50eXBlID09IFNwcmVhZFR5cGUuVW5pZm9ybSB8fCB0aGlzLnR5cGUgPT0gU3ByZWFkVHlwZS5SZWN0VW5pZm9ybSkge1xyXG4gICAgICAgICAgICByYW5kUiA9IE1hdGgucmFuZG9tKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByYW5kUiA9ICgoTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpKSAtIDMpIC8gMztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJhbmRSICogdGhpcy5zcHJlYWQgKyB0aGlzLnZhbHVlO1xyXG4gICAgfTtcclxuICAgIFNjYWxhclNwcmVhZC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHNwcikge1xyXG4gICAgICAgIHRoaXMudmFsdWUgKz0gc3ByO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBTY2FsYXJTcHJlYWQ7XHJcbn0pKCk7XHJcbmV4cG9ydHMuU2NhbGFyU3ByZWFkID0gU2NhbGFyU3ByZWFkO1xyXG4iLCJ2YXIgVmVjdG9yMiA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBWZWN0b3IyKHgsIHkpIHtcclxuICAgICAgICB0aGlzLnggPSB4IHx8IDA7XHJcbiAgICAgICAgdGhpcy55ID0geSB8fCAwO1xyXG4gICAgfVxyXG4gICAgVmVjdG9yMi5mcm9tUG9sYXIgPSBmdW5jdGlvbiAociwgdGgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIociAqIE1hdGguY29zKHRoKSwgciAqIE1hdGguc2luKHRoKSk7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgaWYgKHYgJiYgdi54ICYmIHYueSkge1xyXG4gICAgICAgICAgICB2LnggPSB0aGlzLng7XHJcbiAgICAgICAgICAgIHYueSA9IHRoaXMueTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54LCB0aGlzLnkpO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBcIihcIiArIHRoaXMueCArIFwiLFwiICsgdGhpcy55ICsgXCIpXCI7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICB0aGlzLnggKz0gdi54O1xyXG4gICAgICAgIHRoaXMueSArPSB2Lnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUucGx1cyA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgdmFyIHYyID0gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIHYyLnggKz0gdi54O1xyXG4gICAgICAgIHYyLnkgKz0gdi55O1xyXG4gICAgICAgIHJldHVybiB2MjtcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5zdWJ0cmFjdCA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgdGhpcy54IC09IHYueDtcclxuICAgICAgICB0aGlzLnkgLT0gdi55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLm1pbnVzID0gZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICB2YXIgdjIgPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgdjIueCAtPSB2Lng7XHJcbiAgICAgICAgdjIueSAtPSB2Lnk7XHJcbiAgICAgICAgcmV0dXJuIHYyO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLm11bHQgPSBmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgICAgIGlmICh4IGluc3RhbmNlb2YgVmVjdG9yMikge1xyXG4gICAgICAgICAgICB0aGlzLnggKj0geC54O1xyXG4gICAgICAgICAgICB0aGlzLnkgKj0geC55O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54ICo9IHg7XHJcbiAgICAgICAgICAgIHRoaXMueSAqPSB0eXBlb2YgeSA9PT0gXCJudW1iZXJcIiA/IHkgOiB4O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5oYWRhbWFyZCA9IGZ1bmN0aW9uICh2ZWMpIHtcclxuICAgICAgICB0aGlzLnggKj0gdmVjLng7XHJcbiAgICAgICAgdGhpcy55ICo9IHZlYy55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSk7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUubGVuZ3RoU3EgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueTtcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbiAodikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKiB2LnggKyB0aGlzLnkgKiB2Lnk7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUuZGlzdCA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCAtIHYueCwgdGhpcy55IC0gdi55KS5sZW5ndGgoKTtcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoKCk7XHJcbiAgICAgICAgdGhpcy54IC89IGxlbmd0aDtcclxuICAgICAgICB0aGlzLnkgLz0gbGVuZ3RoO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBWZWN0b3IyO1xyXG59KSgpO1xyXG5leHBvcnRzLlZlY3RvcjIgPSBWZWN0b3IyO1xyXG4iLCJ2YXIgcGFydGljbGVTeXN0ZW1fMSA9IHJlcXVpcmUoXCIuL3BhcnRpY2xlU3lzdGVtXCIpO1xyXG52YXIgRW1pdHRlciA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBFbWl0dGVyKHBhcmVudEVsZW0sIGFyZ3MpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUxvY2sgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm1ha2VFbGVtZW50KGFyZ3MpO1xyXG4gICAgICAgIGFyZ3MuY2FudmFzID0gdGhpcy5jYW52YXM7XHJcbiAgICAgICAgYXJncy50aWNrUmF0ZSA9IGFyZ3MudGlja1JhdGUgfHwgMTY7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZVN5c3RlbSA9IG5ldyBwYXJ0aWNsZVN5c3RlbV8xLlBhcnRpY2xlU3lzdGVtKGFyZ3MpO1xyXG4gICAgICAgIHRoaXMucGFyZW50RWxlbSA9IHBhcmVudEVsZW07XHJcbiAgICAgICAgdGhpcy50aWNrUmF0ZSA9IGFyZ3MudGlja1JhdGUgfHwgMTY7XHJcbiAgICAgICAgdGhpcy5vbkVtaXR0ZXJEZWF0aCA9IGFyZ3Mub25FbWl0dGVyRGVhdGg7XHJcbiAgICAgICAgdGhpcy56SW5kZXggPSB0eXBlb2YgYXJncy56SW5kZXggPT09IFwibnVtYmVyXCIgPyBhcmdzLnpJbmRleCA6IFwiYXV0b1wiO1xyXG4gICAgfVxyXG4gICAgRW1pdHRlci5wcm90b3R5cGUubWFrZUVsZW1lbnQgPSBmdW5jdGlvbiAoYXJncykge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gJChcIjxjYW52YXM+PC9jYW52YXM+XCIpXHJcbiAgICAgICAgICAgIC5hZGRDbGFzcyhcInNwYXJrbGUtZW1pdHRlclwiKVxyXG4gICAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgXCJwb3NpdGlvblwiOiBcImFic29sdXRlXCIsXHJcbiAgICAgICAgICAgIFwidG9wXCI6IFwiMHB4XCIsXHJcbiAgICAgICAgICAgIFwibGVmdFwiOiBcIjBweFwiLFxyXG4gICAgICAgICAgICBcInBvaW50ZXItZXZlbnRzXCI6IFwibm9uZVwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBhcmdzLnpJbmRleCA9PT0gXCJudW1iZXJcIilcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMuY3NzKFwiei1pbmRleFwiLCBhcmdzLnpJbmRleCk7XHJcbiAgICAgICAgJChcImJvZHlcIikuYXBwZW5kKHRoaXMuY2FudmFzKTtcclxuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzWzBdLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICB9O1xyXG4gICAgRW1pdHRlci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMudXBkYXRlKCk7IH0sIHRoaXMudGlja1JhdGUpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgRW1pdHRlci5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIEVtaXR0ZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy51cGRhdGVMb2NrKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy51cGRhdGVMb2NrID0gdHJ1ZTtcclxuICAgICAgICB2YXIgZHQgPSB0aGlzLnRpY2tSYXRlIC8gMTAwMDtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlU3lzdGVtLnVwZGF0ZShkdCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLnBhcnRpY2xlU3lzdGVtLmFsaXZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgICAgICAkKHRoaXMuY2FudmFzKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9uRW1pdHRlckRlYXRoID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uRW1pdHRlckRlYXRoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudXBkYXRlTG9jayA9IGZhbHNlO1xyXG4gICAgfTtcclxuICAgIEVtaXR0ZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmICghdGhpcy5wYXJ0aWNsZVN5c3RlbS5hbGl2ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLnBhcmVudEVsZW0ub2Zmc2V0KCk7XHJcbiAgICAgICAgdmFyIG9mZnNldFggPSBvZmZzZXQubGVmdCArIHRoaXMucGFyZW50RWxlbS5vdXRlcldpZHRoKCkgLyAyO1xyXG4gICAgICAgIHZhciBvZmZzZXRZID0gb2Zmc2V0LnRvcCArIHRoaXMucGFyZW50RWxlbS5vdXRlckhlaWdodCgpIC8gMjtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlU3lzdGVtLnJlbmRlcih0aGlzLmN0eCwgb2Zmc2V0WCwgb2Zmc2V0WSk7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLnJlbmRlcigpOyB9KTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gRW1pdHRlcjtcclxufSkoKTtcclxuZXhwb3J0cy5FbWl0dGVyID0gRW1pdHRlcjtcclxuIiwidmFyIFZlY3RvcjJfMSA9IHJlcXVpcmUoXCIuL1ZlY3RvcjJcIik7XHJcbnZhciBQYXJ0aWNsZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBQYXJ0aWNsZShhcmdzKSB7XHJcbiAgICAgICAgdGhpcy5hY2NlbGVyYXRpb25GaWVsZCA9IGFyZ3MuYWNjZWxlcmF0aW9uRmllbGQ7XHJcbiAgICAgICAgdGhpcy5lbGVtRmFjdG9yeSA9IGFyZ3MuZWxlbUZhY3Rvcnk7XHJcbiAgICAgICAgdGhpcy50aWNrUmF0ZSA9IGFyZ3MudGlja1JhdGUgfHwgMTY7XHJcbiAgICAgICAgdGhpcy5zcHJpdGUgPSBhcmdzLnNwcml0ZTtcclxuICAgICAgICB0aGlzLnNjYWxlID0gYXJncy5zY2FsZSB8fCAxO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gPSBhcmdzLnJvdGF0aW9uIHx8IDA7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvblZlbG9jaXR5ID0gYXJncy5yb3RhdGlvblZlbG9jaXR5IHx8IDA7XHJcbiAgICAgICAgdGhpcy5zZXR1cE9wYWNpdHkoYXJncy5vcGFjaXR5KTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gYXJncy5wb3NpdGlvbiA/IGFyZ3MucG9zaXRpb24uY2xvbmUoKSA6IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigpO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBhcmdzLnZlbG9jaXR5ID8gYXJncy52ZWxvY2l0eS5jbG9uZSgpIDogbmV3IFZlY3RvcjJfMS5WZWN0b3IyKCk7XHJcbiAgICAgICAgdGhpcy5hY2NlbGVyYXRpb24gPSBhcmdzLmFjY2VsZXJhdGlvbiA/IGFyZ3MuYWNjZWxlcmF0aW9uLmNsb25lKCkgOiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoKTtcclxuICAgICAgICB0aGlzLmhpZ2hlck9yZGVyID0gW107XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJncy5oaWdoZXJPcmRlcikpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmhpZ2hlck9yZGVyLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZ2hlck9yZGVyLnB1c2goYXJncy5oaWdoZXJPcmRlcltpXSA/IGFyZ3MuaGlnaGVyT3JkZXJbaV0uY2xvbmUoKSA6IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1heExpZmUgPSB0eXBlb2YgYXJncy5tYXhMaWZlID09IFwibnVtYmVyXCIgPyBhcmdzLm1heExpZmUgOiAxO1xyXG4gICAgICAgIHRoaXMubGlmZSA9IDA7XHJcbiAgICAgICAgdGhpcy5hbGl2ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5lbGVtID0gbnVsbDtcclxuICAgICAgICB0aGlzLm5ld0VsZW1lbnQoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUVsZW1lbnQoLTMwMDAsIC0zMDAwKTtcclxuICAgIH1cclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZHQpIHtcclxuICAgICAgICB0aGlzLmxpZmUgKz0gZHQ7XHJcbiAgICAgICAgaWYgKHRoaXMubWF4TGlmZSA8PSB0aGlzLmxpZmUpIHtcclxuICAgICAgICAgICAgdGhpcy5hbGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmVsZW0gJiYgdGhpcy5lbGVtLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmVsZW0gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5hY2NlbGVyYXRpb25GaWVsZCkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUJ5RmllbGQoZHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVCeVRheWxvcihkdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucm90YXRpb24gKz0gdGhpcy5yb3RhdGlvblZlbG9jaXR5O1xyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS51cGRhdGVFbGVtZW50ID0gZnVuY3Rpb24gKG9mZnNldFgsIG9mZnNldFkpIHtcclxuICAgICAgICBpZiAoIXRoaXMuYWxpdmUgfHwgIXRoaXMuZWxlbSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuZWxlbVxyXG4gICAgICAgICAgICAuY3NzKFwibGVmdFwiLCB0aGlzLnBvc2l0aW9uLnggKyBvZmZzZXRYICsgXCJweFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwidG9wXCIsIHRoaXMucG9zaXRpb24ueSArIG9mZnNldFkgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJvcGFjaXR5XCIsIHRoaXMuY3VycmVudE9wYWNpdHkoKSk7XHJcbiAgICAgICAgdGhpcy5lbGVtLmNzcyhcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgtNTAlLCAtNTAlKSByb3RhdGUoXCIgKyBNYXRoLmZsb29yKHRoaXMucm90YXRpb24pICsgXCJkZWcpIHNjYWxlKFwiICsgdGhpcy5zY2FsZSArIFwiKVwiKTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUudXBkYXRlQnlGaWVsZCA9IGZ1bmN0aW9uIChkdCkge1xyXG4gICAgICAgIHZhciBhY2NlbCA9IHRoaXMuYWNjZWxlcmF0aW9uRmllbGQodGhpcy5wb3NpdGlvbik7XHJcbiAgICAgICAgdGhpcy52ZWxvY2l0eS5hZGQoYWNjZWwuc2FtcGxlKCkpO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24uYWRkKHRoaXMudmVsb2NpdHkpO1xyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS51cGRhdGVCeVRheWxvciA9IGZ1bmN0aW9uIChkdCkge1xyXG4gICAgICAgIHZhciBkZWwgPSBudWxsO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLmhpZ2hlck9yZGVyLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XHJcbiAgICAgICAgICAgIGlmIChkZWwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlnaGVyT3JkZXJbaV0uYWRkKGRlbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVsID0gdGhpcy5oaWdoZXJPcmRlcltpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRlbCkge1xyXG4gICAgICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbi5hZGQoZGVsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy52ZWxvY2l0eS5hZGQodGhpcy5hY2NlbGVyYXRpb24pO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24uYWRkKHRoaXMudmVsb2NpdHkpO1xyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jdXJyZW50TGlmZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5saWZlIC8gdGhpcy5tYXhMaWZlO1xyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5zZXR1cE9wYWNpdHkgPSBmdW5jdGlvbiAob3BhY2l0eSkge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb3BhY2l0eSA9PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3BhY2l0eU51bWJlciA9IG9wYWNpdHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkob3BhY2l0eSkpIHtcclxuICAgICAgICAgICAgb3BhY2l0eS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhLmxpZmUgLSBiLmxpZmU7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLm9wYWNpdHlBcnJheSA9IG9wYWNpdHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBvcGFjaXR5ID09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICB0aGlzLm9wYWNpdHlGdW5jdGlvbiA9IG9wYWNpdHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm9wYWNpdHlOdW1iZXIgPSAxO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3VycmVudE9wYWNpdHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5vcGFjaXR5QXJyYXkpKSB7XHJcbiAgICAgICAgICAgIHZhciBsaWZlID0gdGhpcy5jdXJyZW50TGlmZSgpO1xyXG4gICAgICAgICAgICB2YXIgcHJldiA9IG51bGwsIG5leHQgPSBudWxsO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMub3BhY2l0eUFycmF5Lmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb3AgPSB0aGlzLm9wYWNpdHlBcnJheVtpXTtcclxuICAgICAgICAgICAgICAgIGlmIChvcC5saWZlIDw9IGxpZmUpXHJcbiAgICAgICAgICAgICAgICAgICAgcHJldiA9IG9wO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIW5leHQpXHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dCA9IG9wO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcmV2ICYmIG5leHQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkTGlmZSA9IG5leHQubGlmZSAtIHByZXYubGlmZTtcclxuICAgICAgICAgICAgICAgIHZhciBkT3BhY2l0eSA9IG5leHQudmFsdWUgLSBwcmV2LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGFtb3VudEludG8gPSBsaWZlIC0gcHJldi5saWZlO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBlcmNlbnRBY3Jvc3MgPSBhbW91bnRJbnRvIC8gZExpZmU7XHJcbiAgICAgICAgICAgICAgICB2YXIgb3BhY2l0eU9mZnNldCA9IHBlcmNlbnRBY3Jvc3MgKiBkT3BhY2l0eTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvcGFjaXR5T2Zmc2V0ICsgcHJldi52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChwcmV2KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJldi52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChuZXh0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dC52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiB0aGlzLm9wYWNpdHlGdW5jdGlvbiA9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgdmFyIGxpZmUgPSB0aGlzLmN1cnJlbnRMaWZlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wYWNpdHlGdW5jdGlvbihsaWZlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHRoaXMub3BhY2l0eU51bWJlciA9PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wYWNpdHlOdW1iZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGUucHJvdG90eXBlLm5ld0VsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbUZhY3RvcnkpIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtID0gdGhpcy5lbGVtRmFjdG9yeSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBlbGVtID0gJChcIjxkaXY+PC9kaXY+XCIpO1xyXG4gICAgICAgIGVsZW0uY3NzKFwicG9zaXRpb25cIiwgXCJhYnNvbHV0ZVwiKTtcclxuICAgICAgICB0aGlzLmR1c3RFbGVtZW50KGVsZW0pO1xyXG4gICAgICAgIHRoaXMuYmxlbmRNb2RlRWxlbWVudChlbGVtKTtcclxuICAgICAgICB0aGlzLmVsZW0gPSBlbGVtO1xyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jaXJjbGVFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgICB2YXIgcmFkaXVzID0gMi41O1xyXG4gICAgICAgIGVsZW1cclxuICAgICAgICAgICAgLmNzcyhcIndpZHRoXCIsICgyICogcmFkaXVzKSArIFwicHhcIilcclxuICAgICAgICAgICAgLmNzcyhcImhlaWdodFwiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJib3JkZXItcmFkaXVzXCIsICgyICogcmFkaXVzKSArIFwicHhcIilcclxuICAgICAgICAgICAgLmNzcyhcImJhY2tncm91bmRcIiwgXCJyZWRcIik7XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGUucHJvdG90eXBlLmR1c3RFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgICB2YXIgY29sb3IgPSB7IHI6IDAsIGc6IDAsIGI6IDAgfTtcclxuICAgICAgICB2YXIgY2NvbG9yID0gXCJyZ2JhKDAsIDAsIDAsIDEpXCI7XHJcbiAgICAgICAgdmFyIHJhZGl1cyA9IDMuNTtcclxuICAgICAgICBlbGVtXHJcbiAgICAgICAgICAgIC5jc3MoXCJ3aWR0aFwiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJoZWlnaHRcIiwgKDIgKiByYWRpdXMpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwiYm9yZGVyLXJhZGl1c1wiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJiYWNrZ3JvdW5kXCIsIFwicmVkXCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJiYWNrZ3JvdW5kXCIsIFwicmFkaWFsLWdyYWRpZW50KGVsbGlwc2UgYXQgY2VudGVyLCBcIiArIGNjb2xvciArIFwiIDAlLHJnYmEoMCwwLDAsMCkgNzAlKVwiKTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuZmlyZUVsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbSkge1xyXG4gICAgICAgIHZhciByYWRpdXMgPSA5O1xyXG4gICAgICAgIGVsZW1cclxuICAgICAgICAgICAgLmNzcyhcIndpZHRoXCIsICgyICogcmFkaXVzKSArIFwicHhcIilcclxuICAgICAgICAgICAgLmNzcyhcImhlaWdodFwiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJib3JkZXItcmFkaXVzXCIsICgyICogcmFkaXVzKSArIFwicHhcIilcclxuICAgICAgICAgICAgLmNzcyhcImJhY2tncm91bmRcIiwgXCJyZWRcIilcclxuICAgICAgICAgICAgLmNzcyhcImJhY2tncm91bmRcIiwgXCJyYWRpYWwtZ3JhZGllbnQoZWxsaXBzZSBhdCBjZW50ZXIsIHJnYmEoMjQ5LDI0OSw0OSwxKSAwJSxyZ2JhKDI1Miw0Nyw0NywwLjYyKSAzMSUscmdiYSgyNDQsNTcsNTEsMCkgNzAlKVwiKTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuYmxlbmRNb2RlRWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtKSB7XHJcbiAgICAgICAgZWxlbVxyXG4gICAgICAgICAgICAuY3NzKFwiYmFja2dyb3VuZC1ibGVuZC1tb2RlXCIsIFwibXVsdGlwbHlcIik7XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGUucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChjdHgsIG9mZnNldFgsIG9mZnNldFkpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC50cmFuc2xhdGUodGhpcy5wb3NpdGlvbi54ICsgb2Zmc2V0WCwgdGhpcy5wb3NpdGlvbi55ICsgb2Zmc2V0WSk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gdGhpcy5zcHJpdGUud2lkdGggfHwgMTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5zcHJpdGUuaGVpZ2h0IHx8IDE7XHJcbiAgICAgICAgY3R4LnRyYW5zbGF0ZSh0aGlzLnNjYWxlICogd2lkdGggLyAyLCB0aGlzLnNjYWxlICogaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgY3R4LnJvdGF0ZSh0aGlzLnJvdGF0aW9uKTtcclxuICAgICAgICBjdHguZ2xvYmFsQWxwaGEgPSB0aGlzLmN1cnJlbnRPcGFjaXR5KCk7XHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLnNwcml0ZSwgLXRoaXMuc2NhbGUgKiB3aWR0aCAvIDIsIC10aGlzLnNjYWxlICogaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgY3R4Lmdsb2JhbEFscGhhID0gMTtcclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBQYXJ0aWNsZTtcclxufSkoKTtcclxuZXhwb3J0cy5QYXJ0aWNsZSA9IFBhcnRpY2xlO1xyXG4iLCJ2YXIgcGFydGljbGVfMSA9IHJlcXVpcmUoXCIuL3BhcnRpY2xlXCIpO1xyXG52YXIgU3ByZWFkXzEgPSByZXF1aXJlKFwiLi9TcHJlYWRcIik7XHJcbnZhciBQYXJ0aWNsZVN5c3RlbSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBQYXJ0aWNsZVN5c3RlbShhcmdzKSB7XHJcbiAgICAgICAgdGhpcy5saWZlID0gMDtcclxuICAgICAgICB0aGlzLmxhc3RQYXJ0aWNsZUFkZGVkID0gMDtcclxuICAgICAgICB0aGlzLmR5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5hbGl2ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBhcmdzO1xyXG4gICAgICAgIHRoaXMucGFydGljbGVzID0gW107XHJcbiAgICAgICAgdGhpcy5tYXhMaWZlID0gYXJncy5tYXhMaWZlID8gbmV3IFNwcmVhZF8xLlNjYWxhclNwcmVhZChhcmdzLm1heExpZmUpIDogbmV3IFNwcmVhZF8xLlNjYWxhclNwcmVhZCg1KTtcclxuICAgICAgICB0aGlzLm1heFBhcnRpY2xlcyA9IGFyZ3MubWF4UGFydGljbGVzIHx8IDEwMDtcclxuICAgICAgICB0aGlzLmVtaXR0ZXJNYXhMaWZlID0gYXJncy5lbWl0dGVyTWF4TGlmZSA/IGFyZ3MuZW1pdHRlck1heExpZmUgOiBudWxsO1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gYXJncy5jYW52YXM7XHJcbiAgICAgICAgdGhpcy5jdHggPSBhcmdzLmN0eDtcclxuICAgICAgICB0aGlzLnRpY2tSYXRlID0gYXJncy50aWNrUmF0ZSB8fCAxNjtcclxuICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbkZpZWxkID0gYXJncy5hY2NlbGVyYXRpb25GaWVsZDtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlRWxlbUZhY3RvcnkgPSBhcmdzLnBhcnRpY2xlRWxlbUZhY3Rvcnk7XHJcbiAgICAgICAgdGhpcy5zY2FsZSA9IG5ldyBTcHJlYWRfMS5TY2FsYXJTcHJlYWQoYXJncy5zY2FsZSk7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbiA9IG5ldyBTcHJlYWRfMS5TY2FsYXJTcHJlYWQoYXJncy5yb3RhdGlvbik7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvblZlbG9jaXR5ID0gbmV3IFNwcmVhZF8xLlNjYWxhclNwcmVhZChhcmdzLnJvdGF0aW9uVmVsb2NpdHkpO1xyXG4gICAgICAgIGlmICh0eXBlb2YgYXJncy5vcGFjaXR5ID09PSBcIm51bWJlclwiIHx8IFNwcmVhZF8xLlNjYWxhclNwcmVhZC5pc0FyZyhhcmdzLm9wYWNpdHkpKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3BhY2l0eSA9IG5ldyBTcHJlYWRfMS5TY2FsYXJTcHJlYWQoYXJncy5vcGFjaXR5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMub3BhY2l0eSA9IGFyZ3Mub3BhY2l0eTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBTcHJlYWRfMS5WZWN0b3JTcHJlYWQoYXJncy5wb3NpdGlvbik7XHJcbiAgICAgICAgdGhpcy52ZWxvY2l0eSA9IG5ldyBTcHJlYWRfMS5WZWN0b3JTcHJlYWQoYXJncy52ZWxvY2l0eSk7XHJcbiAgICAgICAgdGhpcy5hY2NlbGVyYXRpb24gPSBuZXcgU3ByZWFkXzEuVmVjdG9yU3ByZWFkKGFyZ3MuYWNjZWxlcmF0aW9uKTtcclxuICAgICAgICB0aGlzLmhpZ2hlck9yZGVyID0gW107XHJcbiAgICAgICAgaWYgKGFyZ3MuZ3Jhdml0eSlcclxuICAgICAgICAgICAgdGhpcy5hY2NlbGVyYXRpb24udmFsdWUuYWRkKGFyZ3MuZ3Jhdml0eSk7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJncy5oaWdoZXJPcmRlcikpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmhpZ2hlck9yZGVyLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZ2hlck9yZGVyLnB1c2gobmV3IFNwcmVhZF8xLlZlY3RvclNwcmVhZChhcmdzLmhpZ2hlck9yZGVyW2ldKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBQYXJ0aWNsZVN5c3RlbS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGR0KSB7XHJcbiAgICAgICAgdGhpcy5saWZlICs9IGR0O1xyXG4gICAgICAgIGlmICghdGhpcy5hbGl2ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGlmICh0aGlzLmR5aW5nICYmIHRoaXMucGFydGljbGVzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWxpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuZW1pdHRlck1heExpZmUgPT09IFwibnVtYmVyXCIgJiYgdGhpcy5lbWl0dGVyTWF4TGlmZSA+IDAgJiYgdGhpcy5saWZlID49IHRoaXMuZW1pdHRlck1heExpZmUpIHtcclxuICAgICAgICAgICAgdGhpcy5keWluZyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBuZXdQYXJ0aWNsZXMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGFydGljbGVzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIHZhciBwID0gdGhpcy5wYXJ0aWNsZXNbaV07XHJcbiAgICAgICAgICAgIHAudXBkYXRlKGR0KTtcclxuICAgICAgICAgICAgaWYgKCFwLmFsaXZlKVxyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIG5ld1BhcnRpY2xlcy5wdXNoKHApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbmV3UGFydGljbGVzUGVyVGljayA9IHRoaXMuZW1pdFJhdGU7XHJcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAobmV3UGFydGljbGVzUGVyVGljayAtIE1hdGguZmxvb3IobmV3UGFydGljbGVzUGVyVGljaykpKSB7XHJcbiAgICAgICAgICAgIG5ld1BhcnRpY2xlc1BlclRpY2sgPSBNYXRoLmNlaWwobmV3UGFydGljbGVzUGVyVGljayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBuZXdQYXJ0aWNsZXNQZXJUaWNrID0gTWF0aC5mbG9vcihuZXdQYXJ0aWNsZXNQZXJUaWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLmR5aW5nICYmIG5ld1BhcnRpY2xlcy5sZW5ndGggPCB0aGlzLm1heFBhcnRpY2xlcykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5ld1BhcnRpY2xlc1BlclRpY2s7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgbmV3UGFydGljbGVzLnB1c2godGhpcy5jcmVhdGVQYXJ0aWNsZSgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBhcnRpY2xlcyA9IG5ld1BhcnRpY2xlcztcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZVN5c3RlbS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKGN0eCwgb2Zmc2V0WCwgb2Zmc2V0WSkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wYXJ0aWNsZXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgdmFyIHAgPSB0aGlzLnBhcnRpY2xlc1tpXTtcclxuICAgICAgICAgICAgcC5yZW5kZXIoY3R4LCBvZmZzZXRYLCBvZmZzZXRZKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGVTeXN0ZW0ucHJvdG90eXBlLnNhbXBsZVNwcml0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZVN5c3RlbS5wcm90b3R5cGUuY3JlYXRlUGFydGljbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXJ0aWNsZV8xLlBhcnRpY2xlKHtcclxuICAgICAgICAgICAgbWF4TGlmZTogdGhpcy5tYXhMaWZlLnNhbXBsZSgpLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogdGhpcy5wb3NpdGlvbi5zYW1wbGUoKSxcclxuICAgICAgICAgICAgdmVsb2NpdHk6IHRoaXMudmVsb2NpdHkgJiYgdGhpcy52ZWxvY2l0eS5zYW1wbGUoKSxcclxuICAgICAgICAgICAgYWNjZWxlcmF0aW9uOiB0aGlzLmFjY2VsZXJhdGlvbiAmJiB0aGlzLmFjY2VsZXJhdGlvbi5zYW1wbGUoKSxcclxuICAgICAgICAgICAgaGlnaGVyT3JkZXI6IHRoaXMuaGlnaGVyT3JkZXIgJiYgdGhpcy5oaWdoZXJPcmRlci5tYXAoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHguc2FtcGxlKCk7IH0pLFxyXG4gICAgICAgICAgICBhY2NlbGVyYXRpb25GaWVsZDogdGhpcy5hY2NlbGVyYXRpb25GaWVsZCxcclxuICAgICAgICAgICAgZWxlbUZhY3Rvcnk6IHRoaXMucGFydGljbGVFbGVtRmFjdG9yeSxcclxuICAgICAgICAgICAgc3ByaXRlOiB0aGlzLnNwcml0ZSxcclxuICAgICAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGUuc2FtcGxlKCksXHJcbiAgICAgICAgICAgIHJvdGF0aW9uOiB0aGlzLnJvdGF0aW9uLnNhbXBsZSgpLFxyXG4gICAgICAgICAgICByb3RhdGlvblZlbG9jaXR5OiB0aGlzLnJvdGF0aW9uVmVsb2NpdHkuc2FtcGxlKCksXHJcbiAgICAgICAgICAgIG9wYWNpdHk6ICh0aGlzLm9wYWNpdHkgaW5zdGFuY2VvZiBTcHJlYWRfMS5TY2FsYXJTcHJlYWQpID9cclxuICAgICAgICAgICAgICAgIHRoaXMub3BhY2l0eS5zYW1wbGUoKSA6XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wYWNpdHksXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFBhcnRpY2xlU3lzdGVtO1xyXG59KSgpO1xyXG5leHBvcnRzLlBhcnRpY2xlU3lzdGVtID0gUGFydGljbGVTeXN0ZW07XHJcbiIsInZhciBTcHJlYWRfMSA9IHJlcXVpcmUoXCIuL1NwcmVhZFwiKTtcclxuZXhwb3J0cy5WZWN0b3JTcHJlYWQgPSBTcHJlYWRfMS5WZWN0b3JTcHJlYWQ7XHJcbmV4cG9ydHMuU2NhbGFyU3ByZWFkID0gU3ByZWFkXzEuU2NhbGFyU3ByZWFkO1xyXG5leHBvcnRzLlNwcmVhZFR5cGUgPSBTcHJlYWRfMS5TcHJlYWRUeXBlO1xyXG52YXIgVmVjdG9yMl8xID0gcmVxdWlyZShcIi4vVmVjdG9yMlwiKTtcclxuZXhwb3J0cy5WZWN0b3IyID0gVmVjdG9yMl8xLlZlY3RvcjI7XHJcbnZhciBlbWl0dGVyXzEgPSByZXF1aXJlKFwiLi9lbWl0dGVyXCIpO1xyXG5leHBvcnRzLkVtaXR0ZXIgPSBlbWl0dGVyXzEuRW1pdHRlcjtcclxudmFyIGVtaXR0ZXJfMiA9IHJlcXVpcmUoXCIuL2VtaXR0ZXJcIik7XHJcbnZhciBWZWN0b3IyXzIgPSByZXF1aXJlKFwiLi9WZWN0b3IyXCIpO1xyXG5mdW5jdGlvbiBzcGFya2xlKCRlbGVtKSB7XHJcbiAgICB2YXIgc3ByaXRlID0gJChcIjxjYW52YXM+PC9jYW52YXM+XCIpWzBdO1xyXG4gICAgc3ByaXRlLndpZHRoID0gMTY7XHJcbiAgICBzcHJpdGUuaGVpZ2h0ID0gMTY7XHJcbiAgICB2YXIgY3R4ID0gc3ByaXRlLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHguYXJjKDgsIDgsIDgsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gJ3JlZCc7XHJcbiAgICBjdHguZmlsbCgpO1xyXG4gICAgbmV3IGVtaXR0ZXJfMi5FbWl0dGVyKCRlbGVtLCB7XHJcbiAgICAgICAgbWF4UGFydGljbGVzOiAxMDAsXHJcbiAgICAgICAgZW1pdFJhdGU6IDEsXHJcbiAgICAgICAgc3ByaXRlOiBzcHJpdGUsXHJcbiAgICAgICAgbWF4TGlmZToge1xyXG4gICAgICAgICAgICB2YWx1ZTogMSxcclxuICAgICAgICAgICAgc3ByZWFkOiAwLjVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHZlbG9jaXR5OiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBuZXcgVmVjdG9yMl8yLlZlY3RvcjIoMCwgLTUpLFxyXG4gICAgICAgICAgICBzcHJlYWQ6IG5ldyBWZWN0b3IyXzIuVmVjdG9yMig3LCAyKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ3Jhdml0eTogbmV3IFZlY3RvcjJfMi5WZWN0b3IyKDAsIDAuMilcclxuICAgIH0pLnN0YXJ0KCk7XHJcbn1cclxuZXhwb3J0cy5zcGFya2xlID0gc3BhcmtsZTtcclxuIl19
