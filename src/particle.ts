/// <reference path="./jquery.d.ts"/>
import {Vector2} from "./Vector2";
import {ScalarSpread, VectorSpread, ScalarSpreadArg} from "./Spread";

export interface ParticleArgs{
  maxLife?: number;
  //ctx?: any;
  tickRate?: number;

  position: Vector2;
  velocity?: Vector2;
  acceleration?: Vector2;
  higherOrder?: Vector2[];
  accelerationField?: (Vector2) => VectorSpread;

  elemFactory?: () => any;
  sprite: any;

  scale?: number;
  rotation?: number;
  rotationVelocity?: number;
  opacity?: number | [{ value: number, life: number }] | ((life: number) => number);
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
  //ctx: any;
  tickRate: number;

  elemFactory: () => any; //deprec
  sprite: any;

  scale: number;
  rotation: number;
  rotationVelocity: number;
  opacityNumber: number;
  opacityArray: [{ value: number, life: number }];
  opacityFunction: ((life: number) => number);

  constructor(args: ParticleArgs){
    //this.ctx = args.ctx;
    this.accelerationField = args.accelerationField;
    this.elemFactory = args.elemFactory;
    this.tickRate = args.tickRate || 16;
    this.sprite = args.sprite;

    this.scale = args.scale || 1;
    this.rotation = args.rotation || 0;
    this.rotationVelocity = args.rotationVelocity || 0;
    this.setupOpacity(args.opacity);

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
    this.newElement();
    this.updateElement(-3000, -3000); // off screen
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
    this.rotation += this.rotationVelocity; // * dt... TODO
  }

  updateElement(offsetX: number, offsetY: number){
    if(!this.alive || !this.elem) return;
    // TODO: transform so the center is in the middle?
    this.elem
      .css("left", this.position.x + offsetX + "px")
      .css("top", this.position.y + offsetY + "px")
      .css("opacity", this.currentOpacity());
    this.elem.css("transform", "translate(-50%, -50%) rotate(" + Math.floor(this.rotation) + "deg) scale(" + this.scale + ")");
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

  currentLife(){
    return this.life / this.maxLife;
  }

  private setupOpacity(opacity){
    if(typeof opacity == "number"){
      this.opacityNumber = opacity;
    }else if(Array.isArray(opacity)){
      opacity.sort((a, b) => a.life - b.life);
      this.opacityArray = opacity;
    }else if(typeof opacity == "function"){
      this.opacityFunction = opacity;
    }else{
      this.opacityNumber = 1;
    }
  }

  private currentOpacity(){
    if(Array.isArray(this.opacityArray)){
      var life = this.currentLife();
      var prev = null, next = null;

      for(var i=0; i < this.opacityArray.length; ++i){
        var op = this.opacityArray[i];
        if(op.life <= life) prev = op;
        else if(!next) next = op;
      }
      if(prev && next){
        var dLife = next.life - prev.life;
        var dOpacity = next.value - prev.value;
        var amountInto = life - prev.life;
        var percentAcross = amountInto / dLife;
        var opacityOffset = percentAcross * dOpacity;
        return opacityOffset + prev.value;
      }else if(prev){
        return prev.value;
      }else if(next){
        return next.value;
      }else{
        return 1;
      }

    }else if(typeof this.opacityFunction == "function"){
      var life = this.currentLife();
      return this.opacityFunction(life);
    }else if(typeof this.opacityNumber == "number"){
      return this.opacityNumber;
    }else{
      return 1;
    }
  }

  private newElement(){
    if(this.elemFactory){
      this.elem = this.elemFactory();
    }else{
      this.createElement();
    }
    //this.emitterElem.append(this.elem);
    //this.emitterElem.prepend(this.elem);
  }

  private createElement(){
    var elem = $("<div></div>");
    elem.css("position", "absolute");

    //this.circleElement(elem);
    this.dustElement(elem);
    //this.fireElement(elem);

    this.blendModeElement(elem);

    // TODO: z-index!!

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

  public render(ctx: any, offsetX: number, offsetY: number){
    ctx.save();

    ctx.translate(this.position.x + offsetX, this.position.y + offsetY);

    var width = this.sprite.width || 1;
    var height = this.sprite.height || 1;
    ctx.translate(this.scale * width / 2, this.scale * height / 2);
    ctx.rotate(this.rotation);
    ctx.drawImage(this.sprite, -this.scale * width / 2, -this.scale * height / 2);

    ctx.restore();
  }

}
