import * as SVG from "@svgdotjs/svg.js";
import ta0 from "../assets/svg/0.svg?raw";
import ta1 from "../assets/svg/1.svg?raw";
import ta2 from "../assets/svg/2.svg?raw";
import ta3 from "../assets/svg/3.svg?raw";
import ta4 from "../assets/svg/4.svg?raw";
import ta5 from "../assets/svg/2.svg?raw";
import ta6 from "../assets/svg/3.svg?raw";
import ta7 from "../assets/svg/4.svg?raw";

const WHITE = "#fff";
const ORANGE_100 = "#fff7f0";
const ORANGE_200 = "#ffd2ba";
const ORANGE_300 = "#ffc497";
const ORANGE_500 = "#dea747";
const ORANGE_700 = "#b38845";
const YELLOW_300 = "#ffe1a6";
const YELLOW_500 = "#ffe1a6";
const DURATION = 2000;
const COOLTIME = 1000;
const TA_SCALE = 200;
const TA_MARGIN_V = 200;
const TA_MARGIN_H = 200;
const TA_ROTATE = -3;
const TA_ANIMATION_DUR = 5000;

const taList = [ta0, ta1, ta2, ta3, ta4, ta5, ta6, ta7];

type TState = {
  bgGroup: SVG.G;
  // taGroup: SVG.G;
};
type TController = {
  getState: () => TState;
  setState: (state: TState) => TState;
};

const init = () => {
  const bgElem = document.getElementById("bg")!;
  const w = bgElem.clientWidth,
    h = bgElem.clientHeight;
  const svg = SVG.SVG().addTo(bgElem).size(w, h);
  const bgGroup = svg.group();
  bgGroup.rect(w, h).fill(ORANGE_200);

  // const grad = svg
  //   .gradient("linear", (add) => {
  //     add.stop(0, YELLOW_300);
  //     add.stop(0.25, YELLOW_500);
  //     add.stop(0.6, ORANGE_500);
  //     add.stop(1, ORANGE_700);
  //   })
  //   .from(0, 0)
  //   .to(0.1, 1);
  // const taSymbol = svg.symbol();
  // const taWrapper = taSymbol.group();
  // taWrapper.rotate(TA_ROTATE);
  // const taGroup = taWrapper.group();
  // for (let i = -1; i < window.innerHeight / TA_MARGIN_V; i++) {
  //   for (let j = -1; j < window.innerWidth / TA_MARGIN_H; j++) {
  //     const ta = taGroup.group();
  //     const taSVG = SVG.SVG().svg(ta1);
  //     ta.add(taSVG);
  //     ta.move(TA_MARGIN_V * j, TA_MARGIN_H * i);
  //   }
  // }
  // taGroup.animate(5000).dmove(0, -500);

  // const taColor = svg.rect(w, h).fill(grad);

  // const taMask = svg.group();
  // taMask.use(taSymbol).size(w, h).fill("#fff");
  // taColor.maskWith(taMask);
  // const taBorder = svg
  //   .use(taSymbol)
  //   .attr("fill", "transparent")
  //   .stroke({ color: WHITE, width: 2 });

  let state: TState = {
    bgGroup,
    // taGroup,
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
};

const _launchCircle = (ctrl: TController, pos: number[], w: number) => {
  const state = ctrl.getState();
  const bgGroup = state.bgGroup;
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

export default {
  init,
};
