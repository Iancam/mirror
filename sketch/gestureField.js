class GestureField extends rbush {
  constructor(minDistance, range = 20) {
    super();
    this.range = range;
    this.minDistance = minDistance;
    this.window = [null, null, null];
    this.windowIndex = 0;
    this.count = 0;
    this.walls = [[], []];
    this.listeners = [];
  }
  clearWindow() {
    this.window = [null, null, null];
  }

  add(point) {
    const lastpt = this.last();
    const angle = lastpt ? getAngle(lastpt.pt, point) : null;
    const distance = lastpt && dist(...lastpt.pt, ...point);
    const distanceValid = !lastpt || distance >= this.minDistance;

    if (distanceValid) {
      const newPoint = { pt: point, angle };

      this.window[this.windowIndex] = newPoint;
      this.windowIndex = (this.windowIndex + 1) % this.window.length;

      this.insert(newPoint);

      [angle + 90, angle - 90].forEach((normal, i) =>
        this.walls[i].push(pointFrom(normal, this.range, point))
      );

      this.count += 1;
      this.listeners.forEach((cb) => cb(this));
      return newPoint;
    }
    return false;
  }

  find(pt) {
    const nearest = knn(this, ...pt, 1);
    const actualDistance = dist(...nearest[0].pt, ...pt);
    return actualDistance <= this.range ? nearest[0] : null;
  }

  getIntersections(vector) {
    let sect = this.getIntersection(vector);
    const intersections = [];
    let t = 0;
    while (sect && t < 50) {
      t++;
      intersections.push(sect);
      sect = this.getIntersection(sect);
    }
    console.log(t, intersections, vector);
    return intersections;
  }

  distance(pt) {
    const nearest = knn(this, ...pt, 1);
    return dist(...nearest[0].pt, ...pt);
  }

  inRange(pt) {
    return !!this.find(pt);
  }

  register(cb) {
    this.listeners.push(cb);
  }

  getIntersection(vector) {
    console.trace();
    const sectPts = this.walls
      .map((wall) => {
        if (wall.length < 2) return null;
        let ret = undefined;
        windowForEach(wall, 2, (wallSection) => {
          const [lst, curr] = wallSection;
          if (ret) return;
          const [a1, a2] = wallSection.map((pt) => getAngle(vector.pt, pt));
          const endpointAngles =
            shortestAngle(a1, a2) < shortestAngle(a2, a1) ? [a2, a1] : [a1, a2];

          const angleIntersectsLine = isBetween(
            ...endpointAngles,
            vector.angle
          );

          if (angleIntersectsLine) {
            debug.push([
              lineFromVector(vector, 10),
              { color: "red", weight: 3 },
            ]);
            const pointer = pointFrom(vector.angle, 1000, vector.pt);
            const sectPt = intersect(...lst, ...curr, ...vector.pt, ...pointer);

            const surfaceAngle = getAngle(lst, curr);
            ret = {
              pt: sectPt,
              angle: reflectAngle(vector.angle, surfaceAngle),
            };
          }
        });
        return ret;
      })
      .filter((pt) => pt && pt.pt);
    const closest =
      sectPts.length < 1
        ? undefined
        : sectPts.reduce((min, curr) => {
            const distance = dist(...curr.pt, ...vector.pt);
            return min.distance > distance
              ? {
                  distance,
                  ...curr,
                }
              : min;
          });
    return closest;
  }

  last() {
    const index =
      this.windowIndex - 1 < 0 ? this.window.length - 1 : this.windowIndex - 1;
    return this.window[index];
  }

  toBBox(point) {
    const {
      pt: [x, y],
      angle,
    } = point;

    return { minX: x, minY: y, maxX: x, maxY: y };
  }
  compareMinX(a, b) {
    return a.x - b.x;
  }
  compareMinY(a, b) {
    return a.y - b.y;
  }
}
