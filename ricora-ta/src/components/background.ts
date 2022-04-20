import * as SVG from "@svgdotjs/svg.js";
import taWallSrc from "../resources/ta_wall.png";

const WHITE = "#fff";
const ORANGE_300 = "#ffc497";
const DURATION = 2000;
const COOLTIME = 300;
const TA_MARGIN_H = 1380;
const TA_ROTATE = -14;
const TA_SCROLL_SPEED = 0.1;
const TA_OFFSETS = [-1000, -500];

type TState = {
  waveGroup: SVG.G;
  ctx: CanvasRenderingContext2D;
};
type TController = {
  getState: () => TState;
  setState: (state: TState) => TState;
};

let taImg: HTMLImageElement;

const load = () =>
  new Promise((resolve) => {
    taImg = new Image();
    taImg.onload = () => {
      resolve("");
    };
    taImg.src = taWallSrc;
  });

const init = () => {
  const bgElem = document.getElementById("bg")!;
  const w = bgElem.clientWidth,
    h = bgElem.clientHeight;
  const svg = SVG.SVG().addTo(bgElem).size(w, h);
  const waveGroup = svg.group();

  const canvasElem = document.createElement("canvas");
  canvasElem.width = bgElem.clientWidth;
  canvasElem.height = bgElem.clientHeight;
  canvasElem.style.position = "absolute";
  canvasElem.style.top = "0";
  canvasElem.style.left = "0";
  canvasElem.style.width = "100%";
  canvasElem.style.height = "100%";
  bgElem.appendChild(canvasElem);
  const ctx = canvasElem.getContext("2d")!;

  let state: TState = {
    waveGroup,
    ctx,
  };
  const getState = () => state;
  const setState = (_state: TState) => (state = _state);
  const ctrl: TController = { getState, setState };
  const randomLaunch = () => {
    const pos = [
      Math.random() * window.innerWidth,
      Math.random() * window.innerHeight,
    ];
    const w = Math.random() * 2000 + 100;
    _launchCircle(ctrl, pos, w);
    const time = Math.random() * 5000 + 500;
    window.setTimeout(randomLaunch, time);
  };
  randomLaunch();

  let nextUnlockTime = 0;
  window.addEventListener("click", (e) => {
    const timestamp = new Date().getTime();
    if (nextUnlockTime > timestamp) return;
    const pos = [e.clientX, e.clientY];
    const w = Math.random() * 2000 + 100;
    _launchCircle(ctrl, pos, w);
    nextUnlockTime = timestamp + COOLTIME;
  });

  requestAnimationFrame((t) => _update(ctrl, t));
};

const _launchCircle = (ctrl: TController, pos: number[], w: number) => {
  const state = ctrl.getState();
  const bgGroup = state.waveGroup;
  const l =
    Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) + w * 0.5;
  const c = bgGroup
    .circle(0)
    .center(pos[0], pos[1])
    .fill(ORANGE_300)
    .stroke({ color: WHITE, width: 0 });
  const m = bgGroup
    .circle(0)
    .center(pos[0], pos[1])
    .stroke({ color: "#fff", width: 0 });
  c.maskWith(m);
  m.animate(DURATION, 0, "now")
    .ease(">")
    .attr("r", l.toString())
    .animate(DURATION / 2, 0, "now")
    .ease(">")
    .attr("stroke-width", w.toString());
  c.animate(DURATION, 0, "now")
    .ease(">")
    .attr("r", l.toString())
    .animate(DURATION / 2, 0, "now")
    .ease(">")
    .attr("stroke-width", (w * 0.1).toString());
  window.setTimeout(() => {
    c.remove();
    m.remove();
  }, DURATION);
};

const _update = (ctrl: TController, time: number) => {
  const state = ctrl.getState();
  const ctx = state.ctx;

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  const rad = (TA_ROTATE / 180) * Math.PI;
  const scrollH = (time * TA_SCROLL_SPEED) % TA_MARGIN_H;
  for (let j = -1; j < 2; j++) {
    const basePos = [TA_MARGIN_H * j + scrollH + TA_OFFSETS[0], TA_OFFSETS[1]];
    const pos = [
      basePos[0] * Math.cos(rad) - basePos[1] * Math.sin(rad),
      basePos[0] * Math.sin(rad) + basePos[1] * Math.cos(rad),
    ];
    ctx.drawImage(taImg, pos[0], pos[1]);
  }
  requestAnimationFrame((t) => _update(ctrl, t));
};

export default {
  load,
  init,
};
