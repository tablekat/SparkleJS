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
