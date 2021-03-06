

export class Vector2{

  x: number;
  y: number;

  constructor(x?: number, y?: number){
    this.x = x || 0;
    this.y = y || 0;
  }

  static fromPolar(r: number, th: number){
    return new Vector2(r * Math.cos(th), r * Math.sin(th));
  }

  copy(v?: Vector2){
    if(v && typeof v.x == "number" && typeof v.y == "number"){
      v.x = this.x;
      v.y = this.y;
      return this;
    }else{
      return this.clone();
    }
  }

  clone(){
    return new Vector2(this.x, this.y);
  }

  toString(){
    return "(" + this.x + "," + this.y + ")";
  }

  add(v: Vector2){
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  plus(v: Vector2): Vector2{
    var v2 = this.clone();
    v2.x += v.x;
    v2.y += v.y;
    return v2;
  }

  subtract(v: Vector2){
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }
  minus(v: Vector2): Vector2{
    var v2 = this.clone();
    v2.x -= v.x;
    v2.y -= v.y;
    return v2;
  }

  mult(x: number|Vector2, y?: number){
    if(x instanceof Vector2){
      this.x *= x.x;
      this.y *= x.y;
    }else{
      this.x *= <number>x;
      this.y *= typeof y === "number" ? y : <number>x;
    }
    return this;
  }

  hadamard(vec: Vector2){
    this.x *= vec.x;
    this.y *= vec.y;
    return this;
  }

  length(){
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  lengthSq(){
    return this.x * this.x + this.y * this.y;
  }

  dot(v: Vector2){
    return this.x * v.x + this.y * v.y;
  }

  dist(v: Vector2){
    return new Vector2(this.x - v.x, this.y - v.y).length();
  }

  normalize(){
    var length = this.length();
    this.x /= length;
    this.y /= length;
    return this;
  }
}
