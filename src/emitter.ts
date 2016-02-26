
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
  elem: domElement,
  elementFactory: function () -> domElement,
  scale: number || { value: number, spread: number }
}*/

import {Particle} from "./particle";
import {Vector2} from "./Vector2";
import {VectorSpread, VectorSpreadArg, ScalarSpreadArg, ScalarSpread} from "./Spread";
import {ParticleSystem, ParticleSystemArgs} from "./particleSystem";

export interface EmitterArgs extends ParticleSystemArgs{
  rate?: number;
  onEmitterDeath?: () => any;
}

export class Emitter{

  particleSystem: ParticleSystem;
  domElem: any;
  rate: number;
  private interval: any;
  onEmitterDeath: () => any;

  constructor(domElem: any, args: EmitterArgs){
    this.particleSystem = new ParticleSystem(args);
    this.domElem = domElem;
    this.rate = args.rate || 16;
    this.onEmitterDeath = args.onEmitterDeath;
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
    var dt = this.rate / 1000; // dt is in seconds
    var offset = this.domElem.offset();
    this.particleSystem.update(dt, offset.left, offset.top);
    if(!this.particleSystem.alive){
      this.stop();
      if(typeof this.onEmitterDeath === "function") this.onEmitterDeath();
    }
  }

}

/*Emitter.prototype.elementFactory = function(){
  /*if(this.customElementFactory && typeof(this.customElementFactory) === "function"){
    this.customElementFactory = elementFactory;
  }else if(this.elem && typeof(this.elem) === "object"){
    this.elem = elem;
  }else{

    var elem = document.createElementById("div");
    elem.style.position = "absolute";
    elem.style.left = this.position.x;
    elem.style.top = this.position.y;

    if(typeof(color) !== "object") color = {};
    if(typeof(color.r) !== "number") color.r = 255;
    if(typeof(color.g) !== "number") color.g = 255;
    if(typeof(color.b) !== "number") color.b = 255;
    if(typeof(color.a) !== "number") color.a = 1;
    this.color = color;
    elem.style.background = "rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")";

    if(!boxShadow) boxShadow = "none";
    this.boxShadow = boxShadow;
    elem.style.boxShadow = boxShadow;

    if(typeof(radius) !== "number") radius = 10;
    this.radius = radius;
    elem.style.borderRadius = (radius / 2) + "px";
    elem.style.width = radius + "px";
    elem.style.height = radius + "px";

    //document.getElementsByTagName("body")[0].appendChild(elem);
    this.elem = elem;

  }
}*/
