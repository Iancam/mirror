class Trajectory {
  constructor(vector, speed, gestureField) {
    this.gestureField = gestureField;
    this.t = 0;
    this.speed = speed;
    if (gesture.inRange(vector.pt)) {
      this.pts = [
        {
          pt: vector.pt,
          angle: vector.angle,
        },
      ];
      this.addIntersections(gesture.getIntersections(vector));
      this.bezes = [];
      this.bezIndex = 0;
      this.step();
    }
  }

  addIntersections(intersections) {
    const oldLen = this.pts.length;
    this.pts = this.pts.concat(intersections);
    if (this.pts.length > oldLen) this.updateBezes();
  }

  register() {
    this.gestureField.register(this.updatePath.bind(this));
  }

  updatePath(gestureField) {
    const lst = last(this.pts);
    // debug.push([lineFromVector(lst, 20), { color: "cyan", weight: 2 }]);
    const sect = lst && gestureField.getIntersections(lst);
    lst && this.addIntersections(sect);
  }

  updateBezes() {
    this.bezes = [];
    let withMidpoints = [];
    for (let i = 2; i < this.pts.length; i++) {
      const [p1, p2] = this.pts.slice(i - 2, i);
      withMidpoints = withMidpoints.concat([
        p1.pt,
        [lerp(p1.pt[0], p2.pt[0], 0.5), lerp(p1.pt[1], p2.pt[1], 0.5)],
      ]);
    }
    withMidpoints.push(last(this.pts).pt);

    for (let i = 1 + 3; i < withMidpoints.length; i += 2) {
      const pts = withMidpoints
        .slice(i - 3, i)
        .reduce((all, pt) => all.concat(pt), []);
      const bez = new Bezier(...pts);
      const steps = Math.floor(bez.length() / this.speed);
      this.bezes.push({ bez, steps });
    }
  }

  clear() {
    this.defined = false;
    this.pts = [];
    this.t = 0;
    return null;
  }

  step() {
    if (this.bezes.length < 1 || this.bezIndex >= this.bezes.length) {
      return null;
    }
    const { bez, steps } = this.bezes[this.bezIndex];
    if (this.t > steps) {
      this.t = this.t - steps;
      this.bezIndex += 1;
    }
    // console.log(this.bezes);

    const { x, y } = bez.get((this.t += 1) / steps);
    return [x, y];
  }

  getLUT(...args) {
    return this.bezes[this.bezIndex].getLUT(...args);
  }

  length() {
    return this.pts.length;
  }
}
