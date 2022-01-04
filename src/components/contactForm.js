import {
  contactFormSelector,
  inputSelector,
  nameInput,
  phoneInput,
  messageInput,
  resetButton,
} from "../utils/constants.js";

export default class contactForm {
  constructor({ handleFormSubmit }) {
    this._form = document.querySelector(contactFormSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._inputList = this._form.querySelectorAll(inputSelector);
    this._nameInput = nameInput;
    this._phoneInput = phoneInput;
    this._messageInput = messageInput;
    this._resetBtn = document.querySelector(resetButton);
  }

  _getInputValues() {
    this._formValues = {};

    this._inputList.forEach(
      (input) => (this._formValues[input.name] = input.value)
    );
    
    return this._formValues;
  }

  setEventListeners() {
    this._form.addEventListener("submit", (e) => {
      e.preventDefault();
      this._handleFormSubmit(this._getInputValues());
    });
  }
}
