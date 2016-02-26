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
