// import * as PIXI from "pixi.js";
// import { Animation, Position, Display } from "./anim";
// import * as ecs from "bitecs";

import { Fireworks } from "fireworks-js";
//@ts-ignore
import TypeWriter from "typewriter-effect/dist/core";

const typeWriter = new TypeWriter("#msg", {
    loop: false,
    delay: 75
});

typeWriter
    .pauseFor(1000)
    .typeString("Hey look, it's the card I promised.")
    .pauseFor(300)
    .typeString(" I lov")
    .pauseFor(500)
    .deleteChars(2)
    .deleteChars(1)
    .deleteChars(3)
    .typeString(" Really hope you like it and maybe you'll find it ")
    .pauseFor(100)
    .typeString(" as lovely, delightful and charming as yourself.")
    .pauseFor(100)
    .typeString(" Have a wonderful day Gosia, filled with happiness and joy.")
    .pauseFor(200)
    .typeString(" Happy Birthday!!!")
    .start();

const fireworksArea = document.querySelector(".card")!;
const fireworks = new Fireworks(fireworksArea);

fireworks.start();

const canvas: HTMLCanvasElement = document.querySelector("#sim")!;

const ctx = canvas.getContext("2d")!;

const colors = [
    "#F20587",
    "#861BF2",
    "#5C82F2",
    "#07DBF2",
    "#07F2B0"
];

const message = "Hey look, it's the card I promised. Really hope you like it and maybe you'll find it as lovely, delightful and charming as yourself. Have a wonderful day Gosia, filled with happiness and joy. Happy Birthday!!!";

const check: HTMLInputElement = document.querySelector("#sm > input")!;
const firew = fireworksArea.querySelector("canvas")!;

check.addEventListener("change", (e) => {
    if (check.checked) {
        canvas.classList.add("dark");
        firew.classList.add("dark");
    } else {
        canvas.classList.remove("dark");
        firew.classList.remove("dark");
    }
});

// const app = new PIXI.Application({view: canvas, antialias: true});
// app.renderer.backgroundColor = 0xffffff;

canvas.width = canvas.parentElement!.clientWidth;
canvas.height = canvas.parentElement!.clientHeight;

const mouse = {
    x: NaN,
    y: NaN
};

addEventListener("mousemove", evt => {
    mouse.x = evt.clientX;
    mouse.y = evt.clientY;
});

const MAX_PARTICLES = 400;

const Particles = {
    x: Array(MAX_PARTICLES) as number[],
    y: Array(MAX_PARTICLES) as number[],
    dx: Array(MAX_PARTICLES) as number[],
    dy: Array(MAX_PARTICLES) as number[],
    radius: Array(MAX_PARTICLES) as number[],
    color: Array(MAX_PARTICLES) as string[]
};

let index = 0;
const addParticle = (x: number, y: number, dx: number, dy: number, radius: number, color: string) => {
    const id = index++;
    Particles.x[id] = x;
    Particles.y[id] = y;
    Particles.dx[id] = x;
    Particles.dy[id] = y;
    Particles.radius[id] = radius;
    Particles.color[id] = color;
};

const draw = (id: number) => {
    ctx.beginPath();
    ctx.fillStyle = Particles.color[id];
    ctx.arc(Particles.x[id], Particles.y[id], Particles.radius[id], 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
};

const update = (id: number) => {
    draw(id);

    const x = Particles.x[id];
    const y = Particles.y[id];
    // const dx = Particles.dx[id];
    // const dy = Particles.dy[id];
    const radius = Particles.radius[id];
    // const color = Particles.color[id];

    if (x + radius > canvas.width || x - radius < 0) {
        Particles.dx[id] *= -1;
    }
    if (y + radius > canvas.height || y - radius < 0) {
        Particles.dy[id] *= -1;
    }

    const dist = Math.hypot(mouse.x - x, mouse.y - y);
    if (dist <= 40 && radius < 40) {
        Particles.radius[id] += 1;
    } else if (radius > 5) {
        Particles.radius[id] -= 1;
    }

    Particles.x[id] += Particles.dx[id];
    Particles.y[id] += Particles.dy[id];
}

const randint = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const random = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
};

for (let id = 0; id < Particles.x.length; id++) {
    const radius = Particles.radius[id] = 5;
    Particles.x[id] = randint(5, canvas.width - 5)
    Particles.y[id] = randint(5, canvas.height - 5)
    Particles.dx[id] = random(1, 3);
    Particles.dy[id] = random(1, 3);
    
    Particles.color[id] = colors[randint(0, 5)];
}

const animate = () => {
    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let id = 0; id < Particles.x.length; id++) {
        update(id);
    }

    
};

animate();



