
export {VectorSpread, ScalarSpread, VectorSpreadArg, ScalarSpreadArg, SpreadType} from "./Spread";
export {Vector2} from "./Vector2";
export {ParticleSystemArgs} from "./particleSystem";
export {Emitter} from "./emitter";
import {Emitter} from "./emitter";
import {Vector2} from "./Vector2";


var sprites = {};

sprites["reddot"] = (function(){
  var sprite: any = $("<canvas></canvas>")[0];
  sprite.width = 12;
  sprite.height = 12;
  var ctx = sprite.getContext('2d');
  ctx.beginPath();
  ctx.arc(6, 6, 6, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'red';
  ctx.fill();
  return sprite;
})();
sprites["dot"] = (function(){
  var sprite: any = $("<canvas></canvas>")[0];
  sprite.width = 12;
  sprite.height = 12;
  var ctx = sprite.getContext('2d');
  ctx.beginPath();
  ctx.arc(6, 6, 6, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'black';
  ctx.fill();
  return sprite;
})();
sprites["rainbowdot"] = (function(){
  var sprite: any = $("<canvas></canvas>")[0];
  sprite.width = 12;
  sprite.height = 12;
  var ctx = sprite.getContext('2d');
  ctx.beginPath();
  ctx.arc(6, 6, 6, 0, 2 * Math.PI, false);
  var r = () => Math.floor(255 * Math.random());
  ctx.fillStyle = `rgb(${r()}, ${r()}, ${r()})`;
  ctx.fill();
  return sprite;
});
sprites["dust"] = (function(){
  var sprite: any = $("<canvas></canvas>")[0];
  sprite.width = 12;
  sprite.height = 12;
  var ctx = sprite.getContext('2d');
  ctx.beginPath();
  ctx.arc(6, 6, 6, 0, 2 * Math.PI, false);

  var grd = ctx.createRadialGradient(6, 6, 0, 6, 6, 6 * 0.707);
  grd.addColorStop(0, "black");
  grd.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = grd;
  ctx.fill();
  return sprite;
})();
sprites["rainbowdust"] = (function(){
  var sprite: any = $("<canvas></canvas>")[0];
  sprite.width = 12;
  sprite.height = 12;
  var ctx = sprite.getContext('2d');
  ctx.beginPath();
  ctx.arc(6, 6, 6, 0, 2 * Math.PI, false);

  var grd = ctx.createRadialGradient(6, 6, 1, 6, 6, 6 * 0.707);
  var r = Math.floor(255 * Math.random());
  var g = Math.floor(255 * Math.random());
  var b = Math.floor(255 * Math.random());
  grd.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
  grd.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
  ctx.fillStyle = grd;
  ctx.fill();
  return sprite;
});

export function sprite(opt?: string){
  if(!opt){
    var keys = Object.keys(sprites);
    opt = keys[Math.floor(Math.random() * keys.length)];
    return sprites[opt];
  }else if(sprites[opt]){
    return sprites[opt];
  }else{
    return null;
  }
}

export function sparkle($elem){

  new Emitter({
    attach: $elem,
    attachTo: "center", // todo

    maxParticles: 100,
    emitRate: 1,
    sprite: sprite("rainbowdot"),

    maxLife: {
      value: 1,
      spread: 0.5
    },

    velocity: {
      value: new Vector2(0, -5),
      spread: new Vector2(7, 2)
    },

    gravity: new Vector2(0, 0.2)

  }).start();
}
