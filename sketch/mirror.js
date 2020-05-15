function setup() {
  createCanvas(1000, 480);
  angleMode(DEGREES);
  noFill();
  stroke(255, 255, 255);
  background(0);
}

const drawParticle = (all) => (particle) => {
  const { angle, length, pt } = particle;
  const bez = particle.pathForParticle(gesture);
  stroke(100, 0, 255);
  drawBez && bez && bez.getLUT(20).forEach(({ x, y }) => circle(x, y, 2));
  stroke(...particle.color);
  line(...pt, ...pointFrom(angle, length, pt));
  all.push(particle);
};

let depth = 10;
let particles = [];
let gestDist = 20;
let gesture = new GestureField(gestDist);
let debug = [];
let maxParticles = 100;

let dragged = false;
let freeze = false;
let drawBez = false;
let trace = false;
function debugFx(all, thing) {
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
}

function draw() {
  if (freeze) {
    return;
  }
  stroke(255, 255, 100);
  strokeWeight(1);

  !trace && background(0);

  debug = debug.reduce(debugFx, []);
  strokeWeight(1);
  stroke(255, 0, 255);

  gesture.all().forEach(({ pt, angle }) => {
    // circle(...pt, gesture.range - 10);
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
    background(0);
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
  if (key === "d") {
    drawBez = !drawBez;
    return false;
  }
  if (key === "t") {
    trace = !trace;
    return false;
  }
}
