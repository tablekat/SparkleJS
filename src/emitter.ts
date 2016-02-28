
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
  rate?: number;
  onEmitterDeath?: () => any;
  zIndex?: number;
}

export class Emitter{

  particleSystem: ParticleSystem;
  parentElem: any;
  domElem: any;
  rate: number;
  private interval: any;
  onEmitterDeath: () => any;
  zIndex: number|string;
  private updateLock = false;

  constructor(parentElem: any, args: EmitterArgs){
    this.domElem = $("<div></div>")
      .addClass("sparkle-emitter")
      .css("position", "absolute")
      .css("top", "0px")
      .css("left", "0px");
    if(typeof args.zIndex === "number") this.domElem.css("z-index", args.zIndex);
    $("body").append(this.domElem);

    args.emitterElem = this.domElem;
    args.emitterRate = args.rate || 16;

    this.particleSystem = new ParticleSystem(args);
    this.parentElem = parentElem;
    this.rate = args.rate || 16;
    this.onEmitterDeath = args.onEmitterDeath;
    this.zIndex = typeof args.zIndex === "number" ? args.zIndex : "auto";
  }

  start(){
    this.interval = setInterval(() => this.update(), this.rate);
    return this;
  }

  stop(){
    clearInterval(this.interval);
    return this;
  }

  update(){
    if(this.updateLock) return;
    this.updateLock = true;

    var dt = this.rate / 1000; // dt is in seconds
    var offset = this.parentElem.offset();
    var offsetX = offset.left + this.parentElem.outerWidth() / 2;
    var offsetY = offset.top + this.parentElem.outerHeight() / 2;

    this.particleSystem.update(dt, offsetX, offsetY);

    if(!this.particleSystem.alive){
      this.stop();
      this.domElem.remove();
      if(typeof this.onEmitterDeath === "function") this.onEmitterDeath();
    }

    this.updateLock = false;
  }

}
