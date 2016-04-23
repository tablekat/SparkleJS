
import {Vector2} from "./Vector2";

export enum SpreadType{
  Uniform,     // Ellipse
  Normal,      // Ellipse, Gaussian
  RectUniform  // Rectangular
  // TODO: Disk
  // TODO: Border
}

export interface VectorSpreadArg{
  value?: Vector2;
  spread?: Vector2;
  type?: SpreadType;
  custom?: () => Vector2;
}

export class VectorSpread implements VectorSpreadArg{
  value: Vector2;
  spread: Vector2;
  type: SpreadType;
  custom: () => Vector2;

  constructor(value?: Vector2|VectorSpreadArg, spread?: Vector2, spreadType?: SpreadType){
    if(value instanceof Vector2 || !value){
      this.value = <Vector2>value || new Vector2(0, 0);
      this.spread = spread || new Vector2(0, 0);
      this.type = typeof spreadType == "number" ? spreadType : SpreadType.Normal;
      this.custom = null;
    }else{
      this.value = (<VectorSpreadArg>value).value || new Vector2(0, 0);
      this.spread = (<VectorSpreadArg>value).spread || new Vector2(0, 0);
      this.type = (<VectorSpreadArg>value).type;
      if(typeof this.type != "number") this.type = SpreadType.Normal;
      this.custom = (<VectorSpreadArg>value).custom || null;
    }
  }

  sample(){
    if(this.custom){
      return this.custom();
    }
    if(this.type == SpreadType.RectUniform){
      var randX = (2 * Math.random() - 1) * this.spread.x;
      var randY = (2 * Math.random() - 1) * this.spread.y;
      var randV = new Vector2(randX, randY);
      return randV.add(this.value);
    }else{
      var randR, randTh;
      randTh = Math.PI * 2 * Math.random();
      if(this.type == SpreadType.Uniform){
        randR = 2 * Math.random() - 1;
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
  value?: number;
  spread?: number;
  type?: SpreadType;
  custom?: () => number;
}

export class ScalarSpread implements ScalarSpreadArg{
  value: number;
  spread: number;
  type: SpreadType;
  custom: () => number;

  constructor(value?: number|ScalarSpreadArg, spread?: number, spreadType?: SpreadType){
    if(typeof value == "number" || !value){
      this.value = <number>value || 0;
      this.spread = spread || 0;
      this.type = typeof spreadType == "number" ? spreadType : SpreadType.Normal;
      this.custom = null;
    }else{
      this.value = (<ScalarSpreadArg>value).value;
      this.spread = (<ScalarSpreadArg>value).spread;
      this.type = (<ScalarSpreadArg>value).type || SpreadType.Normal;
      this.custom = (<ScalarSpreadArg>value).custom || null;
    }
  }

  static isArg(obj){
    return obj &&
      (typeof obj.value  == "number" ||
       typeof obj.spread == "number" ||
       typeof obj.custom == "function");
  }

  sample(): number{
    if(this.custom){
      return this.custom();
    }
    var randR;
    if(this.type == SpreadType.Uniform || this.type == SpreadType.RectUniform){
      randR = 2 * Math.random() - 1;
    }else{
      randR = ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
    }
    return randR * this.spread + this.value;
  }

  add(spr: number){
    this.value += spr;
  }
}
