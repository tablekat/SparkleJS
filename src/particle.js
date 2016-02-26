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
