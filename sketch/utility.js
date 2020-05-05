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

function lerpAngle(start, end, ratio) {
  return start + ((shortestAngle(start, end) * ratio) % 360);
}
