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

      this.bezIndex = -1;
      this.bezes = [];
      this.bez = undefined;
      this.step();
    }
  }

  addIntersections(intersections) {
    this.pts = this.pts.concat(intersections);
    const [_, distance] =
      this.pts.length < 2
        ? [null, null]
        : this.pts.reduce(
            ([lst, summ], { pt }) => {
              summ += lst ? dist(...lst, ...pt) : 0;
              return [pt, summ];
            },
            [undefined, 0]
          );

    this.steps = Math.floor(distance / this.speed);
  }

  register() {
    this.gestureField.register(this.updatePath.bind(this));
  }

  updatePath(gestureField) {
    const lst = last(this.pts);
    debug.push([lineFromVector(lst, 20), { color: "cyan", weight: 3 }]);
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
      this.bezes.push(new Bezier(...pts));
    }
  }

  clear() {
    this.defined = false;
    this.pts = [];
    this.t = 0;
    return null;
  }

  step() {
    if (!this.steps) {
      return null;
    }
    this.updateBezes();
    //
    const index = this.t++ / this.steps;
    const bezTime = index % 1;
    const bezIndex = Math.floor(index);

    if (this.bezes[bezIndex]) {
      const { x, y } = this.bezes[bezIndex].get(bezTime);
      return [x, y];
    }
  }

  getLUT(...args) {
    return this.bez.getLUT(...args);
  }

  length() {
    return this.pts.length;
  }
}
