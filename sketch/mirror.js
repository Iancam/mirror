function setup() {
  createCanvas(1000, 480);
  angleMode(DEGREES);
  noFill();
  stroke(255, 255, 255);
}

let depth = 10;
let particles = [];
let gesture = new GestureField(10);
let gestDist = 10;
let dragged = false;
let freeze = false;
function draw() {
  if (freeze) {
    return;
  }
  background(0);
  stroke(255, 0, 255);
  gesture.all().forEach(({ pt, angle }) => {
    circle(...pt, gesture.range);
    line(...pt, ...pointFrom(angle, gestDist, pt));
  });
  stroke(255, 255, 255);
  particles = particles.reduce((all, particle) => {
    const newParticles = particle.update(gesture);

    newParticles.forEach((newParticle) => {
      const { angle, length, pt } = newParticle;
      const bez = newParticle.pathForParticle(gesture);
      stroke(255, 0, 255);
      bez && bez.getLUT(5).forEach(({ x, y }) => circle(x, y, 2));
      stroke(255, 255, 255);
      line(...pt, ...pointFrom(angle, length, pt));
      all.push(newParticle);
    });

    return all;
  }, []);
}

function mouseDragged() {
  dragged = true;
  const pt = [mouseX, mouseY];
  const added = gesture.add(pt);
  if (typeof added.angle === "number") {
    times(randInt(3, 5), () => particles.push(new Particle(pt, added.angle)));
  }
}

function mouseReleased() {
  console.log("sweet release");
  if (!dragged) gesture = new GestureField(10);
  dragged = false;

  gesture.clearWindow();
}

function keyPressed(params) {
  if (key === " ") {
    freeze = !freeze;
    return false;
  }
  return false;
}
