
export {VectorSpread, ScalarSpread, VectorSpreadArg, ScalarSpreadArg, SpreadType} from "./Spread";
export {Vector2} from "./Vector2";
export {ParticleSystemArgs} from "./particleSystem";
export {Emitter} from "./emitter";
import {Emitter} from "./emitter";
import {Vector2} from "./Vector2";


export function sparkle($elem){

  // Todo: Sprite class with prebuild canvases for simple images
  var sprite: any = $("<canvas></canvas>")[0];
  sprite.width = 16;
  sprite.height = 16;
  var ctx = sprite.getContext('2d');
  ctx.beginPath();
  ctx.arc(8, 8, 8, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'red';
  ctx.fill();

  new Emitter($elem, {

    maxParticles: 100,
    emitRate: 1,
    sprite: sprite,

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
