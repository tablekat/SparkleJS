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
