import {
  contactFormSelector,
  inputSelector,
  resetButton,
} from "../utils/constants.js";

export default class contactForm {
  constructor({ handleFormSubmit }) {
    this._form = document.querySelector(contactFormSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._inputList = this._form.querySelectorAll(inputSelector);
    this._resetBtn = document.querySelector(resetButton);
  }

  _getInputValues() {
    this._formValues = {};

    this._inputList.forEach((input) => {
      let value = input.value;
      input.name !== "name"
        ? (this._formValues[input.name] = value)
        : (this._formValues[input.name] =
            value.charAt(0).toUpperCase() + value.slice(1)); // set first letter to uppercase
    });

    return this._formValues;
  }

  setEventListeners() {
    this._form.addEventListener("submit", (e) => {
      e.preventDefault();
      this._handleFormSubmit(this._getInputValues());
    });
  }
}
