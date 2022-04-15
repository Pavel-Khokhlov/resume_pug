import {
  inputElement,
  inputSelector,
  errorSelector,
  submitButton,
  resetButton,
  active,
} from "../utils/constants.js";
import { REG_NAME, REG_EMAIL, REG_PHONE } from "../utils/parameters.js";

export default class FormValidator {
  constructor(formSelector) {
    this._formSelector = formSelector;
    this._formElement = document.querySelector(formSelector);
    this._inputElement = inputElement;
    this._inputSelector = inputSelector;
    this._errorSelector = errorSelector;
    this._submitButton = submitButton;
    this._resetButton = resetButton;
    this._active = active;
    this._inputArray = this._formElement.querySelectorAll(this._inputSelector);
    this._submitBtn = this._formElement.querySelector(this._submitButton);
    this._resetBtn = this._formElement.querySelector(this._resetButton);
    this._errorMessage = { name: null, contact: null, message: null };
  }

  // Fn to hide error message
  _eraseInputError() {
    const errorsArray = this._formElement.querySelectorAll(this._errorSelector);
    errorsArray.forEach((i) => (i.innerText = ""));
  }

  // Fn to show error message
  _showInputError(inputElement, errorMessage) {
    this._errorMessage = {
      ...this._errorMessage,
      [inputElement.name]: errorMessage,
    };
    const errorElement = inputElement.nextElementSibling;
    errorElement.innerText = errorMessage;
  }

  // Form Validator
  _validateForm(inputList) {
    if (inputList.some((i) => i.value !== ""))
      this._resetBtn.classList.add(this._active);

    this._errorMessage.name === "" &&
    this._errorMessage.contact === "" &&
    this._errorMessage.message === ""
      ? this._submitBtn.classList.add(this._active)
      : this._submitBtn.classList.remove(this._active);
  }

  // Функция проверки ввода на ошибку
  _checkInputValidity(inputElement) {
    if (inputElement.name === "name") {
      if (inputElement.value.length === 0) return "Name is required";
      if (!REG_NAME.test(inputElement.value))
        return "Enter only letters, space or -, _.";
      if (inputElement.value.length < 2)
        return "Name must be more than 2 characters";
      return "";
    }

    if (inputElement.name === "contact") {
      if (inputElement.value.length === 0) return "Phone or e-mail is required";
      if (
        !(
          REG_PHONE.test(inputElement.value) ||
          REG_EMAIL.test(inputElement.value)
        )
      )
        return "Enter correct phone or e-mail";
      return "";
    }

    if (inputElement.name === "message") {
      if (inputElement.value.length === 0) return "Message is required";
      if (inputElement.value.length < 10)
        return "Name must be more than 10 characters";
      return "";
    }
  }

  handleFormReset() {
    this._formElement.reset();
    this._resetBtn.classList.remove(this._active);
    this._submitBtn.classList.remove(this._active);
    this._errorMessage = { name: null, contact: null, message: null };
    this._eraseInputError();
  }

  // Функция установки обработчиков события
  _setEventListeners() {
    const inputList = Array.from(
      this._formElement.querySelectorAll(this._inputSelector)
    );
    inputList.forEach((inputElement) => {
      inputElement.addEventListener("input", () => {
        const errorMessage = this._checkInputValidity(inputElement);
        this._showInputError(inputElement, errorMessage);
        this._validateForm(inputList);
      });
    });
    this._resetBtn.addEventListener("click", () => {
      this.handleFormReset();
    });
  }

  // Функция проверки валидации формы
  enableValidation() {
    this._formElement.addEventListener("submit", (e) => e.preventDefault());
    this._setEventListeners();
  }
}
