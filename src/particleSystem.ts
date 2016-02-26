
import {Particle} from "./particle";
import {Vector2} from "./Vector2";
import {VectorSpread, VectorSpreadArg, ScalarSpreadArg, ScalarSpread} from "./Spread";

export interface ParticleSystemArgs{
  maxLife?: number | ScalarSpreadArg;
  emitterMaxLife?: number;
  maxParticles: number;

  position?: Vector2 | VectorSpreadArg;
  velocity?: Vector2 | VectorSpreadArg;
  acceleration?: Vector2 | VectorSpreadArg;
  gravity?: Vector2;
  higherOrder?: (Vector2 | VectorSpreadArg)[];

  accelerationField?: (Vector2) => VectorSpread; // As apposed to a force field, which would require mass to calculate the acceleration

  // TODO:
  // - colors?
  // - rotation velocity and spread
  // - rotation and spread
  // - scale and spread
  // - creation rate!?
  // - accelerationField
  // - allow position spread to be over an element's size... maybe just figure that manually in the emitter when making a particleSystem!
  // - get proper z-index for new particles!!! Needs to be below parent element maybe? MAYBE ABOVE!? WHO KNOWS!!
}

export class ParticleSystem{
  config: ParticleSystemArgs;

  private life: number = 0;
  private lastParticleAdded: number = 0;
  maxLife: ScalarSpread;
  maxParticles: number;
  emitterMaxLife: number;
  dying: boolean = false;
  alive: boolean = true;

  position: VectorSpread;
  velocity: VectorSpread;
  acceleration: VectorSpread;
  higherOrder: VectorSpread[];

  accelerationField: (Vector2) => VectorSpread;

  particles: Particle[];

  constructor(args: ParticleSystemArgs){
    this.config = args;
    this.particles = [];

    this.maxLife = args.maxLife ? new ScalarSpread(args.maxLife) : new ScalarSpread(5);
    this.maxParticles = args.maxParticles || 100;
    this.emitterMaxLife = args.emitterMaxLife ? args.emitterMaxLife : null;

    this.accelerationField = args.accelerationField;

    this.position = new VectorSpread(args.position);
    this.velocity = new VectorSpread(args.velocity);
    this.acceleration = new VectorSpread(args.acceleration);
    this.higherOrder = [];
    if(args.gravity) this.acceleration.value.add(args.gravity);

    if(Array.isArray(args.higherOrder)){
      for(var i = 0; i < args.higherOrder.length; ++i){
        this.higherOrder.push(new VectorSpread(args.higherOrder[i]));
      }
    }
  }

  update(dt: number, offsetX: number, offsetY: number){
    this.life += dt;
    if(!this.alive) return;
    if(this.dying && this.particles.length == 0){
      this.alive = false;
      return;
    }
    if(typeof this.emitterMaxLife === "number" && this.emitterMaxLife > 0 && this.life >= this.emitterMaxLife){
      this.dying = true;
    }

    var newParticles = [];

    for(var i=0; i < this.particles.length; ++i){
      var p = this.particles[i];
      p.update(dt);

      if(!p.alive) continue;
      p.updateElement(offsetX, offsetY);
      newParticles.push(p);
    }

    // TODO: This shouldn't be like this. It shouldn't be able to only make 1 particle a tick.
    var cycleDuration = this.maxLife.value * this.maxParticles;
    if(!this.dying && newParticles.length < this.maxParticles){
      newParticles.push(new Particle({
        maxLife:                           this.maxLife.sample(),
        position:                          this.position.sample(),
        velocity:     this.velocity     && this.velocity.sample(),
        acceleration: this.acceleration && this.acceleration.sample(),
        higherOrder:  this.higherOrder  && this.higherOrder.map(x => x.sample()),
        accelerationField: this.accelerationField
      }));
    }

    this.particles = newParticles;

  }
}
