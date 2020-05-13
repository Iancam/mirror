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
    this.t = undefined;
    Object.assign(this, options);
  }

  pathForParticle(gestureField) {
    if (this.trajectory) return this.trajectory;

    const intersection = gestureField.getIntersection(this);
    if (intersection) {
      // console.log(intersection);

      const { pt: sectPt, sectVect } = intersection;
      if (sectPt) {
        const end = pointFrom(sectVect.angle, 15, sectPt);
        this.trajectory = new Bezier(...this.pt, ...sectPt, ...end);

        this.t = 0;
        const d = this.trajectory.length();

        this.steps = Math.floor(d / this.speed);
      } else {
        this.clearTrajectory();
      }
    }

    return this.trajectory;
  }

  clearTrajectory() {
    this.trajectory = null;
    this.t = undefined;
    this.steps = undefined;
  }

  newAngleForPoint(gestureField) {
    const startBend = this.range;
    const distance = gestureField.distance(this.pt);
    const nearest = gestureField.find(this.pt);
    const bending =
      gestureField.range - startBend < distance &&
      nearest &&
      Math.abs(nearest.angle - this.angle) > 60;
    if (bending) {
      if (!this.targetAngle) {
        this.targetAngle = 180 - (this.angle + nearest.angle);
        // console.log({ tg: this.targetAngle });

        return lerpAngle(this.angle, this.targetAngle, 1);
      }
    } else {
      return this.angle;
    }
    if (distance < gestureField.range) {
      return 180 - this.angle;
    } else {
      return this.angle;
    }
  }

  update(gestureField) {
    const { angle, length, speed, pt } = this;
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
      return [this];
    }
    if (gestureField && gestureField.count > 0) {
      this.angle = this.newAngleForPoint(gestureField);
      this.pt = pointFrom(this.angle, speed, pt);
      const ret = [this];

      return ret;
    } else {
      return [];
    }
  }
}
