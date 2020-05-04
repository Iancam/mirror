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

function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t;
}

function lerpAngle(start, end, ratio) {
  const shortest_angle = ((((end - start) % 360) + 540) % 360) - 180;
  return start + ((shortest_angle * ratio) % 360);
}
