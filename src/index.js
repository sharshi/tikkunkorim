import { israelParshaCal, chulParshaCal } from "./js/parshaCal";
import { seforim, aliyanames, parshios, aliyos, tikun } from "./js/parshaData";
// TODO: all images should load dynamically
import "./css/css.css";

document.addEventListener("DOMContentLoaded", () => {

  document.addEventListener("backbutton", onBackKeyDown, false);
});

function onBackKeyDown() {
  goback();
}
