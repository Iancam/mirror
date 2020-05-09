function setup() {
  createCanvas(1000, 480);
  angleMode(DEGREES);
  noFill();
  stroke(255, 255, 255);
}

const drawParticle = (all) => (newParticle) => {
  const { angle, length, pt } = newParticle;
  const bez = newParticle.pathForParticle(gesture);
  stroke(255, 0, 255);
  bez && bez.getLUT(5).forEach(({ x, y }) => circle(x, y, 2));
  stroke(255, 255, 255);
  line(...pt, ...pointFrom(angle, length, pt));
  all.push(newParticle);
};

let depth = 10;
let particles = [];
let gestDist = 10;
let gesture = new GestureField(gestDist);
let debug = [];
let dragged = false;
let freeze = false;

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
      p: (v, opts = { color: "yellow" }) => {
        stroke(opts.color);
        strokeWeight(10);
        point(...v);
      },
      l: (v, opts = { color: "cyan" }) => {
        strokeWeight(1);
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
    circle(...pt, gesture.range);
    line(...pt, ...pointFrom(angle, gestDist, pt));
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
  if (typeof added.angle === "number" && particles.length < 2) {
    particles.push(new Particle(pt, added.angle));
  }
}

function mouseReleased() {
  console.log("sweet release");
  if (!dragged) gesture = new GestureField(10);
  dragged = false;
  debug = [];
  gesture.clearWindow();
}

function keyPressed(params) {
  if (key === " ") {
    freeze = !freeze;
    return false;
  }
  return false;
}
