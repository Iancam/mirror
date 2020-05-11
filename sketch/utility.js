function times(num, callback) {
  let x = 0;
  for (x = 0; x < num; x++) {
    callback(x);
  }
}

function randInt(start, end) {
  const ret = start + Math.floor(Math.random() * (end - start));
  return ret;
}

function getIntersection(
  { pt: pt1, angle: angle1 },
  { pt: pt2, angle: angle2 }
) {
  const [x1, y1] = pt1;
  if (angle1 === angle2) return null;
  const [x2, y2] = pointFrom(angle1, 50, pt1);
  const [x3, y3] = pt2;
  const [x4, y4] = pointFrom(angle2, 50, pt2);
  const t1 = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4);
  const b1 = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  const pti = [
    t1 / b1,
    ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
      ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)),
  ];
  // console.log({ b1, t1, pti, pt1, pt2 });

  return pti;
}

function dWindow(array, windowSize, callback) {
  for (let i = windowSize; i < array.length; i++) {
    callback(array.slice(i - windowSize, i));
  }
}

function getAngle(p1, p2) {
  const angle =
    ((Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180) / Math.PI) % 360;
  return angle > 0 ? angle : 360 + angle;
}

function reflectAngle(incidenceAngle, surfaceAngle) {
  var a = surfaceAngle * 2 - incidenceAngle;
  return a >= 360 ? a - 360 : a < 0 ? a + 360 : a;
}

function last(array) {
  return array[array.length - 1];
}

function intersectInfinite(x1, y1, x2, y2, x3, y3, x4, y4) {
  const xt = (x1 * y1 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4);
  const b = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  const yt = (x1 * y1 - y1 * x2) * (x3 - x4) - (y1 - y2) * (x3 * y4 - y3 * x4);
  return [xt / b, yt / b];
}
function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  let x, y;
  let a1, a2, b1, b2, c1, c2;
  let r1, r2, r3, r4;
  let denom, offset, num;

  // Compute a1, b1, c1, where line joining points 1 and 2
  // is "a1 x + b1 y + c1 = 0".
  a1 = y2 - y1;
  b1 = x1 - x2;
  c1 = x2 * y1 - x1 * y2;

  // Compute r3 and r4.
  r3 = a1 * x3 + b1 * y3 + c1;
  r4 = a1 * x4 + b1 * y4 + c1;

  // Check signs of r3 and r4. If both point 3 and point 4 lie on
  // same side of line 1, the line segments do not intersect.
  if (r3 != 0 && r4 != 0 && same_sign(r3, r4)) {
    // console.log("noIntersect");

    return undefined;
  }

  // Compute a2, b2, c2
  a2 = y4 - y3;
  b2 = x3 - x4;
  c2 = x4 * y3 - x3 * y4;

  // Compute r1 and r2
  r1 = a2 * x1 + b2 * y1 + c2;
  r2 = a2 * x2 + b2 * y2 + c2;

  // Check signs of r1 and r2. If both point 1 and point 2 lie
  // on same side of second line segment, the line segments do
  // not intersect.
  if (r1 != 0 && r2 != 0 && same_sign(r1, r2)) {
    // console.log("noIntersect");
    return undefined;
  }

  //Line segments intersect: compute intersection point.
  denom = a1 * b2 - a2 * b1;

  if (denom == 0) return undefined;
  offset = denom < 0 ? -denom / 2 : denom / 2;

  // The denom/2 is to get rounding instead of truncating. It
  // is added or subtracted to the numerator, depending upon the
  // sign of the numerator.
  num = b1 * c2 - b2 * c1;
  x = num < 0 ? (num - offset) / denom : (num + offset) / denom;

  num = a2 * c1 - a1 * c2;
  y = num < 0 ? (num - offset) / denom : (num + offset) / denom;

  // lines_intersect
  return [x, y];
}

function same_sign(a, b) {
  return a * b >= 0;
}

function pointFrom(angle, length, start) {
  return [start[0] + length * cos(angle), start[1] + length * sin(angle)];
}

function lineFromVector(vector, length) {
  return [...pointFrom(vector.angle, length, vector.pt), ...vector.pt];
}

function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t;
}

function shortestAngle(start, end) {
  return ((((end - start) % 360) + 540) % 360) - 180;
}

function isBetween(start, end, mid) {
  end = end - start < 0.0 ? end - start + 360.0 : end - start;
  mid = mid - start < 0.0 ? mid - start + 360.0 : mid - start;
  return mid < end;
}

function lerpAngle(start, end, ratio) {
  return start + ((shortestAngle(start, end) * ratio) % 360);
}
