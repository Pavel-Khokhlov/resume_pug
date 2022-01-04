import { popup, active, popupClose } from "../utils/constants.js";

export default class Popup {
  constructor(popupSelector) {
    this._popup = document.querySelector(popupSelector);
    this.close = this.close.bind(this);
    this._overlayElement = null;
    this.handleEscClose = this.handleEscClose.bind(this);
  }

  open() {
    this._popup.classList.add(active);
    document.body.style.overflow = "hidden"; // OFF SCROLL
    document.addEventListener("keydown", this.handleEscClose);
  }

  close() {
    this._popup.classList.remove(active);
    document.body.style.overflow = "visible"; // ON SCROLL
    document.removeEventListener("keydown", this.handleEscClose);
  }

  handleEscClose(e) {
    if (e.key === "Escape") {
      this.close();
    }
  }

  _handleOverlayClose(e) {
    if (e.target === e.currentTarget) {
      this.close();
    }
  }

  setEventListeners() {
    // CLOSE BY BUTTON
    const closePopup = this._popup.querySelectorAll(popupClose);
    closePopup.forEach((btn) => {
      btn.addEventListener("click", this.close);
    });
    // CLOSE BY OVERLAY
    this._overlayElement = this._popup.closest(popup);
    this._overlayElement.addEventListener(
      "click",
      this._handleOverlayClose.bind(this)
    );
  }
}
