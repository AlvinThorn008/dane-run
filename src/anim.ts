import * as ecs from "bitecs";
import * as PIXI from "pixi.js";
import rapier from "@dimforge/rapier2d";

const { Types } = ecs;

interface TimeState {
    delta: number,
    elapsed: number,
    then: number
}

const Display = ecs.defineComponent({ radius: Types.f32, color: Types.i32 });
const Position = ecs.defineComponent({ x: Types.f32, y: Types.f32 });
const Physics = ecs.defineComponent({ vx: Types.f32, vy: Types.f32 })

class Animation {
    world: ecs.IWorld = ecs.createWorld();
    time: TimeState = { delta: 0, elapsed: 0, then: performance.now() };
    physicalWorld: rapier.World = new rapier.World({ x: 0, y: -9.81 });

    constructor(private app: PIXI.Application) {}

    start() {
        this.app.ticker.add(dt => {
            this.physicalWorld.step();
            rendererSystem(this.world, this.app.stage);
        });
    }

    stop() {
        this.app.ticker.stop();
    }
}

const timeSystem = (world: ecs.IWorld, time: TimeState) => {
    const now = performance.now();
    const delta = now - time.then;
    time.delta = delta;
    time.elapsed += delta;
    time.then = now;

    return world;
};

const rendererQuery = ecs.defineQuery([Display, Position]);
const enteredRendererQuery = ecs.enterQuery(rendererQuery);
const exitedRendererQuery = ecs.exitQuery(rendererQuery);

const rendererSystem = (world: ecs.IWorld, stage: PIXI.Container) => {
    const entered = enteredRendererQuery(world);
    for (let i = 0; i < entered.length; i++) {
        const eid = entered[i];

        const sprite = new PIXI.Graphics();
        sprite.beginFill(Display.color[eid]);
        sprite.drawCircle(Position.x[eid], Position.y[eid], Display.radius[eid]);
        sprite.endFill();
        sprite.name = `${eid}`;

        stage.addChild(sprite);
    }

    const exited = exitedRendererQuery(world);
    for (let i = 0; i < exited.length; i++) {
        const eid = exited[i];

        stage.removeChild(stage.getChildByName(`${eid}`));
    }

    return world;
};

export { rendererSystem, Animation, Display, Position };