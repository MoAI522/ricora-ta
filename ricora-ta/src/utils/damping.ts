const omega0 = 6;
const gamma = 3; //under damping

// Ref: https://w3e.kanazawa-it.ac.jp/math/physics/category/mechanics/masspoint_mechanics/damped_harmonic_motion/henkan-tex.cgi?target=/math/physics/category/mechanics/masspoint_mechanics/damped_harmonic_motion/dphm_solution.html&pcview=2#initial_value_problem
const calc = (t: number, x0: number, v0: number) => {
  // const eta = Math.sqrt(gamma * gamma - omega0 * omega0);
  // const c1 = ((gamma + eta) * x0 + v0) / (2 * eta),
  //   c2 = -((gamma - eta) * x0 + v0) / (2 * eta);
  // const x =
  //   Math.pow(Math.E, -gamma * t) *
  //   (c1 * Math.pow(Math.E, gamma * t) + c2 * Math.pow(Math.E, -gamma * t));
  // const v =
  //   -Math.pow(Math.E, -gamma * t) *
  //   ((gamma - eta) * c1 * Math.pow(Math.E, eta * t) +
  //     (gamma + eta) * c2 * Math.pow(Math.E, -eta * t));
  const omega = Math.sqrt(omega0 * omega0 - gamma * gamma);
  const s = Math.sin(omega * t);
  const c = Math.cos(omega * t);
  const egt = Math.exp(-gamma * t);
  const x = egt * (x0 * c + ((x0 * gamma + v0) / omega) * s);
  const v =
    egt *
    (v0 * c - ((x0 * gamma * gamma + v0 * gamma) / omega + x0 * omega) * s);
  // console.log(t, x0, v0, omega, s, c, egt, x, v);
  return [x, v];
};

const moveToDestination = (
  dt: number,
  x0: number,
  v0: number,
  dest: number
) => {
  const [x, v] = calc(dt / 1000, dest - x0, v0);
  return [dest - x, v];
};

export default {
  moveToDestination,
};
