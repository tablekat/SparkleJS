
export {VectorSpread, ScalarSpread, VectorSpreadArg, ScalarSpreadArg, SpreadType} from "./Spread";
export {Vector2} from "./Vector2";
export {ParticleSystemArgs} from "./particleSystem";
export {Emitter} from "./emitter";
import {Emitter} from "./emitter";
import {Vector2} from "./Vector2";


export function sparkle($elem){
  new Emitter($elem, {

    maxParticles: 100,

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
