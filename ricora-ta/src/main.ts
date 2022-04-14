import "./style.css";
import bubble from "./components/bubble";
import audio_dialog from "./components/audio_dialog";

const main = () => {
  const bubbleCtrl = bubble.create("#accept_button");
  audio_dialog.init();
};

window.onload = main;
