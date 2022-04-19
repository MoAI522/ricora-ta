import girl from "./components/girl";
import "./style.css";

const preprocess = () => {};

const onload = () => {
  window.scroll(0, 0);
  girl.init();
};

preprocess();
window.onload = onload;
