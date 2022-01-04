import Popup from "./popup.js";
import { btnMenu, active } from "../utils/constants.js";

export default class PopupWithMenu extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
  }

  open() {
    super.open();
    btnMenu.classList.add(active)
  }

  close() {
    super.close();
    btnMenu.classList.remove(active)
  }

  setEventListeners() {
    super.setEventListeners();
  }
}
