// particles.js
const dupLife = 200;
let startLife = 90;
const deathDist = 100;

class Particle {
  constructor(pt, angle, gesture, options) {
    const defaultOptions = { length: 5, speed: 2 };
    this.pt = pt;
    this.angle = angle < 0 ? 360 + angle : angle > 360 ? angle % 360 : angle;
    this.trajectory = new Trajectory(this, options.speed, gesture);
    this.trajectory.register();
    this.t = 0;
    this.color = [Math.random() * 255, Math.random() * 255, 255];

    Object.assign(this, { ...defaultOptions, ...options });
  }

  update(gesture) {
    const { speed, pt } = this;
    const maxes = [width, height];
    const offScreen = this.pt.reduce(
      (offScreen, pt, i) => offScreen || pt < 0 || pt > maxes[i],
      false
    );
    if (offScreen) return null;
    const nextPt = this.trajectory.step(this, gesture);
    if (nextPt) {
      const newAngle = getAngle(this.pt, nextPt);
      this.pt = nextPt;
      this.angle = newAngle;
      return this;
    }
    this.pt = pointFrom(this.angle, speed, pt);
    return this;
  }
}
