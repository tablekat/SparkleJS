
/*
Emitter options: ((((((((( OLD !!!!!!!! )))))))))

{
  particleCount: integer,       // required
  maxLife: number (seconds),
  position: {
    value: Vector2,
    spread: Vector2
  } || Vector2,
  velocity: {
    value: Vector2,
    spread: Vector2
  } || Vector2,
  acceleration: {
    value: Vector2,
    spread: Vector2
  } || Vector2,
  higherOrderDerivatives: [{
    value: Vector2,
    spread: Vector2
  } || Vector2, ...],
  gravity: Vector2,
  color: {r: 255, g: 255, b: 255},
  radius: number,
  boxShadow: "0px 0px 3px rgba(...)",
  image: url,
  elem: parentElement,
  elementFactory: function () -> parentElement,
  scale: number || { value: number, spread: number }
}*/

import {Particle} from "./particle";
import {Vector2} from "./Vector2";
import {VectorSpread, VectorSpreadArg, ScalarSpreadArg, ScalarSpread} from "./Spread";
import {ParticleSystem, ParticleSystemArgs} from "./particleSystem";

export interface EmitterArgs extends ParticleSystemArgs{
  tickRate?: number;
  onEmitterDeath?: () => any;
  zIndex?: number;
}

export class Emitter{

  particleSystem: ParticleSystem;
  parentElem: any;
  canvas: any;
  ctx: any;
  tickRate: number;
  private interval: any;
  onEmitterDeath: () => any;
  zIndex: number|string;
  private updateLock = false;

  constructor(parentElem: any, args: EmitterArgs){
    this.makeElement(args);

    args.canvas = this.canvas;
    args.tickRate = args.tickRate || 16;

    this.particleSystem = new ParticleSystem(args);
    this.parentElem = parentElem;
    this.tickRate = args.tickRate || 16;
    this.onEmitterDeath = args.onEmitterDeath;
    this.zIndex = typeof args.zIndex === "number" ? args.zIndex : "auto";
  }

  makeElement(args: EmitterArgs){
    this.canvas = $("<canvas></canvas>")
      .addClass("sparkle-emitter")
      .css({
        "position": "absolute",
        "top": "0px",
        "left": "0px",
        "pointer-events": "none"
      });
    if(typeof args.zIndex === "number") this.canvas.css("z-index", args.zIndex);
    $("body").append(this.canvas);
    this.ctx = this.canvas[0].getContext('2d');
  }

  start(){
    this.interval = setInterval(() => this.update(), this.tickRate);
    this.render();
    return this;
  }

  stop(){
    clearInterval(this.interval);
    return this;
  }

  update(){
    if(this.updateLock) return;
    this.updateLock = true;

    var dt = this.tickRate / 1000; // dt is in seconds

    this.particleSystem.update(dt);

    if(!this.particleSystem.alive){
      this.stop();
      $(this.canvas).remove();
      if(typeof this.onEmitterDeath === "function") this.onEmitterDeath();
    }

    this.updateLock = false;
  }

  render(){
    if(!this.particleSystem.alive) return;

    var offset = this.parentElem.offset();
    var offsetX = offset.left + this.parentElem.outerWidth() / 2;
    var offsetY = offset.top + this.parentElem.outerHeight() / 2;
    this.particleSystem.render(this.ctx, offsetX, offsetY);

    requestAnimationFrame(() => this.render());
  }

}
