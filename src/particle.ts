/// <reference path="./jquery.d.ts"/>
import {Vector2} from "./Vector2";
import {ScalarSpread, VectorSpread, ScalarSpreadArg} from "./Spread";

export interface ParticleArgs{
  maxLife?: number;

  position: Vector2;
  velocity?: Vector2;
  acceleration?: Vector2;
  higherOrder?: Vector2[];
  accelerationField?: (Vector2) => VectorSpread;
  // TODO: element type, circle, sprite, etc!!~!~!!!!
  // TODO: scale (spread chosen in the particle system)
  // TODO: roation (spread chosen in particle system)
}

export class Particle{

  position: Vector2;
  velocity: Vector2;
  acceleration: Vector2;
  higherOrder: Vector2[];
  accelerationField: (Vector2) => VectorSpread;

  maxLife: number;
  life: number;
  alive: boolean;
  elem: any;
  // TODO: Rotation!!

  constructor(args: ParticleArgs){
    this.accelerationField = args.accelerationField;
    this.position = args.position ? args.position.clone() : new Vector2();
    this.velocity = args.velocity ? args.velocity.clone() : new Vector2()
    this.acceleration = args.acceleration ? args.acceleration.clone() : new Vector2()
    this.higherOrder = [];

    if(Array.isArray(args.higherOrder)){
      for(var i = 0; i < args.higherOrder.length; ++i){
        this.higherOrder.push(args.higherOrder[i] ? args.higherOrder[i].clone() : new Vector2());
      }
    }

    this.maxLife = typeof args.maxLife == "number" ? args.maxLife : 1;

    this.life = 0;
    this.alive = true;

    this.elem = null;
    this.createElement();
  }

  update(dt: number){
    this.life += dt;
    if(this.maxLife <= this.life){
      this.alive = false;
      this.elem.remove();
      this.elem = null;
    }

    if(this.accelerationField){
      this.updateByField(dt);
    }else{
      this.updateByTaylor(dt);
    }
  }

  updateElement(offsetX: number, offsetY: number){
    if(!this.alive || !this.elem) return;
    // TODO: transform so the center is in the middle?
    this.elem.css("left", this.position.x + offsetX);
    this.elem.css("top", this.position.y + offsetY);
  }

  updateByField(dt: number){
    var accel = this.accelerationField(this.position);
    this.velocity.add(accel.sample());
    this.position.add(this.velocity);
  }

  updateByTaylor(dt: number){
    var del = null;
    for(var i = this.higherOrder.length - 1; i >= 0; ++i){
      if(del){
        this.higherOrder[i].add(del);
      }
      del = this.higherOrder[i];
    }

    if(del){
      this.acceleration.add(del);
    }

    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
  }

  createElement(){
    var elem = $("<div></div>");
    elem.css("position", "absolute");

    // Circle: // TODO!!! Scale spread for particles!!
    elem
      .css("width", "5px")
      .css("height", "5px")
      .css("border-radius", "5px")
      .css("background", "red")
      // TODO: z-index!!

    $("body").append(elem);

    this.elem = elem;
  }

}
