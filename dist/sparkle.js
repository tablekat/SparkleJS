(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Sparkle = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Vector2_1 = require("./Vector2");
(function (SpreadType) {
    SpreadType[SpreadType["Uniform"] = 0] = "Uniform";
    SpreadType[SpreadType["Normal"] = 1] = "Normal";
    SpreadType[SpreadType["RectUniform"] = 2] = "RectUniform";
    SpreadType[SpreadType["Circle"] = 3] = "Circle";
    SpreadType[SpreadType["BoxBorder"] = 4] = "BoxBorder";
})(exports.SpreadType || (exports.SpreadType = {}));
var SpreadType = exports.SpreadType;
var VectorSpread = (function () {
    function VectorSpread(value, spread, spreadType) {
        if (value instanceof Vector2_1.Vector2 || !value) {
            this.value = value || new Vector2_1.Vector2(0, 0);
            this.spread = spread || new Vector2_1.Vector2(0, 0);
            this.type = typeof spreadType == "number" ? spreadType : SpreadType.Normal;
            this.custom = null;
        }
        else {
            this.value = value.value || new Vector2_1.Vector2(0, 0);
            this.spread = value.spread || new Vector2_1.Vector2(0, 0);
            this.type = value.type;
            if (typeof this.type != "number")
                this.type = SpreadType.Normal;
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
        else if (this.type == SpreadType.BoxBorder) {
            var w = this.spread.x * 2;
            var h = this.spread.y * 2;
            var peri = 2 * w + 2 * h;
            var periPos = Math.random() * peri;
            var randX = (2 * Math.random() - 1) * this.spread.x;
            var randY = (2 * Math.random() - 1) * this.spread.y;
            var randV = new Vector2_1.Vector2(randX, randY);
            return randV.add(this.value);
        }
        else {
            var randR, randTh;
            randTh = Math.PI * 2 * Math.random();
            if (this.type == SpreadType.Uniform) {
                randR = 2 * Math.random() - 1;
            }
            else if (this.type == SpreadType.Circle) {
                randR = 1;
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
            this.type = typeof spreadType == "number" ? spreadType : SpreadType.Normal;
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
            randR = 2 * Math.random() - 1;
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
        if (v && typeof v.x == "number" && typeof v.y == "number") {
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
    function Emitter(args) {
        var _this = this;
        this.updateLock = false;
        this.makeElement(args);
        args.canvas = this.canvas;
        args.tickRate = args.tickRate || 16;
        this.particleSystem = new particleSystem_1.ParticleSystem(args);
        this.tickRate = args.tickRate || 16;
        this.onEmitterDeath = args.onEmitterDeath;
        this.zIndex = typeof args.zIndex === "number" ? args.zIndex : "auto";
        this.parentElem = args.attach;
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
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.currentOpacity();
        ctx.drawImage(this.sprite, -this.scale * width / 2, -this.scale * height / 2, this.scale * width, this.scale * height);
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
        if (typeof this.sprite == "function") {
            return this.sprite();
        }
        else if (Array.isArray(this.sprite)) {
            var i = Math.floor(Math.random() * this.sprite.length);
            return this.sprite[i];
        }
        else {
            return this.sprite;
        }
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
            sprite: this.sampleSprite(),
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
var sprites = {};
sprites["reddot"] = (function () {
    var sprite = $("<canvas></canvas>")[0];
    sprite.width = 12;
    sprite.height = 12;
    var ctx = sprite.getContext('2d');
    ctx.beginPath();
    ctx.arc(6, 6, 6, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'red';
    ctx.fill();
    return sprite;
})();
sprites["dot"] = (function () {
    var sprite = $("<canvas></canvas>")[0];
    sprite.width = 12;
    sprite.height = 12;
    var ctx = sprite.getContext('2d');
    ctx.beginPath();
    ctx.arc(6, 6, 6, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'black';
    ctx.fill();
    return sprite;
})();
sprites["rainbowdot"] = (function () {
    var sprite = $("<canvas></canvas>")[0];
    sprite.width = 12;
    sprite.height = 12;
    var ctx = sprite.getContext('2d');
    ctx.beginPath();
    ctx.arc(6, 6, 6, 0, 2 * Math.PI, false);
    var r = function () { return Math.floor(255 * Math.random()); };
    ctx.fillStyle = "rgb(" + r() + ", " + r() + ", " + r() + ")";
    ctx.fill();
    return sprite;
});
sprites["dust"] = (function () {
    var sprite = $("<canvas></canvas>")[0];
    sprite.width = 12;
    sprite.height = 12;
    var ctx = sprite.getContext('2d');
    ctx.beginPath();
    ctx.arc(6, 6, 6, 0, 2 * Math.PI, false);
    var grd = ctx.createRadialGradient(6, 6, 0, 6, 6, 6 * 0.707);
    grd.addColorStop(0, "black");
    grd.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grd;
    ctx.fill();
    return sprite;
})();
sprites["rainbowdust"] = (function () {
    var sprite = $("<canvas></canvas>")[0];
    sprite.width = 12;
    sprite.height = 12;
    var ctx = sprite.getContext('2d');
    ctx.beginPath();
    ctx.arc(6, 6, 6, 0, 2 * Math.PI, false);
    var grd = ctx.createRadialGradient(6, 6, 1, 6, 6, 6 * 0.707);
    var r = Math.floor(255 * Math.random());
    var g = Math.floor(255 * Math.random());
    var b = Math.floor(255 * Math.random());
    grd.addColorStop(0, "rgba(" + r + ", " + g + ", " + b + ", 1)");
    grd.addColorStop(1, "rgba(" + r + ", " + g + ", " + b + ", 0)");
    ctx.fillStyle = grd;
    ctx.fill();
    return sprite;
});
function sprite(opt) {
    if (!opt) {
        var keys = Object.keys(sprites);
        opt = keys[Math.floor(Math.random() * keys.length)];
        return sprites[opt];
    }
    else if (sprites[opt]) {
        return sprites[opt];
    }
    else {
        return null;
    }
}
exports.sprite = sprite;
function sparkle($elem) {
    new emitter_2.Emitter({
        attach: $elem,
        attachTo: "center",
        maxParticles: 100,
        emitRate: 1,
        sprite: sprite("rainbowdot"),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL1VzZXJzL2JlbmppL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9TcHJlYWQuanMiLCJzcmMvVmVjdG9yMi5qcyIsInNyYy9lbWl0dGVyLmpzIiwic3JjL3BhcnRpY2xlLmpzIiwic3JjL3BhcnRpY2xlU3lzdGVtLmpzIiwic3JjL3NwYXJrbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBWZWN0b3IyXzEgPSByZXF1aXJlKFwiLi9WZWN0b3IyXCIpO1xyXG4oZnVuY3Rpb24gKFNwcmVhZFR5cGUpIHtcclxuICAgIFNwcmVhZFR5cGVbU3ByZWFkVHlwZVtcIlVuaWZvcm1cIl0gPSAwXSA9IFwiVW5pZm9ybVwiO1xyXG4gICAgU3ByZWFkVHlwZVtTcHJlYWRUeXBlW1wiTm9ybWFsXCJdID0gMV0gPSBcIk5vcm1hbFwiO1xyXG4gICAgU3ByZWFkVHlwZVtTcHJlYWRUeXBlW1wiUmVjdFVuaWZvcm1cIl0gPSAyXSA9IFwiUmVjdFVuaWZvcm1cIjtcclxuICAgIFNwcmVhZFR5cGVbU3ByZWFkVHlwZVtcIkNpcmNsZVwiXSA9IDNdID0gXCJDaXJjbGVcIjtcclxuICAgIFNwcmVhZFR5cGVbU3ByZWFkVHlwZVtcIkJveEJvcmRlclwiXSA9IDRdID0gXCJCb3hCb3JkZXJcIjtcclxufSkoZXhwb3J0cy5TcHJlYWRUeXBlIHx8IChleHBvcnRzLlNwcmVhZFR5cGUgPSB7fSkpO1xyXG52YXIgU3ByZWFkVHlwZSA9IGV4cG9ydHMuU3ByZWFkVHlwZTtcclxudmFyIFZlY3RvclNwcmVhZCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBWZWN0b3JTcHJlYWQodmFsdWUsIHNwcmVhZCwgc3ByZWFkVHlwZSkge1xyXG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFZlY3RvcjJfMS5WZWN0b3IyIHx8ICF2YWx1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWUgfHwgbmV3IFZlY3RvcjJfMS5WZWN0b3IyKDAsIDApO1xyXG4gICAgICAgICAgICB0aGlzLnNwcmVhZCA9IHNwcmVhZCB8fCBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoMCwgMCk7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHR5cGVvZiBzcHJlYWRUeXBlID09IFwibnVtYmVyXCIgPyBzcHJlYWRUeXBlIDogU3ByZWFkVHlwZS5Ob3JtYWw7XHJcbiAgICAgICAgICAgIHRoaXMuY3VzdG9tID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZS52YWx1ZSB8fCBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoMCwgMCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByZWFkID0gdmFsdWUuc3ByZWFkIHx8IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigwLCAwKTtcclxuICAgICAgICAgICAgdGhpcy50eXBlID0gdmFsdWUudHlwZTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnR5cGUgIT0gXCJudW1iZXJcIilcclxuICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9IFNwcmVhZFR5cGUuTm9ybWFsO1xyXG4gICAgICAgICAgICB0aGlzLmN1c3RvbSA9IHZhbHVlLmN1c3RvbSB8fCBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFZlY3RvclNwcmVhZC5wcm90b3R5cGUuc2FtcGxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmN1c3RvbSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXN0b20oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PSBTcHJlYWRUeXBlLlJlY3RVbmlmb3JtKSB7XHJcbiAgICAgICAgICAgIHZhciByYW5kWCA9ICgyICogTWF0aC5yYW5kb20oKSAtIDEpICogdGhpcy5zcHJlYWQueDtcclxuICAgICAgICAgICAgdmFyIHJhbmRZID0gKDIgKiBNYXRoLnJhbmRvbSgpIC0gMSkgKiB0aGlzLnNwcmVhZC55O1xyXG4gICAgICAgICAgICB2YXIgcmFuZFYgPSBuZXcgVmVjdG9yMl8xLlZlY3RvcjIocmFuZFgsIHJhbmRZKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJhbmRWLmFkZCh0aGlzLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy50eXBlID09IFNwcmVhZFR5cGUuQm94Qm9yZGVyKSB7XHJcbiAgICAgICAgICAgIHZhciB3ID0gdGhpcy5zcHJlYWQueCAqIDI7XHJcbiAgICAgICAgICAgIHZhciBoID0gdGhpcy5zcHJlYWQueSAqIDI7XHJcbiAgICAgICAgICAgIHZhciBwZXJpID0gMiAqIHcgKyAyICogaDtcclxuICAgICAgICAgICAgdmFyIHBlcmlQb3MgPSBNYXRoLnJhbmRvbSgpICogcGVyaTtcclxuICAgICAgICAgICAgdmFyIHJhbmRYID0gKDIgKiBNYXRoLnJhbmRvbSgpIC0gMSkgKiB0aGlzLnNwcmVhZC54O1xyXG4gICAgICAgICAgICB2YXIgcmFuZFkgPSAoMiAqIE1hdGgucmFuZG9tKCkgLSAxKSAqIHRoaXMuc3ByZWFkLnk7XHJcbiAgICAgICAgICAgIHZhciByYW5kViA9IG5ldyBWZWN0b3IyXzEuVmVjdG9yMihyYW5kWCwgcmFuZFkpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmFuZFYuYWRkKHRoaXMudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHJhbmRSLCByYW5kVGg7XHJcbiAgICAgICAgICAgIHJhbmRUaCA9IE1hdGguUEkgKiAyICogTWF0aC5yYW5kb20oKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PSBTcHJlYWRUeXBlLlVuaWZvcm0pIHtcclxuICAgICAgICAgICAgICAgIHJhbmRSID0gMiAqIE1hdGgucmFuZG9tKCkgLSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMudHlwZSA9PSBTcHJlYWRUeXBlLkNpcmNsZSkge1xyXG4gICAgICAgICAgICAgICAgcmFuZFIgPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmFuZFIgPSAoKE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSkgLSAzKSAvIDM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHJhbmRWID0gVmVjdG9yMl8xLlZlY3RvcjIuZnJvbVBvbGFyKHJhbmRSLCByYW5kVGgpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmFuZFYuaGFkYW1hcmQodGhpcy5zcHJlYWQpLmFkZCh0aGlzLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yU3ByZWFkLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoc3ByKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZS5hZGQoc3ByLnZhbHVlKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gVmVjdG9yU3ByZWFkO1xyXG59KSgpO1xyXG5leHBvcnRzLlZlY3RvclNwcmVhZCA9IFZlY3RvclNwcmVhZDtcclxudmFyIFNjYWxhclNwcmVhZCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBTY2FsYXJTcHJlYWQodmFsdWUsIHNwcmVhZCwgc3ByZWFkVHlwZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT0gXCJudW1iZXJcIiB8fCAhdmFsdWUpIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlIHx8IDA7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByZWFkID0gc3ByZWFkIHx8IDA7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHR5cGVvZiBzcHJlYWRUeXBlID09IFwibnVtYmVyXCIgPyBzcHJlYWRUeXBlIDogU3ByZWFkVHlwZS5Ob3JtYWw7XHJcbiAgICAgICAgICAgIHRoaXMuY3VzdG9tID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZS52YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5zcHJlYWQgPSB2YWx1ZS5zcHJlYWQ7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHZhbHVlLnR5cGUgfHwgU3ByZWFkVHlwZS5Ob3JtYWw7XHJcbiAgICAgICAgICAgIHRoaXMuY3VzdG9tID0gdmFsdWUuY3VzdG9tIHx8IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgU2NhbGFyU3ByZWFkLmlzQXJnID0gZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgIHJldHVybiBvYmogJiZcclxuICAgICAgICAgICAgKHR5cGVvZiBvYmoudmFsdWUgPT0gXCJudW1iZXJcIiB8fFxyXG4gICAgICAgICAgICAgICAgdHlwZW9mIG9iai5zcHJlYWQgPT0gXCJudW1iZXJcIiB8fFxyXG4gICAgICAgICAgICAgICAgdHlwZW9mIG9iai5jdXN0b20gPT0gXCJmdW5jdGlvblwiKTtcclxuICAgIH07XHJcbiAgICBTY2FsYXJTcHJlYWQucHJvdG90eXBlLnNhbXBsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXN0b20pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VzdG9tKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByYW5kUjtcclxuICAgICAgICBpZiAodGhpcy50eXBlID09IFNwcmVhZFR5cGUuVW5pZm9ybSB8fCB0aGlzLnR5cGUgPT0gU3ByZWFkVHlwZS5SZWN0VW5pZm9ybSkge1xyXG4gICAgICAgICAgICByYW5kUiA9IDIgKiBNYXRoLnJhbmRvbSgpIC0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJhbmRSID0gKChNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkgKyBNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSArIE1hdGgucmFuZG9tKCkpIC0gMykgLyAzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmFuZFIgKiB0aGlzLnNwcmVhZCArIHRoaXMudmFsdWU7XHJcbiAgICB9O1xyXG4gICAgU2NhbGFyU3ByZWFkLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoc3ByKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZSArPSBzcHI7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFNjYWxhclNwcmVhZDtcclxufSkoKTtcclxuZXhwb3J0cy5TY2FsYXJTcHJlYWQgPSBTY2FsYXJTcHJlYWQ7XHJcbiIsInZhciBWZWN0b3IyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFZlY3RvcjIoeCwgeSkge1xyXG4gICAgICAgIHRoaXMueCA9IHggfHwgMDtcclxuICAgICAgICB0aGlzLnkgPSB5IHx8IDA7XHJcbiAgICB9XHJcbiAgICBWZWN0b3IyLmZyb21Qb2xhciA9IGZ1bmN0aW9uIChyLCB0aCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMihyICogTWF0aC5jb3ModGgpLCByICogTWF0aC5zaW4odGgpKTtcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICBpZiAodiAmJiB0eXBlb2Ygdi54ID09IFwibnVtYmVyXCIgJiYgdHlwZW9mIHYueSA9PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgIHYueCA9IHRoaXMueDtcclxuICAgICAgICAgICAgdi55ID0gdGhpcy55O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLngsIHRoaXMueSk7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIFwiKFwiICsgdGhpcy54ICsgXCIsXCIgKyB0aGlzLnkgKyBcIilcIjtcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAodikge1xyXG4gICAgICAgIHRoaXMueCArPSB2Lng7XHJcbiAgICAgICAgdGhpcy55ICs9IHYueTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5wbHVzID0gZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICB2YXIgdjIgPSB0aGlzLmNsb25lKCk7XHJcbiAgICAgICAgdjIueCArPSB2Lng7XHJcbiAgICAgICAgdjIueSArPSB2Lnk7XHJcbiAgICAgICAgcmV0dXJuIHYyO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLnN1YnRyYWN0ID0gZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICB0aGlzLnggLT0gdi54O1xyXG4gICAgICAgIHRoaXMueSAtPSB2Lnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUubWludXMgPSBmdW5jdGlvbiAodikge1xyXG4gICAgICAgIHZhciB2MiA9IHRoaXMuY2xvbmUoKTtcclxuICAgICAgICB2Mi54IC09IHYueDtcclxuICAgICAgICB2Mi55IC09IHYueTtcclxuICAgICAgICByZXR1cm4gdjI7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUubXVsdCA9IGZ1bmN0aW9uICh4LCB5KSB7XHJcbiAgICAgICAgaWYgKHggaW5zdGFuY2VvZiBWZWN0b3IyKSB7XHJcbiAgICAgICAgICAgIHRoaXMueCAqPSB4Lng7XHJcbiAgICAgICAgICAgIHRoaXMueSAqPSB4Lnk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnggKj0geDtcclxuICAgICAgICAgICAgdGhpcy55ICo9IHR5cGVvZiB5ID09PSBcIm51bWJlclwiID8geSA6IHg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLmhhZGFtYXJkID0gZnVuY3Rpb24gKHZlYykge1xyXG4gICAgICAgIHRoaXMueCAqPSB2ZWMueDtcclxuICAgICAgICB0aGlzLnkgKj0gdmVjLnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgVmVjdG9yMi5wcm90b3R5cGUubGVuZ3RoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55KTtcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5sZW5ndGhTcSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55O1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLmRvdCA9IGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHYueCArIHRoaXMueSAqIHYueTtcclxuICAgIH07XHJcbiAgICBWZWN0b3IyLnByb3RvdHlwZS5kaXN0ID0gZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54IC0gdi54LCB0aGlzLnkgLSB2LnkpLmxlbmd0aCgpO1xyXG4gICAgfTtcclxuICAgIFZlY3RvcjIucHJvdG90eXBlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGgoKTtcclxuICAgICAgICB0aGlzLnggLz0gbGVuZ3RoO1xyXG4gICAgICAgIHRoaXMueSAvPSBsZW5ndGg7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFZlY3RvcjI7XHJcbn0pKCk7XHJcbmV4cG9ydHMuVmVjdG9yMiA9IFZlY3RvcjI7XHJcbiIsInZhciBwYXJ0aWNsZVN5c3RlbV8xID0gcmVxdWlyZShcIi4vcGFydGljbGVTeXN0ZW1cIik7XHJcbnZhciBFbWl0dGVyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIEVtaXR0ZXIoYXJncykge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy51cGRhdGVMb2NrID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5tYWtlRWxlbWVudChhcmdzKTtcclxuICAgICAgICBhcmdzLmNhbnZhcyA9IHRoaXMuY2FudmFzO1xyXG4gICAgICAgIGFyZ3MudGlja1JhdGUgPSBhcmdzLnRpY2tSYXRlIHx8IDE2O1xyXG4gICAgICAgIHRoaXMucGFydGljbGVTeXN0ZW0gPSBuZXcgcGFydGljbGVTeXN0ZW1fMS5QYXJ0aWNsZVN5c3RlbShhcmdzKTtcclxuICAgICAgICB0aGlzLnRpY2tSYXRlID0gYXJncy50aWNrUmF0ZSB8fCAxNjtcclxuICAgICAgICB0aGlzLm9uRW1pdHRlckRlYXRoID0gYXJncy5vbkVtaXR0ZXJEZWF0aDtcclxuICAgICAgICB0aGlzLnpJbmRleCA9IHR5cGVvZiBhcmdzLnpJbmRleCA9PT0gXCJudW1iZXJcIiA/IGFyZ3MuekluZGV4IDogXCJhdXRvXCI7XHJcbiAgICAgICAgdGhpcy5wYXJlbnRFbGVtID0gYXJncy5hdHRhY2g7XHJcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy5yZXNpemVDYW52YXMoKTsgfSk7XHJcbiAgICB9XHJcbiAgICBFbWl0dGVyLnByb3RvdHlwZS5tYWtlRWxlbWVudCA9IGZ1bmN0aW9uIChhcmdzKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSAkKFwiPGNhbnZhcz48L2NhbnZhcz5cIilcclxuICAgICAgICAgICAgLmFkZENsYXNzKFwic3BhcmtsZS1lbWl0dGVyXCIpXHJcbiAgICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICBcInBvc2l0aW9uXCI6IFwiYWJzb2x1dGVcIixcclxuICAgICAgICAgICAgXCJ0b3BcIjogXCIwcHhcIixcclxuICAgICAgICAgICAgXCJsZWZ0XCI6IFwiMHB4XCIsXHJcbiAgICAgICAgICAgIFwid2lkdGhcIjogXCIxMDAlXCIsXHJcbiAgICAgICAgICAgIFwiaGVpZ2h0XCI6IFwiMTAwJVwiLFxyXG4gICAgICAgICAgICBcInBvaW50ZXItZXZlbnRzXCI6IFwibm9uZVwiXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBhcmdzLnpJbmRleCA9PT0gXCJudW1iZXJcIilcclxuICAgICAgICAgICAgdGhpcy5jYW52YXMuY3NzKFwiei1pbmRleFwiLCBhcmdzLnpJbmRleCk7XHJcbiAgICAgICAgJChcImJvZHlcIikuYXBwZW5kKHRoaXMuY2FudmFzKTtcclxuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzWzBdLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgdGhpcy5yZXNpemVDYW52YXMoKTtcclxuICAgIH07XHJcbiAgICBFbWl0dGVyLnByb3RvdHlwZS5yZXNpemVDYW52YXMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXNbMF0ud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgICAgICB0aGlzLmNhbnZhc1swXS5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbiAgICB9O1xyXG4gICAgRW1pdHRlci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMudXBkYXRlKCk7IH0sIHRoaXMudGlja1JhdGUpO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG4gICAgRW1pdHRlci5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfTtcclxuICAgIEVtaXR0ZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy51cGRhdGVMb2NrKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgdGhpcy51cGRhdGVMb2NrID0gdHJ1ZTtcclxuICAgICAgICB2YXIgZHQgPSB0aGlzLnRpY2tSYXRlIC8gMTAwMDtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlU3lzdGVtLnVwZGF0ZShkdCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLnBhcnRpY2xlU3lzdGVtLmFsaXZlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgICAgICAkKHRoaXMuY2FudmFzKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9uRW1pdHRlckRlYXRoID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uRW1pdHRlckRlYXRoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudXBkYXRlTG9jayA9IGZhbHNlO1xyXG4gICAgfTtcclxuICAgIEVtaXR0ZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIGlmICghdGhpcy5wYXJ0aWNsZVN5c3RlbS5hbGl2ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmN0eC5jYW52YXMud2lkdGgsIHRoaXMuY3R4LmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLnBhcmVudEVsZW0ub2Zmc2V0KCk7XHJcbiAgICAgICAgdmFyIG9mZnNldFggPSBvZmZzZXQubGVmdCArIHRoaXMucGFyZW50RWxlbS5vdXRlcldpZHRoKCkgLyAyO1xyXG4gICAgICAgIHZhciBvZmZzZXRZID0gb2Zmc2V0LnRvcCArIHRoaXMucGFyZW50RWxlbS5vdXRlckhlaWdodCgpIC8gMjtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlU3lzdGVtLnJlbmRlcih0aGlzLmN0eCwgb2Zmc2V0WCwgb2Zmc2V0WSk7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLnJlbmRlcigpOyB9KTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gRW1pdHRlcjtcclxufSkoKTtcclxuZXhwb3J0cy5FbWl0dGVyID0gRW1pdHRlcjtcclxuIiwidmFyIFZlY3RvcjJfMSA9IHJlcXVpcmUoXCIuL1ZlY3RvcjJcIik7XHJcbnZhciBQYXJ0aWNsZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBQYXJ0aWNsZShhcmdzKSB7XHJcbiAgICAgICAgdGhpcy5hY2NlbGVyYXRpb25GaWVsZCA9IGFyZ3MuYWNjZWxlcmF0aW9uRmllbGQ7XHJcbiAgICAgICAgdGhpcy5lbGVtRmFjdG9yeSA9IGFyZ3MuZWxlbUZhY3Rvcnk7XHJcbiAgICAgICAgdGhpcy50aWNrUmF0ZSA9IGFyZ3MudGlja1JhdGUgfHwgMTY7XHJcbiAgICAgICAgdGhpcy5zcHJpdGUgPSBhcmdzLnNwcml0ZTtcclxuICAgICAgICB0aGlzLnNjYWxlID0gYXJncy5zY2FsZSB8fCAxO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gPSBhcmdzLnJvdGF0aW9uIHx8IDA7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvblZlbG9jaXR5ID0gYXJncy5yb3RhdGlvblZlbG9jaXR5IHx8IDA7XHJcbiAgICAgICAgdGhpcy5zZXR1cE9wYWNpdHkoYXJncy5vcGFjaXR5KTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gYXJncy5wb3NpdGlvbiA/IGFyZ3MucG9zaXRpb24uY2xvbmUoKSA6IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigpO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBhcmdzLnZlbG9jaXR5ID8gYXJncy52ZWxvY2l0eS5jbG9uZSgpIDogbmV3IFZlY3RvcjJfMS5WZWN0b3IyKCk7XHJcbiAgICAgICAgdGhpcy5hY2NlbGVyYXRpb24gPSBhcmdzLmFjY2VsZXJhdGlvbiA/IGFyZ3MuYWNjZWxlcmF0aW9uLmNsb25lKCkgOiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoKTtcclxuICAgICAgICB0aGlzLmhpZ2hlck9yZGVyID0gW107XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXJncy5oaWdoZXJPcmRlcikpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmhpZ2hlck9yZGVyLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZ2hlck9yZGVyLnB1c2goYXJncy5oaWdoZXJPcmRlcltpXSA/IGFyZ3MuaGlnaGVyT3JkZXJbaV0uY2xvbmUoKSA6IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1heExpZmUgPSB0eXBlb2YgYXJncy5tYXhMaWZlID09IFwibnVtYmVyXCIgPyBhcmdzLm1heExpZmUgOiAxO1xyXG4gICAgICAgIHRoaXMubGlmZSA9IDA7XHJcbiAgICAgICAgdGhpcy5hbGl2ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5lbGVtID0gbnVsbDtcclxuICAgIH1cclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZHQpIHtcclxuICAgICAgICB0aGlzLmxpZmUgKz0gZHQ7XHJcbiAgICAgICAgaWYgKHRoaXMubWF4TGlmZSA8PSB0aGlzLmxpZmUpIHtcclxuICAgICAgICAgICAgdGhpcy5hbGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmVsZW0gJiYgdGhpcy5lbGVtLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmVsZW0gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5hY2NlbGVyYXRpb25GaWVsZCkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUJ5RmllbGQoZHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVCeVRheWxvcihkdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucm90YXRpb24gKz0gdGhpcy5yb3RhdGlvblZlbG9jaXR5O1xyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS51cGRhdGVFbGVtZW50ID0gZnVuY3Rpb24gKG9mZnNldFgsIG9mZnNldFkpIHtcclxuICAgICAgICBpZiAoIXRoaXMuYWxpdmUgfHwgIXRoaXMuZWxlbSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuZWxlbVxyXG4gICAgICAgICAgICAuY3NzKFwibGVmdFwiLCB0aGlzLnBvc2l0aW9uLnggKyBvZmZzZXRYICsgXCJweFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwidG9wXCIsIHRoaXMucG9zaXRpb24ueSArIG9mZnNldFkgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJvcGFjaXR5XCIsIHRoaXMuY3VycmVudE9wYWNpdHkoKSk7XHJcbiAgICAgICAgdGhpcy5lbGVtLmNzcyhcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZSgtNTAlLCAtNTAlKSByb3RhdGUoXCIgKyBNYXRoLmZsb29yKHRoaXMucm90YXRpb24pICsgXCJkZWcpIHNjYWxlKFwiICsgdGhpcy5zY2FsZSArIFwiKVwiKTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUudXBkYXRlQnlGaWVsZCA9IGZ1bmN0aW9uIChkdCkge1xyXG4gICAgICAgIHZhciBhY2NlbCA9IHRoaXMuYWNjZWxlcmF0aW9uRmllbGQodGhpcy5wb3NpdGlvbik7XHJcbiAgICAgICAgdGhpcy52ZWxvY2l0eS5hZGQoYWNjZWwuc2FtcGxlKCkpO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24uYWRkKHRoaXMudmVsb2NpdHkpO1xyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS51cGRhdGVCeVRheWxvciA9IGZ1bmN0aW9uIChkdCkge1xyXG4gICAgICAgIHZhciBkZWwgPSBudWxsO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSB0aGlzLmhpZ2hlck9yZGVyLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XHJcbiAgICAgICAgICAgIGlmIChkZWwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlnaGVyT3JkZXJbaV0uYWRkKGRlbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGVsID0gdGhpcy5oaWdoZXJPcmRlcltpXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRlbCkge1xyXG4gICAgICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbi5hZGQoZGVsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy52ZWxvY2l0eS5hZGQodGhpcy5hY2NlbGVyYXRpb24pO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24uYWRkKHRoaXMudmVsb2NpdHkpO1xyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jdXJyZW50TGlmZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5saWZlIC8gdGhpcy5tYXhMaWZlO1xyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5zZXR1cE9wYWNpdHkgPSBmdW5jdGlvbiAob3BhY2l0eSkge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb3BhY2l0eSA9PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3BhY2l0eU51bWJlciA9IG9wYWNpdHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkob3BhY2l0eSkpIHtcclxuICAgICAgICAgICAgb3BhY2l0eS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiBhLmxpZmUgLSBiLmxpZmU7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLm9wYWNpdHlBcnJheSA9IG9wYWNpdHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBvcGFjaXR5ID09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICB0aGlzLm9wYWNpdHlGdW5jdGlvbiA9IG9wYWNpdHk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm9wYWNpdHlOdW1iZXIgPSAxO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3VycmVudE9wYWNpdHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5vcGFjaXR5QXJyYXkpKSB7XHJcbiAgICAgICAgICAgIHZhciBsaWZlID0gdGhpcy5jdXJyZW50TGlmZSgpO1xyXG4gICAgICAgICAgICB2YXIgcHJldiA9IG51bGwsIG5leHQgPSBudWxsO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMub3BhY2l0eUFycmF5Lmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb3AgPSB0aGlzLm9wYWNpdHlBcnJheVtpXTtcclxuICAgICAgICAgICAgICAgIGlmIChvcC5saWZlIDw9IGxpZmUpXHJcbiAgICAgICAgICAgICAgICAgICAgcHJldiA9IG9wO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIW5leHQpXHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dCA9IG9wO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcmV2ICYmIG5leHQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBkTGlmZSA9IG5leHQubGlmZSAtIHByZXYubGlmZTtcclxuICAgICAgICAgICAgICAgIHZhciBkT3BhY2l0eSA9IG5leHQudmFsdWUgLSBwcmV2LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIGFtb3VudEludG8gPSBsaWZlIC0gcHJldi5saWZlO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBlcmNlbnRBY3Jvc3MgPSBhbW91bnRJbnRvIC8gZExpZmU7XHJcbiAgICAgICAgICAgICAgICB2YXIgb3BhY2l0eU9mZnNldCA9IHBlcmNlbnRBY3Jvc3MgKiBkT3BhY2l0eTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvcGFjaXR5T2Zmc2V0ICsgcHJldi52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChwcmV2KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJldi52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChuZXh0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV4dC52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiB0aGlzLm9wYWNpdHlGdW5jdGlvbiA9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgdmFyIGxpZmUgPSB0aGlzLmN1cnJlbnRMaWZlKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wYWNpdHlGdW5jdGlvbihsaWZlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHRoaXMub3BhY2l0eU51bWJlciA9PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9wYWNpdHlOdW1iZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGUucHJvdG90eXBlLm5ld0VsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbUZhY3RvcnkpIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtID0gdGhpcy5lbGVtRmFjdG9yeSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdGVFbGVtZW50KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBlbGVtID0gJChcIjxkaXY+PC9kaXY+XCIpO1xyXG4gICAgICAgIGVsZW0uY3NzKFwicG9zaXRpb25cIiwgXCJhYnNvbHV0ZVwiKTtcclxuICAgICAgICB0aGlzLmR1c3RFbGVtZW50KGVsZW0pO1xyXG4gICAgICAgIHRoaXMuYmxlbmRNb2RlRWxlbWVudChlbGVtKTtcclxuICAgICAgICB0aGlzLmVsZW0gPSBlbGVtO1xyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jaXJjbGVFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgICB2YXIgcmFkaXVzID0gMi41O1xyXG4gICAgICAgIGVsZW1cclxuICAgICAgICAgICAgLmNzcyhcIndpZHRoXCIsICgyICogcmFkaXVzKSArIFwicHhcIilcclxuICAgICAgICAgICAgLmNzcyhcImhlaWdodFwiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJib3JkZXItcmFkaXVzXCIsICgyICogcmFkaXVzKSArIFwicHhcIilcclxuICAgICAgICAgICAgLmNzcyhcImJhY2tncm91bmRcIiwgXCJyZWRcIik7XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGUucHJvdG90eXBlLmR1c3RFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW0pIHtcclxuICAgICAgICB2YXIgY29sb3IgPSB7IHI6IDAsIGc6IDAsIGI6IDAgfTtcclxuICAgICAgICB2YXIgY2NvbG9yID0gXCJyZ2JhKDAsIDAsIDAsIDEpXCI7XHJcbiAgICAgICAgdmFyIHJhZGl1cyA9IDMuNTtcclxuICAgICAgICBlbGVtXHJcbiAgICAgICAgICAgIC5jc3MoXCJ3aWR0aFwiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJoZWlnaHRcIiwgKDIgKiByYWRpdXMpICsgXCJweFwiKVxyXG4gICAgICAgICAgICAuY3NzKFwiYm9yZGVyLXJhZGl1c1wiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJiYWNrZ3JvdW5kXCIsIFwicmVkXCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJiYWNrZ3JvdW5kXCIsIFwicmFkaWFsLWdyYWRpZW50KGVsbGlwc2UgYXQgY2VudGVyLCBcIiArIGNjb2xvciArIFwiIDAlLHJnYmEoMCwwLDAsMCkgNzAlKVwiKTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuZmlyZUVsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbSkge1xyXG4gICAgICAgIHZhciByYWRpdXMgPSA5O1xyXG4gICAgICAgIGVsZW1cclxuICAgICAgICAgICAgLmNzcyhcIndpZHRoXCIsICgyICogcmFkaXVzKSArIFwicHhcIilcclxuICAgICAgICAgICAgLmNzcyhcImhlaWdodFwiLCAoMiAqIHJhZGl1cykgKyBcInB4XCIpXHJcbiAgICAgICAgICAgIC5jc3MoXCJib3JkZXItcmFkaXVzXCIsICgyICogcmFkaXVzKSArIFwicHhcIilcclxuICAgICAgICAgICAgLmNzcyhcImJhY2tncm91bmRcIiwgXCJyZWRcIilcclxuICAgICAgICAgICAgLmNzcyhcImJhY2tncm91bmRcIiwgXCJyYWRpYWwtZ3JhZGllbnQoZWxsaXBzZSBhdCBjZW50ZXIsIHJnYmEoMjQ5LDI0OSw0OSwxKSAwJSxyZ2JhKDI1Miw0Nyw0NywwLjYyKSAzMSUscmdiYSgyNDQsNTcsNTEsMCkgNzAlKVwiKTtcclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuYmxlbmRNb2RlRWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtKSB7XHJcbiAgICAgICAgZWxlbVxyXG4gICAgICAgICAgICAuY3NzKFwiYmFja2dyb3VuZC1ibGVuZC1tb2RlXCIsIFwibXVsdGlwbHlcIik7XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGUucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChjdHgsIG9mZnNldFgsIG9mZnNldFkpIHtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC50cmFuc2xhdGUodGhpcy5wb3NpdGlvbi54ICsgb2Zmc2V0WCwgdGhpcy5wb3NpdGlvbi55ICsgb2Zmc2V0WSk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gdGhpcy5zcHJpdGUud2lkdGggfHwgMTtcclxuICAgICAgICB2YXIgaGVpZ2h0ID0gdGhpcy5zcHJpdGUuaGVpZ2h0IHx8IDE7XHJcbiAgICAgICAgY3R4LnRyYW5zbGF0ZSh0aGlzLnNjYWxlICogd2lkdGggLyAyLCB0aGlzLnNjYWxlICogaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgY3R4LnJvdGF0ZSh0aGlzLnJvdGF0aW9uKTtcclxuICAgICAgICBjdHguZ2xvYmFsQWxwaGEgPSB0aGlzLmN1cnJlbnRPcGFjaXR5KCk7XHJcbiAgICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLnNwcml0ZSwgLXRoaXMuc2NhbGUgKiB3aWR0aCAvIDIsIC10aGlzLnNjYWxlICogaGVpZ2h0IC8gMiwgdGhpcy5zY2FsZSAqIHdpZHRoLCB0aGlzLnNjYWxlICogaGVpZ2h0KTtcclxuICAgICAgICBjdHguZ2xvYmFsQWxwaGEgPSAxO1xyXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIFBhcnRpY2xlO1xyXG59KSgpO1xyXG5leHBvcnRzLlBhcnRpY2xlID0gUGFydGljbGU7XHJcbiIsInZhciBwYXJ0aWNsZV8xID0gcmVxdWlyZShcIi4vcGFydGljbGVcIik7XHJcbnZhciBTcHJlYWRfMSA9IHJlcXVpcmUoXCIuL1NwcmVhZFwiKTtcclxudmFyIFBhcnRpY2xlU3lzdGVtID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFBhcnRpY2xlU3lzdGVtKGFyZ3MpIHtcclxuICAgICAgICB0aGlzLmxpZmUgPSAwO1xyXG4gICAgICAgIHRoaXMubGFzdFBhcnRpY2xlQWRkZWQgPSAwO1xyXG4gICAgICAgIHRoaXMuZHlpbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmFsaXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IGFyZ3M7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMgPSBbXTtcclxuICAgICAgICB0aGlzLm1heExpZmUgPSBhcmdzLm1heExpZmUgPyBuZXcgU3ByZWFkXzEuU2NhbGFyU3ByZWFkKGFyZ3MubWF4TGlmZSkgOiBuZXcgU3ByZWFkXzEuU2NhbGFyU3ByZWFkKDUpO1xyXG4gICAgICAgIHRoaXMubWF4UGFydGljbGVzID0gYXJncy5tYXhQYXJ0aWNsZXMgfHwgMTAwO1xyXG4gICAgICAgIHRoaXMuZW1pdFJhdGUgPSBhcmdzLmVtaXRSYXRlIHx8IDAuMTtcclxuICAgICAgICB0aGlzLmVtaXR0ZXJNYXhMaWZlID0gYXJncy5lbWl0dGVyTWF4TGlmZSA/IGFyZ3MuZW1pdHRlck1heExpZmUgOiBudWxsO1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gYXJncy5jYW52YXM7XHJcbiAgICAgICAgdGhpcy5jdHggPSBhcmdzLmN0eDtcclxuICAgICAgICB0aGlzLnRpY2tSYXRlID0gYXJncy50aWNrUmF0ZSB8fCAxNjtcclxuICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbkZpZWxkID0gYXJncy5hY2NlbGVyYXRpb25GaWVsZDtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlRWxlbUZhY3RvcnkgPSBhcmdzLnBhcnRpY2xlRWxlbUZhY3Rvcnk7XHJcbiAgICAgICAgdGhpcy5zcHJpdGUgPSBhcmdzLnNwcml0ZTtcclxuICAgICAgICB0aGlzLnNjYWxlID0gbmV3IFNwcmVhZF8xLlNjYWxhclNwcmVhZChhcmdzLnNjYWxlKTtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uID0gbmV3IFNwcmVhZF8xLlNjYWxhclNwcmVhZChhcmdzLnJvdGF0aW9uKTtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uVmVsb2NpdHkgPSBuZXcgU3ByZWFkXzEuU2NhbGFyU3ByZWFkKGFyZ3Mucm90YXRpb25WZWxvY2l0eSk7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBhcmdzLm9wYWNpdHkgPT09IFwibnVtYmVyXCIgfHwgU3ByZWFkXzEuU2NhbGFyU3ByZWFkLmlzQXJnKGFyZ3Mub3BhY2l0eSkpIHtcclxuICAgICAgICAgICAgdGhpcy5vcGFjaXR5ID0gbmV3IFNwcmVhZF8xLlNjYWxhclNwcmVhZChhcmdzLm9wYWNpdHkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vcGFjaXR5ID0gYXJncy5vcGFjaXR5O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFNwcmVhZF8xLlZlY3RvclNwcmVhZChhcmdzLnBvc2l0aW9uKTtcclxuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gbmV3IFNwcmVhZF8xLlZlY3RvclNwcmVhZChhcmdzLnZlbG9jaXR5KTtcclxuICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbiA9IG5ldyBTcHJlYWRfMS5WZWN0b3JTcHJlYWQoYXJncy5hY2NlbGVyYXRpb24pO1xyXG4gICAgICAgIHRoaXMuaGlnaGVyT3JkZXIgPSBbXTtcclxuICAgICAgICBpZiAoYXJncy5ncmF2aXR5KVxyXG4gICAgICAgICAgICB0aGlzLmFjY2VsZXJhdGlvbi52YWx1ZS5hZGQoYXJncy5ncmF2aXR5KTtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShhcmdzLmhpZ2hlck9yZGVyKSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MuaGlnaGVyT3JkZXIubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlnaGVyT3JkZXIucHVzaChuZXcgU3ByZWFkXzEuVmVjdG9yU3ByZWFkKGFyZ3MuaGlnaGVyT3JkZXJbaV0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFBhcnRpY2xlU3lzdGVtLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZHQpIHtcclxuICAgICAgICB0aGlzLmxpZmUgKz0gZHQ7XHJcbiAgICAgICAgaWYgKCF0aGlzLmFsaXZlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYgKHRoaXMuZHlpbmcgJiYgdGhpcy5wYXJ0aWNsZXMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5hbGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5lbWl0dGVyTWF4TGlmZSA9PT0gXCJudW1iZXJcIiAmJiB0aGlzLmVtaXR0ZXJNYXhMaWZlID4gMCAmJiB0aGlzLmxpZmUgPj0gdGhpcy5lbWl0dGVyTWF4TGlmZSkge1xyXG4gICAgICAgICAgICB0aGlzLmR5aW5nID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG5ld1BhcnRpY2xlcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wYXJ0aWNsZXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgdmFyIHAgPSB0aGlzLnBhcnRpY2xlc1tpXTtcclxuICAgICAgICAgICAgcC51cGRhdGUoZHQpO1xyXG4gICAgICAgICAgICBpZiAoIXAuYWxpdmUpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgbmV3UGFydGljbGVzLnB1c2gocCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBuZXdQYXJ0aWNsZXNQZXJUaWNrID0gdGhpcy5lbWl0UmF0ZTtcclxuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IChuZXdQYXJ0aWNsZXNQZXJUaWNrIC0gTWF0aC5mbG9vcihuZXdQYXJ0aWNsZXNQZXJUaWNrKSkpIHtcclxuICAgICAgICAgICAgbmV3UGFydGljbGVzUGVyVGljayA9IE1hdGguZmxvb3IobmV3UGFydGljbGVzUGVyVGljaykgKyAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbmV3UGFydGljbGVzUGVyVGljayA9IE1hdGguZmxvb3IobmV3UGFydGljbGVzUGVyVGljayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5keWluZyAmJiBuZXdQYXJ0aWNsZXMubGVuZ3RoIDwgdGhpcy5tYXhQYXJ0aWNsZXMpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuZXdQYXJ0aWNsZXNQZXJUaWNrOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIG5ld1BhcnRpY2xlcy5wdXNoKHRoaXMuY3JlYXRlUGFydGljbGUoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMgPSBuZXdQYXJ0aWNsZXM7XHJcbiAgICB9O1xyXG4gICAgUGFydGljbGVTeXN0ZW0ucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIChjdHgsIG9mZnNldFgsIG9mZnNldFkpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGFydGljbGVzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIHZhciBwID0gdGhpcy5wYXJ0aWNsZXNbaV07XHJcbiAgICAgICAgICAgIHAucmVuZGVyKGN0eCwgb2Zmc2V0WCwgb2Zmc2V0WSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIFBhcnRpY2xlU3lzdGVtLnByb3RvdHlwZS5zYW1wbGVTcHJpdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnNwcml0ZSA9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ByaXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5zcHJpdGUpKSB7XHJcbiAgICAgICAgICAgIHZhciBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5zcHJpdGUubGVuZ3RoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ByaXRlW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3ByaXRlO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBQYXJ0aWNsZVN5c3RlbS5wcm90b3R5cGUuY3JlYXRlUGFydGljbGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBwYXJ0aWNsZV8xLlBhcnRpY2xlKHtcclxuICAgICAgICAgICAgbWF4TGlmZTogdGhpcy5tYXhMaWZlLnNhbXBsZSgpLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogdGhpcy5wb3NpdGlvbi5zYW1wbGUoKSxcclxuICAgICAgICAgICAgdmVsb2NpdHk6IHRoaXMudmVsb2NpdHkgJiYgdGhpcy52ZWxvY2l0eS5zYW1wbGUoKSxcclxuICAgICAgICAgICAgYWNjZWxlcmF0aW9uOiB0aGlzLmFjY2VsZXJhdGlvbiAmJiB0aGlzLmFjY2VsZXJhdGlvbi5zYW1wbGUoKSxcclxuICAgICAgICAgICAgaGlnaGVyT3JkZXI6IHRoaXMuaGlnaGVyT3JkZXIgJiYgdGhpcy5oaWdoZXJPcmRlci5tYXAoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHguc2FtcGxlKCk7IH0pLFxyXG4gICAgICAgICAgICBhY2NlbGVyYXRpb25GaWVsZDogdGhpcy5hY2NlbGVyYXRpb25GaWVsZCxcclxuICAgICAgICAgICAgZWxlbUZhY3Rvcnk6IHRoaXMucGFydGljbGVFbGVtRmFjdG9yeSxcclxuICAgICAgICAgICAgc3ByaXRlOiB0aGlzLnNhbXBsZVNwcml0ZSgpLFxyXG4gICAgICAgICAgICBzY2FsZTogdGhpcy5zY2FsZS5zYW1wbGUoKSxcclxuICAgICAgICAgICAgcm90YXRpb246IHRoaXMucm90YXRpb24uc2FtcGxlKCksXHJcbiAgICAgICAgICAgIHJvdGF0aW9uVmVsb2NpdHk6IHRoaXMucm90YXRpb25WZWxvY2l0eS5zYW1wbGUoKSxcclxuICAgICAgICAgICAgb3BhY2l0eTogKHRoaXMub3BhY2l0eSBpbnN0YW5jZW9mIFNwcmVhZF8xLlNjYWxhclNwcmVhZCkgP1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vcGFjaXR5LnNhbXBsZSgpIDpcclxuICAgICAgICAgICAgICAgIHRoaXMub3BhY2l0eSxcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gUGFydGljbGVTeXN0ZW07XHJcbn0pKCk7XHJcbmV4cG9ydHMuUGFydGljbGVTeXN0ZW0gPSBQYXJ0aWNsZVN5c3RlbTtcclxuIiwidmFyIFNwcmVhZF8xID0gcmVxdWlyZShcIi4vU3ByZWFkXCIpO1xyXG5leHBvcnRzLlZlY3RvclNwcmVhZCA9IFNwcmVhZF8xLlZlY3RvclNwcmVhZDtcclxuZXhwb3J0cy5TY2FsYXJTcHJlYWQgPSBTcHJlYWRfMS5TY2FsYXJTcHJlYWQ7XHJcbmV4cG9ydHMuU3ByZWFkVHlwZSA9IFNwcmVhZF8xLlNwcmVhZFR5cGU7XHJcbnZhciBWZWN0b3IyXzEgPSByZXF1aXJlKFwiLi9WZWN0b3IyXCIpO1xyXG5leHBvcnRzLlZlY3RvcjIgPSBWZWN0b3IyXzEuVmVjdG9yMjtcclxudmFyIGVtaXR0ZXJfMSA9IHJlcXVpcmUoXCIuL2VtaXR0ZXJcIik7XHJcbmV4cG9ydHMuRW1pdHRlciA9IGVtaXR0ZXJfMS5FbWl0dGVyO1xyXG52YXIgZW1pdHRlcl8yID0gcmVxdWlyZShcIi4vZW1pdHRlclwiKTtcclxudmFyIFZlY3RvcjJfMiA9IHJlcXVpcmUoXCIuL1ZlY3RvcjJcIik7XHJcbnZhciBzcHJpdGVzID0ge307XHJcbnNwcml0ZXNbXCJyZWRkb3RcIl0gPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHNwcml0ZSA9ICQoXCI8Y2FudmFzPjwvY2FudmFzPlwiKVswXTtcclxuICAgIHNwcml0ZS53aWR0aCA9IDEyO1xyXG4gICAgc3ByaXRlLmhlaWdodCA9IDEyO1xyXG4gICAgdmFyIGN0eCA9IHNwcml0ZS5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4LmFyYyg2LCA2LCA2LCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9ICdyZWQnO1xyXG4gICAgY3R4LmZpbGwoKTtcclxuICAgIHJldHVybiBzcHJpdGU7XHJcbn0pKCk7XHJcbnNwcml0ZXNbXCJkb3RcIl0gPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHNwcml0ZSA9ICQoXCI8Y2FudmFzPjwvY2FudmFzPlwiKVswXTtcclxuICAgIHNwcml0ZS53aWR0aCA9IDEyO1xyXG4gICAgc3ByaXRlLmhlaWdodCA9IDEyO1xyXG4gICAgdmFyIGN0eCA9IHNwcml0ZS5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4LmFyYyg2LCA2LCA2LCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XHJcbiAgICBjdHguZmlsbCgpO1xyXG4gICAgcmV0dXJuIHNwcml0ZTtcclxufSkoKTtcclxuc3ByaXRlc1tcInJhaW5ib3dkb3RcIl0gPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHNwcml0ZSA9ICQoXCI8Y2FudmFzPjwvY2FudmFzPlwiKVswXTtcclxuICAgIHNwcml0ZS53aWR0aCA9IDEyO1xyXG4gICAgc3ByaXRlLmhlaWdodCA9IDEyO1xyXG4gICAgdmFyIGN0eCA9IHNwcml0ZS5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4LmFyYyg2LCA2LCA2LCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xyXG4gICAgdmFyIHIgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBNYXRoLmZsb29yKDI1NSAqIE1hdGgucmFuZG9tKCkpOyB9O1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwicmdiKFwiICsgcigpICsgXCIsIFwiICsgcigpICsgXCIsIFwiICsgcigpICsgXCIpXCI7XHJcbiAgICBjdHguZmlsbCgpO1xyXG4gICAgcmV0dXJuIHNwcml0ZTtcclxufSk7XHJcbnNwcml0ZXNbXCJkdXN0XCJdID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzcHJpdGUgPSAkKFwiPGNhbnZhcz48L2NhbnZhcz5cIilbMF07XHJcbiAgICBzcHJpdGUud2lkdGggPSAxMjtcclxuICAgIHNwcml0ZS5oZWlnaHQgPSAxMjtcclxuICAgIHZhciBjdHggPSBzcHJpdGUuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5hcmMoNiwgNiwgNiwgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcclxuICAgIHZhciBncmQgPSBjdHguY3JlYXRlUmFkaWFsR3JhZGllbnQoNiwgNiwgMCwgNiwgNiwgNiAqIDAuNzA3KTtcclxuICAgIGdyZC5hZGRDb2xvclN0b3AoMCwgXCJibGFja1wiKTtcclxuICAgIGdyZC5hZGRDb2xvclN0b3AoMSwgXCJyZ2JhKDAsIDAsIDAsIDApXCIpO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IGdyZDtcclxuICAgIGN0eC5maWxsKCk7XHJcbiAgICByZXR1cm4gc3ByaXRlO1xyXG59KSgpO1xyXG5zcHJpdGVzW1wicmFpbmJvd2R1c3RcIl0gPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHNwcml0ZSA9ICQoXCI8Y2FudmFzPjwvY2FudmFzPlwiKVswXTtcclxuICAgIHNwcml0ZS53aWR0aCA9IDEyO1xyXG4gICAgc3ByaXRlLmhlaWdodCA9IDEyO1xyXG4gICAgdmFyIGN0eCA9IHNwcml0ZS5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4LmFyYyg2LCA2LCA2LCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xyXG4gICAgdmFyIGdyZCA9IGN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCg2LCA2LCAxLCA2LCA2LCA2ICogMC43MDcpO1xyXG4gICAgdmFyIHIgPSBNYXRoLmZsb29yKDI1NSAqIE1hdGgucmFuZG9tKCkpO1xyXG4gICAgdmFyIGcgPSBNYXRoLmZsb29yKDI1NSAqIE1hdGgucmFuZG9tKCkpO1xyXG4gICAgdmFyIGIgPSBNYXRoLmZsb29yKDI1NSAqIE1hdGgucmFuZG9tKCkpO1xyXG4gICAgZ3JkLmFkZENvbG9yU3RvcCgwLCBcInJnYmEoXCIgKyByICsgXCIsIFwiICsgZyArIFwiLCBcIiArIGIgKyBcIiwgMSlcIik7XHJcbiAgICBncmQuYWRkQ29sb3JTdG9wKDEsIFwicmdiYShcIiArIHIgKyBcIiwgXCIgKyBnICsgXCIsIFwiICsgYiArIFwiLCAwKVwiKTtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBncmQ7XHJcbiAgICBjdHguZmlsbCgpO1xyXG4gICAgcmV0dXJuIHNwcml0ZTtcclxufSk7XHJcbmZ1bmN0aW9uIHNwcml0ZShvcHQpIHtcclxuICAgIGlmICghb3B0KSB7XHJcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhzcHJpdGVzKTtcclxuICAgICAgICBvcHQgPSBrZXlzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGtleXMubGVuZ3RoKV07XHJcbiAgICAgICAgcmV0dXJuIHNwcml0ZXNbb3B0XTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHNwcml0ZXNbb3B0XSkge1xyXG4gICAgICAgIHJldHVybiBzcHJpdGVzW29wdF07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLnNwcml0ZSA9IHNwcml0ZTtcclxuZnVuY3Rpb24gc3BhcmtsZSgkZWxlbSkge1xyXG4gICAgbmV3IGVtaXR0ZXJfMi5FbWl0dGVyKHtcclxuICAgICAgICBhdHRhY2g6ICRlbGVtLFxyXG4gICAgICAgIGF0dGFjaFRvOiBcImNlbnRlclwiLFxyXG4gICAgICAgIG1heFBhcnRpY2xlczogMTAwLFxyXG4gICAgICAgIGVtaXRSYXRlOiAxLFxyXG4gICAgICAgIHNwcml0ZTogc3ByaXRlKFwicmFpbmJvd2RvdFwiKSxcclxuICAgICAgICBtYXhMaWZlOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiAxLFxyXG4gICAgICAgICAgICBzcHJlYWQ6IDAuNVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdmVsb2NpdHk6IHtcclxuICAgICAgICAgICAgdmFsdWU6IG5ldyBWZWN0b3IyXzIuVmVjdG9yMigwLCAtNSksXHJcbiAgICAgICAgICAgIHNwcmVhZDogbmV3IFZlY3RvcjJfMi5WZWN0b3IyKDcsIDIpXHJcbiAgICAgICAgfSxcclxuICAgICAgICBncmF2aXR5OiBuZXcgVmVjdG9yMl8yLlZlY3RvcjIoMCwgMC4yKVxyXG4gICAgfSkuc3RhcnQoKTtcclxufVxyXG5leHBvcnRzLnNwYXJrbGUgPSBzcGFya2xlO1xyXG4iXX0=
