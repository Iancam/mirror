function setup() {
  createCanvas(1000, 480);
  angleMode(DEGREES);
  noFill();
  stroke(255, 255, 255);
  background(0);
}

const drawParticle = (particle) => {
  const { angle, length, pt, trajectory } = particle;
  if (drawBez && trajectory.bezes) {
    windowForEach(trajectory.pts, 2, ([p1, p2]) => line(...p1.pt, ...p2.pt));
    stroke(100, 0, 255);

    // trajectory.bezes.forEach((bez) =>
    //   bez.getLUT(20).forEach(({ x, y }) => circle(x, y, 2))
    // );
    // trajectory.bezes.forEach((bez) =>
    //   bez.points.forEach(({ x, y }) => rect(x - 5, y - 5, 5, 5))
    // );
  }
  stroke(...particle.color);
  line(...pt, ...pointFrom(angle, length, pt));
};

let depth = 10;
let particles = [];
let gestDist = 20;
let gesture = new GestureField(gestDist);
let debug = [];

let maxParticles = 1;

let dragged = false;
let freeze = false;
let drawBez = true;
let trace = false;

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
      windowForEach(wall, 2, ([p1, p2]) => line(...p1, ...p2));
    }
  });
  stroke(255, 255, 255);
  particles = particles.reduce((all, oldParticle) => {
    const particle = oldParticle.update(gesture);
    if (!particle) return all;
    drawParticle(particle);
    all.push(particle);
    return all;
  }, []);
}

function mouseDragged() {
  dragged = true;
  const pt = [mouseX, mouseY];
  const added = gesture.add(pt);
  if (typeof added.angle === "number" && particles.length < maxParticles) {
    particles.push(new Particle(pt, added.angle, gesture));
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
