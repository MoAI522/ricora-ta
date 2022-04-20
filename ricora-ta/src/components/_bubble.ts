import * as SVG from "@svgdotjs/svg.js";
import damping from "../utils/damping";

const BUBBLE_HORN_POS_RATIO = 0.4,
  BUBBLE_HORN_WIDTH_RATIO = 0.3,
  BUBBLE_HORN_HEIGHT_PX = 30,
  BUBBLE_HORN_ANIMATION_DURATION = 200,
  ROTATION_ACCELERATION = 2000,
  ROTATION_OMEGA_MAX = 1000;

type TBubbleObject = {
  polygon: SVG.Polygon;
  getPrev: () => number[][][];
  setPrev: (prevPos: number[][], velocity: number[][]) => void;
  updateAngle: (dt: number) => void;
  getAngle: () => number;
  updateHorn: (dt: number) => void;
  getHornCoef: () => number;
  getCurrentTarget: () => TRect;
  setCurrentTarget: (rect: TRect) => void;
};

type TRect = {
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
};

const create = (targetQuery: string) => {
  const wrapperRect = _getElementRect("#bubble");
  const draw = SVG.SVG().addTo("#bubble").size(wrapperRect.w, wrapperRect.h);

  let currentTarget = _getElementRect(targetQuery);
  const pointArray = _rectToPointArray(currentTarget, 0);
  const polygon = draw
    .polygon(pointArray)
    .fill("#fff")
    .stroke({ width: 4, color: "#000" });

  const getCurrentTarget = () => currentTarget;
  const setCurrentTarget = (rect: TRect) => (currentTarget = rect);

  let prev = [
    _rectToPos(currentTarget),
    [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ],
  ];
  const getPrev = () => prev;
  const setPrev = (_prevPos: number[][], _velocity: number[][]) =>
    (prev = [_prevPos, _velocity]);

  let angleProps = {
    rotating: false,
    theta: 0,
    omega: 0,
    stopAcc: 0,
  };
  const toggleRotate = (rotate: boolean) => (angleProps.rotating = rotate);
  const getAngle = () => angleProps.theta;
  const updateAngle = (_dt: number) => {
    const dt = _dt / 1000;
    if (angleProps.rotating) {
      angleProps.omega += ROTATION_ACCELERATION * dt;
      if (angleProps.omega > ROTATION_OMEGA_MAX)
        angleProps.omega = ROTATION_OMEGA_MAX;
    } else {
      angleProps.stopAcc =
        1080 - angleProps.theta != 0
          ? -(angleProps.omega * angleProps.omega) /
            (2 * (1080 - angleProps.theta))
          : 0;
      angleProps.omega += angleProps.stopAcc * dt;
      if (angleProps.omega < 0) {
        angleProps.stopAcc = 0;
        angleProps.omega = 0;
        angleProps.theta = 0;
      }
    }
    angleProps.theta = (angleProps.theta + angleProps.omega * dt) % 1080;
  };

  let hornProps = {
    hasHorn: false,
    t: 0,
  };
  const updateHorn = (dt: number) => {
    if (hornProps.hasHorn && hornProps.t < 1) {
      hornProps.t += dt / BUBBLE_HORN_ANIMATION_DURATION;
      if (hornProps.t > 1) hornProps.t = 1;
    } else if (!hornProps.hasHorn && hornProps.t > 0) {
      hornProps.t -= dt / BUBBLE_HORN_ANIMATION_DURATION;
      if (hornProps.t < 0) hornProps.t = 0;
    }
  };
  // Interpolate function
  // Ref: http://marupeke296.com/TIPS_No19_interpolation.html
  // Cubic Hermite spline -> Denied
  // Ref: https://en.wikipedia.org/wiki/Cubic_Hermite_spline
  // Ref: https://tokoik.github.io/gg/ggnote04.pdf
  const getHornCoef = () => {
    const t = hornProps.t;
    return t * t * (3 - 2 * t);
  };
  const toggleHorn = (hasHorn: boolean) => (hornProps.hasHorn = hasHorn);

  const bubbleObject: TBubbleObject = {
    polygon,
    getPrev,
    setPrev,
    updateAngle,
    getAngle,
    getCurrentTarget,
    setCurrentTarget,
    updateHorn,
    getHornCoef,
  };

  requestAnimationFrame((dt) => _update(bubbleObject, dt));

  const adjustToElement = (query: string) =>
    _adjustToElement(bubbleObject, query);

  // let p = 0,
  //   v = 0;
  // for (let i = 0; i < 100; i++) {
  //   [p, v] = damping.moveToDestination(1, p, v, 1);
  //   // console.log(p, v);
  // }

  return {
    adjustToElement,
    toggleRotate,
    toggleHorn,
  };
};

