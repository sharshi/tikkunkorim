import Game from "./scripts/game";
import Game from "./scripts/game";
// import "./styles/reset.scss";

document.addEventListener("DOMContentLoaded", () => {
  game.init();
  document.addEventListener("backbutton", onBackKeyDown, false);
});

function onBackKeyDown() {
  goback();
}
