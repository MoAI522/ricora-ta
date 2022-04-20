import * as SVG from "@svgdotjs/svg.js";

const BUBBLE_HORN_HEIGHT = 30;
const BUBBLE_HORN_WIDTH = 40;
const BUBBLE_HORN_TARGET_TOP_IN_DISPLAY = 0.7;
const BUBBLE_HORN_SHORTEN_RANGE = 40;
const BUBBLE_PADDING = 4;

type TBubble = {
  elem: HTMLElement;
  wrapperElem: HTMLElement;
  svg: SVG.Svg;
  polygon: SVG.Polygon;
};
type TState = {
  bubbles: Array<TBubble>;
};
type TController = {
  getState: () => TState;
  setState: (state: TState) => void;
};

const init = () => {
  const bubbleElems = Array.from(document.getElementsByClassName("bubble"));
  const bubbles: Array<TBubble> = bubbleElems.map((elem) => {
    const rect = elem.getBoundingClientRect();
    const svgWrapperElem = document.createElement("div");
    svgWrapperElem.style.position = "absolute";
    svgWrapperElem.style.top = -BUBBLE_PADDING + "px";
    svgWrapperElem.style.left = -BUBBLE_HORN_HEIGHT - BUBBLE_PADDING + "px";
    svgWrapperElem.style.width =
      rect.width + BUBBLE_HORN_HEIGHT + BUBBLE_PADDING * 2 + "px";
    svgWrapperElem.style.height = rect.height + BUBBLE_PADDING * 2 + "px";
    elem.prepend(svgWrapperElem);
    const svg = SVG.SVG()
      .addTo(svgWrapperElem)
      .size(svgWrapperElem.style.width, svgWrapperElem.style.height);
    const pointArray = new SVG.PointArray([
      [0, 0],
      [rect.width, 0],
      [rect.width, rect.height],
      [0, rect.height],
      [0, 0],
      [0, 0],
      [0, 0],
    ]);
    const polygon = svg
      .polygon(pointArray)
      .move(BUBBLE_HORN_HEIGHT + BUBBLE_PADDING, BUBBLE_PADDING)
      .fill("#fff")
      .stroke({ width: 6, color: "#000" });
    return {
      elem: elem as HTMLElement,
      wrapperElem: svgWrapperElem,
      svg,
      polygon,
    };
  });

  let state: TState = {
    bubbles: bubbles,
  };
  const getState = () => state;
  const setState = (_state: TState) => (state = _state);
  const ctrl: TController = {
    getState,
    setState,
  };
  window.requestAnimationFrame(() => _update(ctrl));
};

const _update = (ctrl: TController) => {
  const state = ctrl.getState();
  const hornTarget = window.innerHeight * BUBBLE_HORN_TARGET_TOP_IN_DISPLAY;
  for (const bubble of state.bubbles) {
    const rect = bubble.elem.getBoundingClientRect();
    const svgWrapperElem = bubble.wrapperElem;
    svgWrapperElem.style.top = -BUBBLE_PADDING + "px";
    svgWrapperElem.style.left = -BUBBLE_HORN_HEIGHT - BUBBLE_PADDING + "px";
    svgWrapperElem.style.width =
      rect.width + BUBBLE_HORN_HEIGHT + BUBBLE_PADDING * 2 + "px";
    svgWrapperElem.style.height = rect.height + BUBBLE_PADDING * 2 + "px";
    bubble.svg.size(svgWrapperElem.style.width, svgWrapperElem.style.height);
    const absTop = bubble.elem.offsetTop - window.scrollY;
    const hornCenter = Math.max(0, Math.min(hornTarget - absTop, rect.height));
    const hornHeight =
      (window.innerWidth >= 1024
        ? 1 -
          Math.max(
            0,
            Math.min(
              Math.max(
                absTop - hornTarget,
                hornTarget - (absTop + rect.height)
              ),
              BUBBLE_HORN_SHORTEN_RANGE
            )
          ) /
            BUBBLE_HORN_SHORTEN_RANGE
        : 0) * BUBBLE_HORN_HEIGHT;
    const pointArray = new SVG.PointArray([
      [0, 0],
      [rect.width, 0],
      [rect.width, rect.height],
      [0, rect.height],
      [0, Math.min(hornCenter + BUBBLE_HORN_WIDTH / 2, rect.height)],
      [-hornHeight, hornCenter],
      [0, Math.max(hornCenter - BUBBLE_HORN_WIDTH / 2, 0)],
    ]);
    bubble.polygon
      .plot(pointArray)
      .move(BUBBLE_HORN_HEIGHT - hornHeight + BUBBLE_PADDING, BUBBLE_PADDING);
  }

  window.requestAnimationFrame(() => _update(ctrl));
};

export default {
  init,
};
