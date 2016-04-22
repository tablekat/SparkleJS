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
        var _this = this;
        this.updateLock = false;
        this.makeElement(args);
        args.canvas = this.canvas;
        args.tickRate = args.tickRate || 16;
        this.particleSystem = new particleSystem_1.ParticleSystem(args);
        this.parentElem = parentElem;
        this.tickRate = args.tickRate || 16;
        this.onEmitterDeath = args.onEmitterDeath;
        this.zIndex = typeof args.zIndex === "number" ? args.zIndex : "auto";
        $(window).resize(function () { return _this.resizeCanvas(); });
    }
    Emitter.prototype.makeElement = function (args) {
        this.canvas = $("<canvas></canvas>")
            .addClass("sparkle-emitter")
            .css({
            "position": "absolute",
            "top": "0px",
            "left": "0px",
            "width": "100%",
            "height": "100%",
            "pointer-events": "none"
        });
        if (typeof args.zIndex === "number")
            this.canvas.css("z-index", args.zIndex);
        $("body").append(this.canvas);
        this.ctx = this.canvas[0].getContext('2d');
        this.resizeCanvas();
    };
    Emitter.prototype.resizeCanvas = function () {
        this.canvas[0].width = window.innerWidth;
        this.canvas[0].height = window.innerHeight;
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
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
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
        this.emitRate = args.emitRate || 0.1;
        this.emitterMaxLife = args.emitterMaxLife ? args.emitterMaxLife : null;
        this.canvas = args.canvas;
        this.ctx = args.ctx;
        this.tickRate = args.tickRate || 16;
        this.accelerationField = args.accelerationField;
        this.particleElemFactory = args.particleElemFactory;
        this.sprite = args.sprite;
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
            newParticlesPerTick = Math.floor(newParticlesPerTick) + 1;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL1VzZXJzL2JlbmppL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9TcHJlYWQuanMiLCJzcmMvVmVjdG9yMi5qcyIsInNyYy9lbWl0dGVyLmpzIiwic3JjL3BhcnRpY2xlLmpzIiwic3JjL3BhcnRpY2xlU3lzdGVtLmpzIiwic3JjL3NwYXJrbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgVmVjdG9yMl8xID0gcmVxdWlyZShcIi4vVmVjdG9yMlwiKTtcclxuKGZ1bmN0aW9uIChTcHJlYWRUeXBlKSB7XHJcbiAgICBTcHJlYWRUeXBlW1NwcmVhZFR5cGVbXCJVbmlmb3JtXCJdID0gMF0gPSBcIlVuaWZvcm1cIjtcclxuICAgIFNwcmVhZFR5cGVbU3ByZWFkVHlwZVtcIk5vcm1hbFwiXSA9IDFdID0gXCJOb3JtYWxcIjtcclxuICAgIFNwcmVhZFR5cGVbU3ByZWFkVHlwZVtcIlJlY3RVbmlmb3JtXCJdID0gMl0gPSBcIlJlY3RVbmlmb3JtXCI7XHJcbn0pKGV4cG9ydHMuU3ByZWFkVHlwZSB8fCAoZXhwb3J0cy5TcHJlYWRUeXBlID0ge30pKTtcclxudmFyIFNwcmVhZFR5cGUgPSBleHBvcnRzLlNwcmVhZFR5cGU7XHJcbnZhciBWZWN0b3JTcHJlYWQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gVmVjdG9yU3ByZWFkKHZhbHVlLCBzcHJlYWQsIHNwcmVhZFR5cGUpIHtcclxuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBWZWN0b3IyXzEuVmVjdG9yMiB8fCAhdmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlIHx8IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigwLCAwKTtcclxuICAgICAgICAgICAgdGhpcy5zcHJlYWQgPSBzcHJlYWQgfHwgbmV3IFZlY3RvcjJfMS5WZWN0b3IyKDAsIDApO1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBzcHJlYWRUeXBlIHx8IFNwcmVhZFR5cGUuTm9ybWFsO1xyXG4gICAgICAgICAgICB0aGlzLmN1c3RvbSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWUudmFsdWUgfHwgbmV3IFZlY3RvcjJfMS5WZWN0b3IyKDAsIDApO1xyXG4gICAgICAgICAgICB0aGlzLnNwcmVhZCA9IHZhbHVlLnNwcmVhZCB8fCBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoMCwgMCk7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHZhbHVlLnR5cGUgfHwgU3ByZWFkVHlwZS5Ob3JtYWw7XHJcbiAgICAgICAgICAgIHRoaXMuY3VzdG9tID0gdmFsdWUuY3VzdG9tIHx8IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgVmVjdG9yU3ByZWFkLnByb3RvdHlwZS5zYW1wbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VzdG9tKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmN1c3RvbSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy50eXBlID09IFNwcmVhZFR5cGUuUmVjdFVuaWZvcm0pIHtcclxuICAgICAgICAgICAgdmFyIHJhbmRYID0gKDIgKiBNYXRoLnJhbmRvbSgpIC0gMSkgKiB0aGlzLnNwcmVhZC54O1xyXG4gICAgICAgICAgICB2YXIgcmFuZFkgPSAoMiAqIE1hdGgucmFuZG9tKCkgLSAxKSAqIHRoaXMuc3ByZWFkLnk7XHJcbiAgICAgICAgICAgIHZhciByYW5kViA9IG5ldyBWZWN0b3IyXzEuVmVjdG9yMihyYW5kWCwgcmFuZFkpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmFuZFYuYWRkKHRoaXMudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHJhbmRSLCByYW5kVGg7XHJcbiAgICAgICAgICAgIHJhbmRUaCA9IE1hdGguUEkgKiAyICogTWF0aC5yYW5kb20oKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PSBTcHJlYWRUeXBlLlVuaWZvcm0pIHtcclxuICAgICAgICAgICAgICAgIHJhbmRSID0gTWF0aC5yYW5kb20oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJhbmRSID0gKChNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkpIC0gMykgLyAzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciByYW5kViA9IFZlY3RvcjJfMS5WZWN0b3IyLmZyb21Qb2xhcihyYW5kUiwgcmFuZFRoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJhbmRWLmhhZGFtYXJkKHRoaXMuc3ByZWFkKS5hZGQodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFZlY3RvclNwcmVhZC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHNwcikge1xyXG4gICAgICAgIHRoaXMudmFsdWUuYWRkKHNwci52YWx1ZSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFZlY3RvclNwcmVhZDtcclxufSkoKTtcclxuZXhwb3J0cy5WZWN0b3JTcHJlYWQgPSBWZWN0b3JTcHJlYWQ7XHJcbnZhciBTY2FsYXJTcHJlYWQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gU2NhbGFyU3ByZWFkKHZhbHVlLCBzcHJlYWQsIHNwcmVhZFR5cGUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09IFwibnVtYmVyXCIgfHwgIXZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZSB8fCAwO1xyXG4gICAgICAgICAgICB0aGlzLnNwcmVhZCA9IHNwcmVhZCB8fCAwO1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBzcHJlYWRUeXBlIHx8IFNwcmVhZFR5cGUuTm9ybWFsO1xyXG4gICAgICAgICAgICB0aGlzLmN1c3RvbSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWUudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByZWFkID0gdmFsdWUuc3ByZWFkO1xyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSB2YWx1ZS50eXBlIHx8IFNwcmVhZFR5cGUuTm9ybWFsO1xyXG4gICAgICAgICAgICB0aGlzLmN1c3RvbSA9IHZhbHVlLmN1c3RvbSB8fCBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFNjYWxhclNwcmVhZC5pc0FyZyA9IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICByZXR1cm4gb2JqICYmXHJcbiAgICAgICAgICAgICh0eXBlb2Ygb2JqLnZhbHVlID09IFwibnVtYmVyXCIgfHxcclxuICAgICAgICAgICAgICAgIHR5cGVvZiBvYmouc3ByZWFkID09IFwibnVtYmVyXCIgfHxcclxuICAgICAgICAgICAgICAgIHR5cGVvZiBvYmouY3VzdG9tID09IFwiZnVuY3Rpb25cIik7XHJcbiAgICB9O1xyXG4gICAgU2NhbGFyU3ByZWFkLnByb3RvdHlwZS5zYW1wbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VzdG9tKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmN1c3RvbSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcmFuZFI7XHJcbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PSBTcHJlYWRUeXBlLlVuaWZvcm0gfHwgdGhpcy50eXBlID09IFNwcmVhZFR5cGUuUmVjdFVuaWZvcm0pIHtcclxuICAgICAgICAgICAgcmFuZFIgPSBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmFuZFIgPSAoKE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSkgLSAzKSAvIDM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByYW5kUiAqIHRoaXMuc3ByZWFkICsgdGhpcy52YWx1ZTtcclxuICAgIH07XHJcbiAgICBTY2FsYXJTcHJlYWQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChzcHIpIHtcclxuICAgICAgICB0aGlzLnZhbHVlICs9IHNwcjtcclxuICAgIH07XHJcbiAgICByZXR1cm4gU2NhbGFyU3ByZWFkO1xyXG59KSgpO1xyXG5leHBvcnRzLlNjYWxhclNwcmVhZCA9IFNjYWxhclNwcmVhZDtcclxuIiwidmFyIFZlY3RvcjIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gVmVjdG9yMih4LCB5KSB7XHJcbiAgICAgICAgdGhpcy54ID0geCB8fCAwO1xyXG4gICAgICAgIHRoaXMueSA9IHkgfHwgMDtcclxuICAgIH1cclxuICAgIFZlY3RvcjIuZnJvbVBvbGFyID0gZnVuY3Rpb24gKHIsIHRoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHIgKiBNYXRoLmNvcyh0aCksIHIgKiBNYXRoLnNpbih0aCkpO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiAodikge1xyXG4gICAgICAgIGlmICh2ICYmIHYueCAmJiB2LnkpIHtcclxuICAgICAgICAgICAgdi54ID0gdGhpcy54O1xyXG4gICAgICAgICAgICB2LnkgPSB0aGlzLnk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCwgdGhpcy55KTtcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gXCIoXCIgKyB0aGlzLnggKyBcIixcIiArIHRoaXMueSArIFwiKVwiO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgdGhpcy54ICs9IHYueDtcclxuICAgICAgICB0aGlzLnkgKz0gdi55O1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLnBsdXMgPSBmdW5jdGlvbiAodikge1xyXG4gICAgICAgIHZhciB2MiA9IHRoaXMuY2xvbmUoKTtcclxuICAgICAgICB2Mi54ICs9IHYueDtcclxuICAgICAgICB2Mi55ICs9IHYueTtcclxuICAgICAgICByZXR1cm4gdjI7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUuc3VidHJhY3QgPSBmdW5jdGlvbiAodikge1xyXG4gICAgICAgIHRoaXMueCAtPSB2Lng7XHJcbiAgICAgICAgdGhpcy55IC09IHYueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5taW51cyA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgdmFyIHYyID0gdGhpcy5jbG9uZSgpO1xyXG4gICAgICAgIHYyLnggLT0gdi54O1xyXG4gICAgICAgIHYyLnkgLT0gdi55O1xyXG4gICAgICAgIHJldHVybiB2MjtcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5tdWx0ID0gZnVuY3Rpb24gKHgsIHkpIHtcclxuICAgICAgICBpZiAoeCBpbnN0YW5jZW9mIFZlY3RvcjIpIHtcclxuICAgICAgICAgICAgdGhpcy54ICo9IHgueDtcclxuICAgICAgICAgICAgdGhpcy55ICo9IHgueTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMueCAqPSB4O1xyXG4gICAgICAgICAgICB0aGlzLnkgKj0gdHlwZW9mIHkgPT09IFwibnVtYmVyXCIgPyB5IDogeDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUuaGFkYW1hcmQgPSBmdW5jdGlvbiAodmVjKSB7XHJcbiAgICAgICAgdGhpcy54ICo9IHZlYy54O1xyXG4gICAgICAgIHRoaXMueSAqPSB2ZWMueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5sZW5ndGggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnkpO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLmxlbmd0aFNxID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnk7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUuZG90ID0gZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ICogdi54ICsgdGhpcy55ICogdi55O1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLmRpc3QgPSBmdW5jdGlvbiAodikge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLnggLSB2LngsIHRoaXMueSAtIHYueSkubGVuZ3RoKCk7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUubm9ybWFsaXplID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCgpO1xyXG4gICAgICAgIHRoaXMueCAvPSBsZW5ndGg7XHJcbiAgICAgICAgdGhpcy55IC89IGxlbmd0aDtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICByZXR1cm4gVmVjdG9yMjtcclxufSkoKTtcclxuZXhwb3J0cy5WZWN0b3IyID0gVmVjdG9yMjtcclxuIiwidmFyIHBhcnRpY2xlU3lzdGVtXzEgPSByZXF1aXJlKFwiLi9wYXJ0aWNsZVN5c3RlbVwiKTtcclxudmFyIEVtaXR0ZXIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gRW1pdHRlcihwYXJlbnRFbGVtLCBhcmdzKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLnVwZGF0ZUxvY2sgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm1ha2VFbGVtZW50KGFyZ3MpO1xyXG4gICAgICAgIGFyZ3MuY2FudmFzID0gdGhpcy5jYW52YXM7XHJcbiAgICAgICAgYXJncy50aWNrUmF0ZSA9IGFyZ3MudGlja1JhdGUgfHwgMTY7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZVN5c3RlbSA9IG5ldyBwYXJ0aWNsZVN5c3RlbV8xLlBhcnRpY2xlU3lzdGVtKGFyZ3MpO1xyXG4gICAgICAgIHRoaXMucGFyZW50RWxlbSA9IHBhcmVudEVsZW07XHJcbiAgICAgICAgdGhpcy50aWNrUmF0ZSA9IGFyZ3MudGlja1JhdGUgfHwgMTY7XHJcbiAgICAgICAgdGhpcy5vbkVtaXR0ZXJEZWF0aCA9IGFyZ3Mub25FbWl0dGVyRGVhdGg7XHJcbiAgICAgICAgdGhpcy56SW5kZXggPSB0eXBlb2YgYXJncy56SW5kZXggPT09IFwibnVtYmVyXCIgPyBhcmdzLnpJbmRleCA6IFwiYXV0b1wiO1xyXG4gICAgICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMucmVzaXplQ2FudmFzKCk7IH0pO1xyXG4gICAgfVxyXG4gICAgRW1pdHRlci5wcm90b3R5cGUubWFrZUVsZW1lbnQgPSBmdW5jdGlvbiAoYXJncykge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gJChcIjxjYW52YXM+PC9jYW52YXM+XCIpXHJcbiAgICAgICAgICAgIC5hZGRDbGFzcyhcInNwYXJrbGUtZW1pdHRlclwiKVxyXG4gICAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgXCJwb3NpdGlvblwiOiBcImFic29sdXRlXCIsXHJcbiAgICAgICAgICAgIFwidG9wXCI6IFwiMHB4XCIsXHJcbiAgICAgICAgICAgIFwibGVmdFwiOiBcIjBweFwiLFxyXG4gICAgICAgICAgICBcIndpZHRoXCI6IFwiMTAwJVwiLFxyXG4gICAgICAgICAgICBcImhlaWdodFwiOiBcIjEwMCVcIixcclxuICAgICAgICAgICAgXCJwb2ludGVyLWV2ZW50c1wiOiBcIm5vbmVcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmICh0eXBlb2YgYXJncy56SW5kZXggPT09IFwibnVtYmVyXCIpXHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLmNzcyhcInotaW5kZXhcIiwgYXJncy56SW5kZXgpO1xyXG4gICAgICAgICQoXCJib2R5XCIpLmFwcGVuZCh0aGlzLmNhbnZhcyk7XHJcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhc1swXS5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgIHRoaXMucmVzaXplQ2FudmFzKCk7XHJcbiAgICB9O1xyXG4gICAgRW1pdHRlci5wcm90b3R5cGUucmVzaXplQ2FudmFzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzWzBdLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcbiAgICAgICAgdGhpcy5jYW52YXNbMF0uaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG4gICAgfTtcclxuICAgIEVtaXR0ZXIucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLnVwZGF0ZSgpOyB9LCB0aGlzLnRpY2tSYXRlKTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIEVtaXR0ZXIucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBFbWl0dGVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudXBkYXRlTG9jaylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTG9jayA9IHRydWU7XHJcbiAgICAgICAgdmFyIGR0ID0gdGhpcy50aWNrUmF0ZSAvIDEwMDA7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZVN5c3RlbS51cGRhdGUoZHQpO1xyXG4gICAgICAgIGlmICghdGhpcy5wYXJ0aWNsZVN5c3RlbS5hbGl2ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICAgICAgJCh0aGlzLmNhbnZhcykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5vbkVtaXR0ZXJEZWF0aCA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkVtaXR0ZXJEZWF0aCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZUxvY2sgPSBmYWxzZTtcclxuICAgIH07XHJcbiAgICBFbWl0dGVyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAoIXRoaXMucGFydGljbGVTeXN0ZW0uYWxpdmUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jdHguY2FudmFzLndpZHRoLCB0aGlzLmN0eC5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy5wYXJlbnRFbGVtLm9mZnNldCgpO1xyXG4gICAgICAgIHZhciBvZmZzZXRYID0gb2Zmc2V0LmxlZnQgKyB0aGlzLnBhcmVudEVsZW0ub3V0ZXJXaWR0aCgpIC8gMjtcclxuICAgICAgICB2YXIgb2Zmc2V0WSA9IG9mZnNldC50b3AgKyB0aGlzLnBhcmVudEVsZW0ub3V0ZXJIZWlnaHQoKSAvIDI7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZVN5c3RlbS5yZW5kZXIodGhpcy5jdHgsIG9mZnNldFgsIG9mZnNldFkpO1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5yZW5kZXIoKTsgfSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIEVtaXR0ZXI7XHJcbn0pKCk7XHJcbmV4cG9ydHMuRW1pdHRlciA9IEVtaXR0ZXI7XHJcbiIsInZhciBWZWN0b3IyXzEgPSByZXF1aXJlKFwiLi9WZWN0b3IyXCIpO1xyXG52YXIgUGFydGljbGUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gUGFydGljbGUoYXJncykge1xyXG4gICAgICAgIHRoaXMuYWNjZWxlcmF0aW9uRmllbGQgPSBhcmdzLmFjY2VsZXJhdGlvbkZpZWxkO1xyXG4gICAgICAgIHRoaXMuZWxlbUZhY3RvcnkgPSBhcmdzLmVsZW1GYWN0b3J5O1xyXG4gICAgICAgIHRoaXMudGlja1JhdGUgPSBhcmdzLnRpY2tSYXRlIHx8IDE2O1xyXG4gICAgICAgIHRoaXMuc3ByaXRlID0gYXJncy5zcHJpdGU7XHJcbiAgICAgICAgdGhpcy5zY2FsZSA9IGFyZ3Muc2NhbGUgfHwgMTtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uID0gYXJncy5yb3RhdGlvbiB8fCAwO1xyXG4gICAgICAgIHRoaXMucm90YXRpb25WZWxvY2l0eSA9IGFyZ3Mucm90YXRpb25WZWxvY2l0eSB8fCAwO1xyXG4gICAgICAgIHRoaXMuc2V0dXBPcGFjaXR5KGFyZ3Mub3BhY2l0eSk7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IGFyZ3MucG9zaXRpb24gPyBhcmdzLnBvc2l0aW9uLmNsb25lKCkgOiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoKTtcclxuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gYXJncy52ZWxvY2l0eSA/IGFyZ3MudmVsb2NpdHkuY2xvbmUoKSA6IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigpO1xyXG4gICAgICAgIHRoaXMuYWNjZWxlcmF0aW9uID0gYXJncy5hY2NlbGVyYXRpb24gPyBhcmdzLmFjY2VsZXJhdGlvbi5jbG9uZSgpIDogbmV3IFZlY3RvcjJfMS5WZWN0b3IyKCk7XHJcbiAgICAgICAgdGhpcy5oaWdoZXJPcmRlciA9IFtdO1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGFyZ3MuaGlnaGVyT3JkZXIpKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5oaWdoZXJPcmRlci5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWdoZXJPcmRlci5wdXNoKGFyZ3MuaGlnaGVyT3JkZXJbaV0gPyBhcmdzLmhpZ2hlck9yZGVyW2ldLmNsb25lKCkgOiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5tYXhMaWZlID0gdHlwZW9mIGFyZ3MubWF4TGlmZSA9PSBcIm51bWJlclwiID8gYXJncy5tYXhMaWZlIDogMTtcclxuICAgICAgICB0aGlzLmxpZmUgPSAwO1xyXG4gICAgICAgIHRoaXMuYWxpdmUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZWxlbSA9IG51bGw7XHJcbiAgICB9XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGR0KSB7XHJcbiAgICAgICAgdGhpcy5saWZlICs9IGR0O1xyXG4gICAgICAgIGlmICh0aGlzLm1heExpZmUgPD0gdGhpcy5saWZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWxpdmUgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5lbGVtICYmIHRoaXMuZWxlbS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5lbGVtID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuYWNjZWxlcmF0aW9uRmllbGQpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVCeUZpZWxkKGR0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQnlUYXlsb3IoZHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJvdGF0aW9uICs9IHRoaXMucm90YXRpb25WZWxvY2l0eTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUudXBkYXRlRWxlbWVudCA9IGZ1bmN0aW9uIChvZmZzZXRYLCBvZmZzZXRZKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmFsaXZlIHx8ICF0aGlzLmVsZW0pXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLmVsZW1cclxuICAgICAgICAgICAgLmNzcyhcImxlZnRcIiwgdGhpcy5wb3NpdGlvbi54ICsgb2Zmc2V0WCArIFwicHhcIilcclxuICAgICAgICAgICAgLmNzcyhcInRvcFwiLCB0aGlzLnBvc2l0aW9uLnkgKyBvZmZzZXRZICsgXCJweFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwib3BhY2l0eVwiLCB0aGlzLmN1cnJlbnRPcGFjaXR5KCkpO1xyXG4gICAgICAgIHRoaXMuZWxlbS5jc3MoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoLTUwJSwgLTUwJSkgcm90YXRlKFwiICsgTWF0aC5mbG9vcih0aGlzLnJvdGF0aW9uKSArIFwiZGVnKSBzY2FsZShcIiArIHRoaXMuc2NhbGUgKyBcIilcIik7XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGUucHJvdG90eXBlLnVwZGF0ZUJ5RmllbGQgPSBmdW5jdGlvbiAoZHQpIHtcclxuICAgICAgICB2YXIgYWNjZWwgPSB0aGlzLmFjY2VsZXJhdGlvbkZpZWxkKHRoaXMucG9zaXRpb24pO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkuYWRkKGFjY2VsLnNhbXBsZSgpKTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLmFkZCh0aGlzLnZlbG9jaXR5KTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUudXBkYXRlQnlUYXlsb3IgPSBmdW5jdGlvbiAoZHQpIHtcclxuICAgICAgICB2YXIgZGVsID0gbnVsbDtcclxuICAgICAgICBmb3IgKHZhciBpID0gdGhpcy5oaWdoZXJPcmRlci5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xyXG4gICAgICAgICAgICBpZiAoZGVsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZ2hlck9yZGVyW2ldLmFkZChkZWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRlbCA9IHRoaXMuaGlnaGVyT3JkZXJbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5hY2NlbGVyYXRpb24uYWRkKGRlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudmVsb2NpdHkuYWRkKHRoaXMuYWNjZWxlcmF0aW9uKTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uLmFkZCh0aGlzLnZlbG9jaXR5KTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3VycmVudExpZmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGlmZSAvIHRoaXMubWF4TGlmZTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuc2V0dXBPcGFjaXR5ID0gZnVuY3Rpb24gKG9wYWNpdHkpIHtcclxuICAgICAgICBpZiAodHlwZW9mIG9wYWNpdHkgPT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICB0aGlzLm9wYWNpdHlOdW1iZXIgPSBvcGFjaXR5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KG9wYWNpdHkpKSB7XHJcbiAgICAgICAgICAgIG9wYWNpdHkuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gYS5saWZlIC0gYi5saWZlOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5vcGFjaXR5QXJyYXkgPSBvcGFjaXR5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2Ygb3BhY2l0eSA9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5vcGFjaXR5RnVuY3Rpb24gPSBvcGFjaXR5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vcGFjaXR5TnVtYmVyID0gMTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGUucHJvdG90eXBlLmN1cnJlbnRPcGFjaXR5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMub3BhY2l0eUFycmF5KSkge1xyXG4gICAgICAgICAgICB2YXIgbGlmZSA9IHRoaXMuY3VycmVudExpZmUoKTtcclxuICAgICAgICAgICAgdmFyIHByZXYgPSBudWxsLCBuZXh0ID0gbnVsbDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wYWNpdHlBcnJheS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9wID0gdGhpcy5vcGFjaXR5QXJyYXlbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAob3AubGlmZSA8PSBsaWZlKVxyXG4gICAgICAgICAgICAgICAgICAgIHByZXYgPSBvcDtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCFuZXh0KVxyXG4gICAgICAgICAgICAgICAgICAgIG5leHQgPSBvcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJldiAmJiBuZXh0KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZExpZmUgPSBuZXh0LmxpZmUgLSBwcmV2LmxpZmU7XHJcbiAgICAgICAgICAgICAgICB2YXIgZE9wYWNpdHkgPSBuZXh0LnZhbHVlIC0gcHJldi52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHZhciBhbW91bnRJbnRvID0gbGlmZSAtIHByZXYubGlmZTtcclxuICAgICAgICAgICAgICAgIHZhciBwZXJjZW50QWNyb3NzID0gYW1vdW50SW50byAvIGRMaWZlO1xyXG4gICAgICAgICAgICAgICAgdmFyIG9wYWNpdHlPZmZzZXQgPSBwZXJjZW50QWNyb3NzICogZE9wYWNpdHk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3BhY2l0eU9mZnNldCArIHByZXYudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAocHJldikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZXYudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAobmV4dCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgdGhpcy5vcGFjaXR5RnVuY3Rpb24gPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgIHZhciBsaWZlID0gdGhpcy5jdXJyZW50TGlmZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcGFjaXR5RnVuY3Rpb24obGlmZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiB0aGlzLm9wYWNpdHlOdW1iZXIgPT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcGFjaXR5TnVtYmVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5uZXdFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmVsZW1GYWN0b3J5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbSA9IHRoaXMuZWxlbUZhY3RvcnkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudCgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZWxlbSA9ICQoXCI8ZGl2PjwvZGl2PlwiKTtcclxuICAgICAgICBlbGVtLmNzcyhcInBvc2l0aW9uXCIsIFwiYWJzb2x1dGVcIik7XHJcbiAgICAgICAgdGhpcy5kdXN0RWxlbWVudChlbGVtKTtcclxuICAgICAgICB0aGlzLmJsZW5kTW9kZUVsZW1lbnQoZWxlbSk7XHJcbiAgICAgICAgdGhpcy5lbGVtID0gZWxlbTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY2lyY2xlRWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtKSB7XHJcbiAgICAgICAgdmFyIHJhZGl1cyA9IDIuNTtcclxuICAgICAgICBlbGVtXHJcbiAgICAgICAgICAgIC5jc3MoXCJ3aWR0aFwiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJoZWlnaHRcIiwgKDIgKiByYWRpdXMpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwiYm9yZGVyLXJhZGl1c1wiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJiYWNrZ3JvdW5kXCIsIFwicmVkXCIpO1xyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5kdXN0RWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtKSB7XHJcbiAgICAgICAgdmFyIGNvbG9yID0geyByOiAwLCBnOiAwLCBiOiAwIH07XHJcbiAgICAgICAgdmFyIGNjb2xvciA9IFwicmdiYSgwLCAwLCAwLCAxKVwiO1xyXG4gICAgICAgIHZhciByYWRpdXMgPSAzLjU7XHJcbiAgICAgICAgZWxlbVxyXG4gICAgICAgICAgICAuY3NzKFwid2lkdGhcIiwgKDIgKiByYWRpdXMpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwiaGVpZ2h0XCIsICgyICogcmFkaXVzKSArIFwicHhcIilcclxuICAgICAgICAgICAgLmNzcyhcImJvcmRlci1yYWRpdXNcIiwgKDIgKiByYWRpdXMpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwiYmFja2dyb3VuZFwiLCBcInJlZFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwiYmFja2dyb3VuZFwiLCBcInJhZGlhbC1ncmFkaWVudChlbGxpcHNlIGF0IGNlbnRlciwgXCIgKyBjY29sb3IgKyBcIiAwJSxyZ2JhKDAsMCwwLDApIDcwJSlcIik7XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGUucHJvdG90eXBlLmZpcmVFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgICB2YXIgcmFkaXVzID0gOTtcclxuICAgICAgICBlbGVtXHJcbiAgICAgICAgICAgIC5jc3MoXCJ3aWR0aFwiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJoZWlnaHRcIiwgKDIgKiByYWRpdXMpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwiYm9yZGVyLXJhZGl1c1wiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJiYWNrZ3JvdW5kXCIsIFwicmVkXCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJiYWNrZ3JvdW5kXCIsIFwicmFkaWFsLWdyYWRpZW50KGVsbGlwc2UgYXQgY2VudGVyLCByZ2JhKDI0OSwyNDksNDksMSkgMCUscmdiYSgyNTIsNDcsNDcsMC42MikgMzElLHJnYmEoMjQ0LDU3LDUxLDApIDcwJSlcIik7XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGUucHJvdG90eXBlLmJsZW5kTW9kZUVsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbSkge1xyXG4gICAgICAgIGVsZW1cclxuICAgICAgICAgICAgLmNzcyhcImJhY2tncm91bmQtYmxlbmQtbW9kZVwiLCBcIm11bHRpcGx5XCIpO1xyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoY3R4LCBvZmZzZXRYLCBvZmZzZXRZKSB7XHJcbiAgICAgICAgY3R4LnNhdmUoKTtcclxuICAgICAgICBjdHgudHJhbnNsYXRlKHRoaXMucG9zaXRpb24ueCArIG9mZnNldFgsIHRoaXMucG9zaXRpb24ueSArIG9mZnNldFkpO1xyXG4gICAgICAgIHZhciB3aWR0aCA9IHRoaXMuc3ByaXRlLndpZHRoIHx8IDE7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IHRoaXMuc3ByaXRlLmhlaWdodCB8fCAxO1xyXG4gICAgICAgIGN0eC50cmFuc2xhdGUodGhpcy5zY2FsZSAqIHdpZHRoIC8gMiwgdGhpcy5zY2FsZSAqIGhlaWdodCAvIDIpO1xyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5zcHJpdGUsIC10aGlzLnNjYWxlICogd2lkdGggLyAyLCAtdGhpcy5zY2FsZSAqIGhlaWdodCAvIDIpO1xyXG4gICAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IDE7XHJcbiAgICAgICAgY3R4LnJlc3RvcmUoKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gUGFydGljbGU7XHJcbn0pKCk7XHJcbmV4cG9ydHMuUGFydGljbGUgPSBQYXJ0aWNsZTtcclxuIiwidmFyIHBhcnRpY2xlXzEgPSByZXF1aXJlKFwiLi9wYXJ0aWNsZVwiKTtcclxudmFyIFNwcmVhZF8xID0gcmVxdWlyZShcIi4vU3ByZWFkXCIpO1xyXG52YXIgUGFydGljbGVTeXN0ZW0gPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gUGFydGljbGVTeXN0ZW0oYXJncykge1xyXG4gICAgICAgIHRoaXMubGlmZSA9IDA7XHJcbiAgICAgICAgdGhpcy5sYXN0UGFydGljbGVBZGRlZCA9IDA7XHJcbiAgICAgICAgdGhpcy5keWluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYWxpdmUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0gYXJncztcclxuICAgICAgICB0aGlzLnBhcnRpY2xlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMubWF4TGlmZSA9IGFyZ3MubWF4TGlmZSA/IG5ldyBTcHJlYWRfMS5TY2FsYXJTcHJlYWQoYXJncy5tYXhMaWZlKSA6IG5ldyBTcHJlYWRfMS5TY2FsYXJTcHJlYWQoNSk7XHJcbiAgICAgICAgdGhpcy5tYXhQYXJ0aWNsZXMgPSBhcmdzLm1heFBhcnRpY2xlcyB8fCAxMDA7XHJcbiAgICAgICAgdGhpcy5lbWl0UmF0ZSA9IGFyZ3MuZW1pdFJhdGUgfHwgMC4xO1xyXG4gICAgICAgIHRoaXMuZW1pdHRlck1heExpZmUgPSBhcmdzLmVtaXR0ZXJNYXhMaWZlID8gYXJncy5lbWl0dGVyTWF4TGlmZSA6IG51bGw7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBhcmdzLmNhbnZhcztcclxuICAgICAgICB0aGlzLmN0eCA9IGFyZ3MuY3R4O1xyXG4gICAgICAgIHRoaXMudGlja1JhdGUgPSBhcmdzLnRpY2tSYXRlIHx8IDE2O1xyXG4gICAgICAgIHRoaXMuYWNjZWxlcmF0aW9uRmllbGQgPSBhcmdzLmFjY2VsZXJhdGlvbkZpZWxkO1xyXG4gICAgICAgIHRoaXMucGFydGljbGVFbGVtRmFjdG9yeSA9IGFyZ3MucGFydGljbGVFbGVtRmFjdG9yeTtcclxuICAgICAgICB0aGlzLnNwcml0ZSA9IGFyZ3Muc3ByaXRlO1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSBuZXcgU3ByZWFkXzEuU2NhbGFyU3ByZWFkKGFyZ3Muc2NhbGUpO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gPSBuZXcgU3ByZWFkXzEuU2NhbGFyU3ByZWFkKGFyZ3Mucm90YXRpb24pO1xyXG4gICAgICAgIHRoaXMucm90YXRpb25WZWxvY2l0eSA9IG5ldyBTcHJlYWRfMS5TY2FsYXJTcHJlYWQoYXJncy5yb3RhdGlvblZlbG9jaXR5KTtcclxuICAgICAgICBpZiAodHlwZW9mIGFyZ3Mub3BhY2l0eSA9PT0gXCJudW1iZXJcIiB8fCBTcHJlYWRfMS5TY2FsYXJTcHJlYWQuaXNBcmcoYXJncy5vcGFjaXR5KSkge1xyXG4gICAgICAgICAgICB0aGlzLm9wYWNpdHkgPSBuZXcgU3ByZWFkXzEuU2NhbGFyU3ByZWFkKGFyZ3Mub3BhY2l0eSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm9wYWNpdHkgPSBhcmdzLm9wYWNpdHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgU3ByZWFkXzEuVmVjdG9yU3ByZWFkKGFyZ3MucG9zaXRpb24pO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBuZXcgU3ByZWFkXzEuVmVjdG9yU3ByZWFkKGFyZ3MudmVsb2NpdHkpO1xyXG4gICAgICAgIHRoaXMuYWNjZWxlcmF0aW9uID0gbmV3IFNwcmVhZF8xLlZlY3RvclNwcmVhZChhcmdzLmFjY2VsZXJhdGlvbik7XHJcbiAgICAgICAgdGhpcy5oaWdoZXJPcmRlciA9IFtdO1xyXG4gICAgICAgIGlmIChhcmdzLmdyYXZpdHkpXHJcbiAgICAgICAgICAgIHRoaXMuYWNjZWxlcmF0aW9uLnZhbHVlLmFkZChhcmdzLmdyYXZpdHkpO1xyXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGFyZ3MuaGlnaGVyT3JkZXIpKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5oaWdoZXJPcmRlci5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWdoZXJPcmRlci5wdXNoKG5ldyBTcHJlYWRfMS5WZWN0b3JTcHJlYWQoYXJncy5oaWdoZXJPcmRlcltpXSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgUGFydGljbGVTeXN0ZW0ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkdCkge1xyXG4gICAgICAgIHRoaXMubGlmZSArPSBkdDtcclxuICAgICAgICBpZiAoIXRoaXMuYWxpdmUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBpZiAodGhpcy5keWluZyAmJiB0aGlzLnBhcnRpY2xlcy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmFsaXZlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmVtaXR0ZXJNYXhMaWZlID09PSBcIm51bWJlclwiICYmIHRoaXMuZW1pdHRlck1heExpZmUgPiAwICYmIHRoaXMubGlmZSA+PSB0aGlzLmVtaXR0ZXJNYXhMaWZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZHlpbmcgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgbmV3UGFydGljbGVzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBhcnRpY2xlcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICB2YXIgcCA9IHRoaXMucGFydGljbGVzW2ldO1xyXG4gICAgICAgICAgICBwLnVwZGF0ZShkdCk7XHJcbiAgICAgICAgICAgIGlmICghcC5hbGl2ZSlcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBuZXdQYXJ0aWNsZXMucHVzaChwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG5ld1BhcnRpY2xlc1BlclRpY2sgPSB0aGlzLmVtaXRSYXRlO1xyXG4gICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgKG5ld1BhcnRpY2xlc1BlclRpY2sgLSBNYXRoLmZsb29yKG5ld1BhcnRpY2xlc1BlclRpY2spKSkge1xyXG4gICAgICAgICAgICBuZXdQYXJ0aWNsZXNQZXJUaWNrID0gTWF0aC5mbG9vcihuZXdQYXJ0aWNsZXNQZXJUaWNrKSArIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBuZXdQYXJ0aWNsZXNQZXJUaWNrID0gTWF0aC5mbG9vcihuZXdQYXJ0aWNsZXNQZXJUaWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLmR5aW5nICYmIG5ld1BhcnRpY2xlcy5sZW5ndGggPCB0aGlzLm1heFBhcnRpY2xlcykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5ld1BhcnRpY2xlc1BlclRpY2s7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgbmV3UGFydGljbGVzLnB1c2godGhpcy5jcmVhdGVQYXJ0aWNsZSgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBhcnRpY2xlcyA9IG5ld1BhcnRpY2xlcztcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZVN5c3RlbS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKGN0eCwgb2Zmc2V0WCwgb2Zmc2V0WSkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wYXJ0aWNsZXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgdmFyIHAgPSB0aGlzLnBhcnRpY2xlc1tpXTtcclxuICAgICAgICAgICAgcC5yZW5kZXIoY3R4LCBvZmZzZXRYLCBvZmZzZXRZKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGVTeXN0ZW0ucHJvdG90eXBlLnNhbXBsZVNwcml0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZVN5c3RlbS5wcm90b3R5cGUuY3JlYXRlUGFydGljbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXJ0aWNsZV8xLlBhcnRpY2xlKHtcclxuICAgICAgICAgICAgbWF4TGlmZTogdGhpcy5tYXhMaWZlLnNhbXBsZSgpLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogdGhpcy5wb3NpdGlvbi5zYW1wbGUoKSxcclxuICAgICAgICAgICAgdmVsb2NpdHk6IHRoaXMudmVsb2NpdHkgJiYgdGhpcy52ZWxvY2l0eS5zYW1wbGUoKSxcclxuICAgICAgICAgICAgYWNjZWxlcmF0aW9uOiB0aGlzLmFjY2VsZXJhdGlvbiAmJiB0aGlzLmFjY2VsZXJhdGlvbi5zYW1wbGUoKSxcclxuICAgICAgICAgICAgaGlnaGVyT3JkZXI6IHRoaXMuaGlnaGVyT3JkZXIgJiYgdGhpcy5oaWdoZXJPcmRlci5tYXAoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHguc2FtcGxlKCk7IH0pLFxyXG4gICAgICAgICAgICBhY2NlbGVyYXRpb25GaWVsZDogdGhpcy5hY2NlbGVyYXRpb25GaWVsZCxcclxuICAgICAgICAgICAgZWxlbUZhY3Rvcnk6IHRoaXMucGFydGljbGVFbGVtRmFjdG9yeSxcclxuICAgICAgICAgICAgc3ByaXRlOiB0aGlzLnNwcml0ZSxcclxuICAgICAgICAgICAgc2NhbGU6IHRoaXMuc2NhbGUuc2FtcGxlKCksXHJcbiAgICAgICAgICAgIHJvdGF0aW9uOiB0aGlzLnJvdGF0aW9uLnNhbXBsZSgpLFxyXG4gICAgICAgICAgICByb3RhdGlvblZlbG9jaXR5OiB0aGlzLnJvdGF0aW9uVmVsb2NpdHkuc2FtcGxlKCksXHJcbiAgICAgICAgICAgIG9wYWNpdHk6ICh0aGlzLm9wYWNpdHkgaW5zdGFuY2VvZiBTcHJlYWRfMS5TY2FsYXJTcHJlYWQpID9cclxuICAgICAgICAgICAgICAgIHRoaXMub3BhY2l0eS5zYW1wbGUoKSA6XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wYWNpdHksXHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFBhcnRpY2xlU3lzdGVtO1xyXG59KSgpO1xyXG5leHBvcnRzLlBhcnRpY2xlU3lzdGVtID0gUGFydGljbGVTeXN0ZW07XHJcbiIsInZhciBTcHJlYWRfMSA9IHJlcXVpcmUoXCIuL1NwcmVhZFwiKTtcclxuZXhwb3J0cy5WZWN0b3JTcHJlYWQgPSBTcHJlYWRfMS5WZWN0b3JTcHJlYWQ7XHJcbmV4cG9ydHMuU2NhbGFyU3ByZWFkID0gU3ByZWFkXzEuU2NhbGFyU3ByZWFkO1xyXG5leHBvcnRzLlNwcmVhZFR5cGUgPSBTcHJlYWRfMS5TcHJlYWRUeXBlO1xyXG52YXIgVmVjdG9yMl8xID0gcmVxdWlyZShcIi4vVmVjdG9yMlwiKTtcclxuZXhwb3J0cy5WZWN0b3IyID0gVmVjdG9yMl8xLlZlY3RvcjI7XHJcbnZhciBlbWl0dGVyXzEgPSByZXF1aXJlKFwiLi9lbWl0dGVyXCIpO1xyXG5leHBvcnRzLkVtaXR0ZXIgPSBlbWl0dGVyXzEuRW1pdHRlcjtcclxudmFyIGVtaXR0ZXJfMiA9IHJlcXVpcmUoXCIuL2VtaXR0ZXJcIik7XHJcbnZhciBWZWN0b3IyXzIgPSByZXF1aXJlKFwiLi9WZWN0b3IyXCIpO1xyXG5mdW5jdGlvbiBzcGFya2xlKCRlbGVtKSB7XHJcbiAgICB2YXIgc3ByaXRlID0gJChcIjxjYW52YXM+PC9jYW52YXM+XCIpWzBdO1xyXG4gICAgc3ByaXRlLndpZHRoID0gMTY7XHJcbiAgICBzcHJpdGUuaGVpZ2h0ID0gMTY7XHJcbiAgICB2YXIgY3R4ID0gc3ByaXRlLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHguYXJjKDgsIDgsIDgsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gJ3JlZCc7XHJcbiAgICBjdHguZmlsbCgpO1xyXG4gICAgbmV3IGVtaXR0ZXJfMi5FbWl0dGVyKCRlbGVtLCB7XHJcbiAgICAgICAgbWF4UGFydGljbGVzOiAxMDAsXHJcbiAgICAgICAgZW1pdFJhdGU6IDEsXHJcbiAgICAgICAgc3ByaXRlOiBzcHJpdGUsXHJcbiAgICAgICAgbWF4TGlmZToge1xyXG4gICAgICAgICAgICB2YWx1ZTogMSxcclxuICAgICAgICAgICAgc3ByZWFkOiAwLjVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHZlbG9jaXR5OiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBuZXcgVmVjdG9yMl8yLlZlY3RvcjIoMCwgLTUpLFxyXG4gICAgICAgICAgICBzcHJlYWQ6IG5ldyBWZWN0b3IyXzIuVmVjdG9yMig3LCAyKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ3Jhdml0eTogbmV3IFZlY3RvcjJfMi5WZWN0b3IyKDAsIDAuMilcclxuICAgIH0pLnN0YXJ0KCk7XHJcbn1cclxuZXhwb3J0cy5zcGFya2xlID0gc3BhcmtsZTtcclxuIl19
