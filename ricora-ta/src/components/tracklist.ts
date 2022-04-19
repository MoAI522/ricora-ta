import tracklist from "../assets/json/tracklist.json";

const init = () => {
  const containerElem = document.getElementById("tracklist_container")!;
  const tlfrag = document.createDocumentFragment();
  for (const track of tracklist) {
    const trackElem = document.createElement("div");
    trackElem.innerHTML = `
      <div class="flex items-end">
        <div class="flex flex-col flex-1">
          <div class="text-3xl mb-2">
            <span class="text-red-500 font-bold">${track.title_ta}</span>${
      track.title
    }
            <span class="ml-1 text-xl font-ipa"
              >[<span class="text-red-500 font-bold">ta</span>${track.pronounciation.slice(
                2
              )}]</span
            >
          </div>
          <div class="flex">
            <div class="text-xl">${track.composer}</div>
          </div>
        </div>
        <div class="flex">
        ${
          track.twitter !== null
            ? `
          <a
            class="w-[40px] h-[40px] cursor-pointer"
            href="${track.twitter}"
            ><img
              src="./resources/sns/twiiter.svg"
              alt="twitter icon"
              class="w-full"
          /></a>`
            : ""
        }
          ${
            track.other !== null
              ? `
          <a
            class="w-[40px] h-[40px] flex justify-center items-center cursor-pointer ml-4"
            href="${track.other.href}"
            ><img
              src="./resources/sns/${track.other.service}.png"
              alt="${track.other.service + " icon"}"
              class="w-full"
          /></a>`
              : ""
          }
        </div>
      </div>`;
    tlfrag.appendChild(trackElem);
  }
  containerElem.appendChild(tlfrag);
};

export default {
  init,
};
