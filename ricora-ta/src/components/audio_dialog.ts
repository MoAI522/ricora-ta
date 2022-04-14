const init = () => {
  const buttonElem =
    document.querySelector<HTMLButtonElement>("#accept_button")!;
  buttonElem.addEventListener("click", () => {
    buttonElem.style.opacity = "0";

    const textElem =
      document.querySelector<HTMLDivElement>("#audio_dialog_text")!;
    textElem.style.opacity = "0";
    textElem.style.transform = "translateY(-10px)";
  });
};

export default {
  init,
};
