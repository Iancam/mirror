function setup() {
  createCanvas(1000, 480);
  angleMode(DEGREES);
  noFill();
  stroke(255, 255, 255);
}

const drawParticle = (all) => (newParticle) => {
  const { angle, length, pt } = newParticle;
  const bez = newParticle.pathForParticle(gesture);
  stroke(100, 0, 255);
  bez && bez.getLUT(20).forEach(({ x, y }) => circle(x, y, 2));
  stroke(255, 255, 255);
  line(...pt, ...pointFrom(angle, length, pt));
  all.push(newParticle);
};

let depth = 10;
let particles = [];
let gestDist = 20;
let gesture = new GestureField(gestDist);
let debug = [];
let dragged = false;
let freeze = false;
let maxParticles = 100;

function draw() {
  if (freeze) {
    return;
  }
  stroke(255, 255, 100);
  strokeWeight(1);

  background(0);
  const debugFx = (all, thing) => {
    const [call, vals, opts] = thing;
    // console.log(vals);
    const timedOut =
      opts && opts.ttl && opts.tstamp && new Date() - opts.tstamp > opts.ttl;
    if (timedOut) {
      return all;
    }
    const op = {
      p: (v, opts = { color: "yellow", weight: 10 }) => {
        stroke(opts.color);
        strokeWeight(opts.weight);
        point(...v);
      },
      l: (v, opts = { color: "cyan", weight: 1 }) => {
        strokeWeight(opts.weight);
        stroke(opts.color);
        line(...v);
      },
    }[call](vals, opts);
    all.push(thing);
    return all;
    // point(...pt);
  };
  debug = debug.reduce(debugFx, []);
  strokeWeight(1);
  stroke(255, 0, 255);

  gesture.all().forEach(({ pt, angle }) => {
    circle(...pt, gesture.range - 10);
    line(...pt, ...pointFrom(angle, gestDist, pt));
  });
  stroke("white");
  gesture.walls.forEach((wall) => {
    if (wall.length > 2) {
      dWindow(wall, 2, ([p1, p2]) => line(...p1, ...p2));
    }
  });
  stroke(255, 255, 255);
  particles = particles.reduce((all, particle) => {
    const newParticles = particle.update(gesture);

    newParticles.forEach(drawParticle(all));

    return all;
  }, []);
}

function mouseDragged() {
  dragged = true;
  const pt = [mouseX, mouseY];
  const added = gesture.add(pt);
  if (typeof added.angle === "number" && particles.length < maxParticles) {
    particles.push(new Particle(pt, added.angle));
  }
}

function mouseReleased() {
  if (!dragged) {
    gesture = new GestureField(10);
    particles = [];
  }
  dragged = false;
  // debug = [];

  gesture.clearWindow();
}

function keyPressed(params) {
  if (key === " ") {
    freeze = !freeze;
    return false;
  }
  return false;
}
