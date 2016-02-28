
import {Particle} from "./particle";
import {Vector2} from "./Vector2";
import {VectorSpread, VectorSpreadArg, ScalarSpreadArg, ScalarSpread} from "./Spread";

export interface ParticleSystemArgs{
  maxLife?: number | ScalarSpreadArg;
  emitterMaxLife?: number;
  maxParticles: number;
  emitterElem?: any;
  emitterRate?: number;

  position?: Vector2 | VectorSpreadArg;
  velocity?: Vector2 | VectorSpreadArg;
  acceleration?: Vector2 | VectorSpreadArg;
  gravity?: Vector2;
  higherOrder?: (Vector2 | VectorSpreadArg)[];

  accelerationField?: (Vector2) => VectorSpread; // As apposed to a force field, which would require mass to calculate the acceleration

  particleElemFactory?: () => any;

  scale?: number | ScalarSpreadArg;
  rotation?: number | ScalarSpreadArg;
  rotationVelocity?: number | ScalarSpreadArg;

  // Opacity options:
  // number/ScalarSpreadArg: solid opacity for entire duration until particle disappears
  // Array: life is number 0-1, when life span reaches that percent of life, begin scaling between value's at a gradient
  // function: given life percent (0-1), get opacity
  opacity?: number | ScalarSpreadArg | [{ value: number, life: number }] | ((life: number) => number);

  // TODO:
  // - colors?
  // - creation rate!?
  // - allow position spread to be over an element's size... maybe just figure that manually in the emitter when making a particleSystem!
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
  emitterElem: any;
  emitterRate: number;

  position: VectorSpread;
  velocity: VectorSpread;
  acceleration: VectorSpread;
  higherOrder: VectorSpread[];

  accelerationField: (Vector2) => VectorSpread;

  particleElemFactory: () => any;

  scale: ScalarSpread;
  rotation: ScalarSpread;
  rotationVelocity: ScalarSpread;
  opacity: ScalarSpread | [{ value: number, life: number }] | ((life: number) => number);

  particles: Particle[];

  constructor(args: ParticleSystemArgs){
    this.config = args;
    this.particles = [];

    this.maxLife = args.maxLife ? new ScalarSpread(args.maxLife) : new ScalarSpread(5);
    this.maxParticles = args.maxParticles || 100;
    this.emitterMaxLife = args.emitterMaxLife ? args.emitterMaxLife : null;
    this.emitterElem = args.emitterElem || $("body");
    this.emitterRate = args.emitterRate || 16; // physics tick-rate

    this.accelerationField = args.accelerationField;
    this.particleElemFactory = args.particleElemFactory;

    this.scale = new ScalarSpread(args.scale);
    this.rotation = new ScalarSpread(args.rotation);
    this.rotationVelocity = new ScalarSpread(args.rotationVelocity);
    if(typeof args.opacity === "number" || ScalarSpread.isArg(args.opacity)){
      this.opacity = new ScalarSpread(args.opacity);
    }else{
      this.opacity = <ScalarSpread>args.opacity; // This is actaully the array or function case, but supress the typescript error
    }

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

    // cycleDuration should maybe be an option, but for now just read the "maxParticles" option as "number of particles emitted per 5 seconds"... i think
    var cycleDuration = 5; //this.maxLife.value * this.maxParticles; // in seconds (commented thing is wrong becuase that averages out to 1 particle a tick for all values...)
    var cycleTicks = cycleDuration / (this.emitterRate / 1000); // emitterRate :: milliseconds / tick
    var newParticlesPerTick = this.maxParticles / cycleTicks;
    if(Math.random() < (newParticlesPerTick - Math.floor(newParticlesPerTick))){
      newParticlesPerTick = Math.ceil(newParticlesPerTick);
    }else{
      newParticlesPerTick = Math.floor(newParticlesPerTick);
    }

    if(!this.dying && newParticles.length < this.maxParticles){
      for(var i=0; i < newParticlesPerTick; ++i){
        newParticles.push(this.createParticle());
      }
    }

    this.particles = newParticles;

  }

  private createParticle(){
    return new Particle({
      maxLife:                           this.maxLife.sample(),

      position:                          this.position.sample(),
      velocity:     this.velocity     && this.velocity.sample(),
      acceleration: this.acceleration && this.acceleration.sample(),
      higherOrder:  this.higherOrder  && this.higherOrder.map(x => x.sample()),
      accelerationField: this.accelerationField,

      emitterElem: this.emitterElem || $("body"),
      elemFactory: this.particleElemFactory,

      scale: this.scale.sample(),
      rotation: this.rotation.sample(),
      rotationVelocity: this.rotationVelocity.sample(),
      opacity: (this.opacity instanceof ScalarSpread) ?
        (<ScalarSpread>this.opacity).sample() :
        (<[{ value: number, life: number }] | ((life: number) => number)>this.opacity), // Okay this is really getting annoying, typescript

    });
  }
}