const _getElementRect = (query: string): TRect => {
  const rect = document
    .querySelector<HTMLDivElement>(query)!
    .getBoundingClientRect();
  const x = rect.left + window.scrollX,
    y = rect.top + window.scrollY,
    w = rect.width,
    h = rect.height;
  return {
    x,
    y,
    w,
    h,
    cx: x + w / 2,
    cy: y + h / 2,
  };
};

const _rectToPointArray = (rect: TRect, hornCoef: number) => {
  const pa = new SVG.PointArray([
    [rect.x, rect.y],
    [rect.x + rect.w, rect.y],
    [
      rect.x + rect.w,
      rect.y + rect.h * (BUBBLE_HORN_POS_RATIO - BUBBLE_HORN_WIDTH_RATIO / 2),
    ],
    [
      rect.x + rect.w + BUBBLE_HORN_HEIGHT_PX * hornCoef,
      rect.y + rect.h * BUBBLE_HORN_POS_RATIO,
    ],
    [
      rect.x + rect.w,
      rect.y + rect.h * (BUBBLE_HORN_POS_RATIO + BUBBLE_HORN_WIDTH_RATIO / 2),
    ],
    [rect.x + rect.w, rect.y + rect.h],
    [rect.x, rect.y + rect.h],
  ]);
  return pa;
};

const _rectToPos = (rect: TRect) => {
  return [
    [rect.x, rect.y],
    [rect.x + rect.w, rect.y],
    [rect.x + rect.w, rect.y + rect.h],
    [rect.x, rect.y + rect.h],
  ];
};

const _posToRect = (pos: number[][]): TRect => {
  const x = pos[0][0],
    y = pos[0][1],
    w = pos[2][0] - pos[0][0],
    h = pos[2][1] - pos[0][1];
  return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
};

const _rectOnScreen = (_rect: TRect): TRect => {
  const rect = {
    x: _rect.x - window.scrollX,
    y: _rect.y - window.scrollY,
    w: _rect.w,
    h: _rect.h,
    cx: _rect.cx - window.scrollX,
    cy: _rect.cy - window.scrollY,
  };
  return rect;
};

const _adjustToElement = (bo: TBubbleObject, query: string) => {
  const targetRect = _getElementRect(query);
  bo.setCurrentTarget(targetRect);
};

let prev_t = 0;
const _update = (bo: TBubbleObject, t: number) => {
  const dt = t - prev_t;
  prev_t = t;

  bo.updateHorn(dt);
  bo.updateAngle(dt);
  const targetRect = bo.getCurrentTarget();
  const [p, v] = _calcCurrentRect(
    bo.getPrev()[0],
    bo.getPrev()[1],
    dt,
    _rectToPos(targetRect)
  );
  const rect = _rectOnScreen(_posToRect(p));
  const pointArray = _rectToPointArray(rect, bo.getHornCoef());
  bo.polygon.plot(pointArray);
  bo.polygon.transform({
    rotate: bo.getAngle(),
    origin: [rect.cx, rect.cy],
  });

  bo.setPrev(p, v);

  requestAnimationFrame((_t) => _update(bo, _t));
};

const _calcCurrentRect = (
  previous: number[][],
  velocity: number[][],
  dt: number,
  target: number[][]
) => {
  const p: number[][] = [];
  const v: number[][] = [];
  for (let i = 0; i < previous.length; i++) {
    const [x, vx] = damping.moveToDestination(
      dt,
      previous[i][0],
      velocity[i][0],
      target[i][0]
    );
    const [y, vy] = damping.moveToDestination(
      dt,
      previous[i][1],
      velocity[i][1],
      target[i][1]
    );
    p.push([x, y]);
    v.push([vx, vy]);
  }
  return [p, v];
};

export default {
  create,
};
