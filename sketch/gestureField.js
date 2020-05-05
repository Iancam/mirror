// gestureField.js;

// { pt, angle: lGest ? getAngle(lGest.pt, pt) : null };
class GestureField extends rbush {
  constructor(minDistance, range = 20) {
    super();
    this.range = range;
    this.minDistance = minDistance;
    this.window = [null, null, null];
    this.windowIndex = 0;
    this.count = 0;
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
      this.count += 1;
      return newPoint;
    }
    return false;
  }

  find(pt) {
    const nearest = knn(this, ...pt, 1);
    const actualDistance = dist(...nearest[0].pt, ...pt);
    return actualDistance <= this.range ? nearest[0] : null;
  }

  distance(pt) {
    const nearest = knn(this, ...pt, 1);
    return dist(...nearest[0].pt, ...pt);
  }

  getIntersection(vector) {
    const nearest = this.find(vector.pt);
    if (nearest) {
      const [sectPt, dst] = knn(this, ...vector.pt, 4).reduce(
        ([minPt, dst], { pt, angle }) => {
          const normal =
            shortestAngle(vector.angle, angle) > 0 ? angle + 90 : angle - 90;
          const sectLine = {
            pt: pointFrom(normal, this.range, pt),
            angle: angle,
          };
          debug.push(["l", [...pt, ...sectLine.pt]]);
          const sectPt = getIntersection(vector, sectLine);

          const distance = sectPt ? dist(...sectPt, ...vector.pt) : Infinity;
          // console.log(sectPt, distance);
          return distance < dst ? [sectPt, distance] : [minPt, dst];
        },
        [null, Infinity]
      );

      strokeWeight(10);
      stroke(255, 255, 100);
      // sectPt && debug.push(["p", sectPt]); // && point(...sectPt);
      strokeWeight(1);
      return sectPt;
    }
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
