function debugFx(all, thing) {
  const [vals, opts] = thing;
  const timedOut =
    opts && opts.ttl && opts.tstamp && new Date() - opts.tstamp > opts.ttl;
  if (timedOut) {
    return all;
  }

  const op = {
    2: (v, opts = { color: "yellow", weight: 10 }) => {
      stroke(opts.color);
      strokeWeight(opts.weight);
      point(...v);
    },
    4: (v, opts = { color: "cyan", weight: 1 }) => {
      strokeWeight(opts.weight);
      stroke(opts.color);
      line(...v);
    },
  }[vals.length](vals, opts);
  all.push(thing);
  return all;
  // point(...pt);
}
