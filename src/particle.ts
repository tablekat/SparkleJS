/// <reference path="./jquery.d.ts"/>
import {Vector2} from "./Vector2";
import {ScalarSpread, VectorSpread, ScalarSpreadArg} from "./Spread";

export interface ParticleArgs{
  maxLife?: number;
  emitterElem?: any;

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
  emitterElem: any;
  // TODO: Rotation!!

  constructor(args: ParticleArgs){
    this.emitterElem = args.emitterElem || $("body");
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
      this.elem && this.elem.remove();
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
    for(var i = this.higherOrder.length - 1; i >= 0; --i){
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

  private createElement(){
    var elem = $("<div></div>");
    elem.css("position", "absolute");

    //this.circleElement(elem);
    this.dustElement(elem);
    //this.fireElement(elem);

    this.blendModeElement(elem);

    // TODO: z-index!!
    this.emitterElem.append(elem);

    this.elem = elem;
  }

  private circleElement(elem){
    var radius = 2.5;
    elem
      .css("width", (2 * radius) + "px")
      .css("height", (2 * radius) + "px")
      .css("border-radius", (2 * radius) + "px")
      .css("background", "red")
  }

  private dustElement(elem){
    var color = { r: 0, g: 0, b: 0 };
    var ccolor = "rgba(0, 0, 0, 1)";
    var radius = 3.5;
    elem
      .css("width", (2 * radius) + "px")
      .css("height", (2 * radius) + "px")
      .css("border-radius", (2 * radius) + "px")
      .css("background", "red")
      .css("background", "radial-gradient(ellipse at center, " + ccolor + " 0%,rgba(0,0,0,0) 70%)");
  }
  private fireElement(elem){
    var radius = 9; //5;
    elem
      .css("width", (2 * radius) + "px")
      .css("height", (2 * radius) + "px")
      .css("border-radius", (2 * radius) + "px")
      .css("background", "red")
      // Note! The gradient is inside of a circle in a square. the gradient at "100%" is at the corner of the square, which is way outside the circle! 70.7%
      /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#f9f931+0,fc2f2f+31,f43933+70&1+0,0.62+31,0+70 */
      .css("background", "radial-gradient(ellipse at center, rgba(249,249,49,1) 0%,rgba(252,47,47,0.62) 31%,rgba(244,57,51,0) 70%)");
  }

  private blendModeElement(elem){
    // https://css-tricks.com/basics-css-blend-modes/
    elem
      .css("background-blend-mode", "multiply");
      //.css("background-blend-mode", "screen");
      //.css("background-blend-mode", "lighten"); // better...
      //.css("background-blend-mode", "exclusion");
  }

}
