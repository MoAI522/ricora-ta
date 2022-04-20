import background from "./components/background";
import bubble from "./components/bubble";
import girl from "./components/girl";
import "./style.css";
import anime from "animejs";

const init = async () => {
  await background.load();
  const girlAnimStartFunc = girl.init();
  bubble.init();
  background.init();
  window.scroll(0, 0);
  document.getElementById("screen-top")!.style.opacity = "0";
  girlAnimStartFunc();
  animateLogo();
};

const animateLogo = () => {
  const logoElem = document.getElementById("title_logo");
  anime({
    targets: logoElem,
    scaleX: [0.1, 1],
    scaleY: [3, 1],
    translateX: [100, 0],
    opacity: [0, 1],
    duration: 700,
    delay: 400,
  });
};

init();
