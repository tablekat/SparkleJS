
import {Vector2} from "./Vector2";

export enum SpreadType{
  Uniform, // Ellipse
  Normal,  // Ellipse, Gaussian
  RectUniform // Rectangular
}

export interface VectorSpreadArg{
  value: Vector2;
  spread?: Vector2;
  type?: SpreadType;
}

export class VectorSpread implements VectorSpreadArg{
  value: Vector2;
  spread: Vector2;
  type: SpreadType;

  constructor(value?: Vector2|VectorSpreadArg, spread?: Vector2, spreadType?: SpreadType){
    if(value instanceof Vector2 || !value){
      this.value = <Vector2>value || new Vector2(0, 0);
      this.spread = spread || new Vector2(0, 0);
      this.type = spreadType || SpreadType.Normal;
    }else{
      this.value = (<VectorSpreadArg>value).value || new Vector2(0, 0);
      this.spread = (<VectorSpreadArg>value).spread || new Vector2(0, 0);
      this.type = (<VectorSpreadArg>value).type || SpreadType.Normal;
    }
  }

  sample(){
    if(this.type == SpreadType.RectUniform){
      var randX = (2 * Math.random() - 1) * this.spread.x;
      var randY = (2 * Math.random() - 1) * this.spread.y;
      var randV = new Vector2(randX, randY);
      return randV.add(this.value);
    }else{
      var randR, randTh;
      randTh = Math.PI * 2 * Math.random();
      if(this.type == SpreadType.Uniform){
        randR = Math.random();
      }else{
        randR = ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
      }
      var randV = Vector2.fromPolar(randR, randTh);
      return randV.hadamard(this.spread).add(this.value);
    }
  }

  add(spr: VectorSpread){
    this.value.add(spr.value);
  }

}

export interface ScalarSpreadArg{
  value: number;
  spread?: number;
  type?: SpreadType;
}

export class ScalarSpread implements ScalarSpreadArg{
  value: number;
  spread: number;
  type: SpreadType;

  constructor(value?: number|ScalarSpreadArg, spread?: number, spreadType?: SpreadType){
    if(typeof value == "number" || !value){
      this.value = <number>value || 0;
      this.spread = spread || 0;
      this.type = spreadType || SpreadType.Normal;
    }else{
      this.value = (<ScalarSpreadArg>value).value;
      this.spread = (<ScalarSpreadArg>value).spread;
      this.type = (<ScalarSpreadArg>value).type || SpreadType.Normal;
    }
  }

  sample(): number{
    var randR;
    if(this.type == SpreadType.Uniform){
      randR = Math.random();
    }else{
      randR = ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
    }
    return randR * this.spread + this.value;
  }

  add(spr: number){
    this.value += spr;
  }
}
