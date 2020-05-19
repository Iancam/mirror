// particles.js
const dupLife = 200;
let startLife = 90;
const deathDist = 100;

class Particle {
  constructor(pt, angle, options = { length: 5, speed: 2 }) {
    this.pt = pt;
    this.angle = angle < 0 ? 360 + angle : angle > 360 ? angle % 360 : angle;
    this.targetAngle = null;
    this.trajectory = null;
    this.t = 0;
    this.color = [Math.random() * 255, Math.random() * 255, 255];

    Object.assign(this, options);
  }

  pathForParticle(gestureField) {
    if (this.trajectory) return this.trajectory;

    const inRange = gestureField.inRange(this.pt);
    const intersections = gestureField.getIntersections(this);
    const intersection = intersections[0];
    /**  TODO: curve without an intersection? */
    if (!inRange || !intersection || !intersection.pt)
      return this.clearTrajectory();

    const { pt: sectPt, angle: reflectionAngle } = intersection;

    const dis = dist(...this.pt, ...sectPt);
    const end = pointFrom(reflectionAngle, dis, sectPt);
    end;
    this.trajectory = new Bezier(...this.pt, ...sectPt, ...end);

    this.t = 0;
    const d = this.trajectory.length();

    this.steps = Math.floor(d / this.speed);

    return this.trajectory;
  }

  clearTrajectory() {
    this.trajectory = null;
    this.t = 0;
    // this.steps = undefined;
  }

  update(gestureField) {
    const { speed, pt } = this;
    const maxes = [width, height];
    const offScreen = this.pt.reduce(
      (offScreen, pt, i) => offScreen || pt < 0 || pt > maxes[i],
      false
    );
    if (offScreen) return null;

    if (this.t > this.steps) {
      this.clearTrajectory();
    }

    if (this.trajectory) {
      const { x, y } = this.trajectory.get(this.t++ / this.steps);
      // const { x: dx, y: dy } = this.trajectory.derivative(this.t / this.steps);

      // let newAngle = getAngle([x, y], [dx, dy]);
      const newAngle = getAngle(this.pt, [x, y]);
      this.pt = [x, y];
      this.angle = newAngle;
      return this;
    }

    this.pt = pointFrom(this.angle, speed, pt);
    return this;
  }
}
