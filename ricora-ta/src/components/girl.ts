import anime from "animejs";

const ANIMATION_POINT_OFFSET = 100;

type TGirlState = {
  appearance: "exist" | "out";
};
type TAnimation = {
  targetState: TGirlState;
  animType: "bounceIn" | "bounceOut";
};
type TQueue = Array<TAnimation>;
type TGirl = {
  elem: HTMLElement;
  currentGirlState: TGirlState;
  queue: TQueue;
  animating: TAnimation | null;
};
type TState = {
  title: TGirl;
  middle: TGirl;
  prevSY: number;
  animPoints: Array<number>;
};
type TController = {
  getState: () => TState;
  setState: (state: TState) => TState;
};

const init = () => {
  const tGirlElem = document.getElementById("title_girl")!;
  const mGirlElem = document.getElementById("middle_girl")!;

  const currSY = window.scrollY;
  const tElem = document.getElementById("title")!;
  const tlElem = document.getElementById("tracklist")!;
  const animPoints = [
    tElem.offsetTop + ANIMATION_POINT_OFFSET,
    tlElem.offsetTop + ANIMATION_POINT_OFFSET,
  ];

  let state: TState = {
    title: {
      elem: tGirlElem,
      currentGirlState: {
        appearance: "out",
      },
      queue: [],
      animating: null,
    },
    middle: {
      elem: mGirlElem,
      currentGirlState: {
        appearance: "out",
      },
      queue: [],
      animating: null,
    },
    prevSY: currSY,
    animPoints,
  };
  const getState = () => state;
  const setState = (_state: TState) => (state = _state);
  const ctrl: TController = {
    getState,
    setState,
  };
  window.requestAnimationFrame(() => _update(ctrl));

  return () => _start(ctrl);
};

const _update = (ctrl: TController) => {
  let state = ctrl.getState();
  state = _checkPosition(state);
  state = _branchQueue(state);
  state = _executeAnimation(state, ctrl);
  ctrl.setState(state);

  window.requestAnimationFrame(() => _update(ctrl));
};

const _checkPosition = (state: TState) => {
  const currSY = window.scrollY;
  const prevSY = state.prevSY;
  const tQueue = state.title.queue;
  const mQueue = state.middle.queue;
  const animPoints = state.animPoints;

  const fn = (a: number, b: number, p: number) =>
    a < p && b >= p ? 1 : a >= p && b < p ? -1 : 0;

  if (fn(prevSY, currSY, animPoints[0]) == 1) {
    tQueue.push({
      // target: "title",
      targetState: {
        appearance: "out",
        // mouth: "close",
      },
      animType: "bounceOut",
    });
    mQueue.push({
      // target: "middle",
      targetState: {
        appearance: "exist",
        // mouth: "close",
      },
      animType: "bounceIn",
    });
  } else if (fn(prevSY, currSY, animPoints[0]) == -1) {
    mQueue.push({
      // target: "middle",
      targetState: {
        appearance: "out",
        // mouth: "close",
      },
      animType: "bounceOut",
    });
    tQueue.push({
      // target: "title",
      targetState: {
        appearance: "exist",
        // mouth: "open",
      },
      animType: "bounceIn",
    });
  }

  return { ...state, queue: tQueue, prevSY: currSY };
};

const _branchQueue = (state: TState) => {
  const { title, middle } = state;
  for (const { queue, animating } of [title, middle]) {
    if (animating === null) return state;

    while (true) {
      for (let i = 0; i < queue.length; i++) {
        if (
          // queue[i].target == animating.target &&
          queue[i].targetState.appearance == animating.targetState.appearance //&&
          // queue[i].targetState.mouth == animating.targetState.mouth
        ) {
          queue.splice(0, i + 1);
        }
      }
      break;
    }
  }

  return { ...state, title, middle };
};

const _executeAnimation = (state: TState, ctrl: TController) => {
  let _state = { ...state };
  for (const target of ["title", "middle"] as Array<"title" | "middle">) {
    const { animating: _animating, queue, elem } = _state[target] as TGirl;
    if (_animating !== null) continue;
    if (queue.length == 0) continue;
    const animating = queue.shift()!;

    const complete = () => {
      ctrl.setState({
        ...ctrl.getState(),
        [target]: {
          ...ctrl.getState()[target],
          currentGirlState: animating.targetState,
          animating: null,
        },
      });
    };

    let easingFunc: string;
    let translateY: Array<number>;

    switch (animating.animType) {
      case "bounceIn": {
        easingFunc = "easeOutBack";
        translateY = [elem.getBoundingClientRect().height, 0];
        break;
      }
      case "bounceOut": {
        easingFunc = "easeOutQuad";
        translateY = [0, elem.getBoundingClientRect().height];
        break;
      }
      default:
        continue;
    }

    anime({
      targets: elem,
      translateY,
      duration: 500,
      easing: easingFunc,
      complete,
    });

    _state[target] = { ..._state[target], queue, animating };
  }
  return _state;
};

const _start = (ctrl: TController) => {
  const state = ctrl.getState();
  const tQueue = state.title.queue;
  const mQueue = state.middle.queue;
  tQueue.push({
    targetState: {
      appearance: "exist",
    },
    animType: "bounceIn",
  });
  ctrl.setState({
    ...state,
    title: { ...state.title, queue: tQueue },
    middle: { ...state.middle, queue: mQueue },
  });
};

export default {
  init,
};
