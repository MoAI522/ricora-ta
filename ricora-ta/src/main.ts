import background from "./components/background";
import bubble from "./components/bubble";
import girl from "./components/girl";
import "./style.css";

const preprocess = () => {};

const onload = () => {
  window.scroll(0, 0);
  girl.init();
  bubble.init();
  background.init();
};

preprocess();
window.onload = onload;
