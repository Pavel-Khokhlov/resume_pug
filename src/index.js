import _ from 'lodash';
import './dev/index.sass';
import Api from "./components/api.js";
import FormValidator from "./components/formValidator.js";
import scrollAnimation from "./components/scrollAnimation.js";

import {
  btnMenu,
  popupMenu,
  active,
  contactFormSelector,
  animationItems,
} from "./utils/constants.js";

import {
  TELEGRAM_API,
  TELEGRAM_BOT,
  TELEGRAM_CHAT_ID,
  TELEGRAM_TOKEN,
} from "./utils/parameters.js";

import PopupWithMenu from "./components/popupWithMenu.js";
import contactForm from "./components/contactForm.js";

const catchErr = (res) => {
  alert(`Server error: ${res.status}`);
};

// FORM VALIDATION
const contactFormValidator = new FormValidator(contactFormSelector);
contactFormValidator.enableValidation();

// API CONFIGURATION
const api = new Api({
  url: `${TELEGRAM_API}${TELEGRAM_BOT}:${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=`,
});

// fn to define position of element on the page
const getPosition = (el) => {
  let rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
};

// HANDLER OF NAVIGATION
function handleLinkClick(e) {
  e.preventDefault();
  // define section by name
  const section = document.querySelector(`#${e.target.name}`);
  // get position of this section
  const position = getPosition(section);
  // scroll to section position
  window.scrollTo({
    top: position.top,
    behavior: "smooth",
  });
}

// define all links on the page and set listeners
const navLinks = document.querySelectorAll(".nav__link");
navLinks.forEach((link) => link.addEventListener("click", handleLinkClick));

// HANDLER FORM
const formContact = new contactForm({
  handleFormSubmit: (value) => {
    // transform obj to string
    const message = Object.entries(value)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
    api
      .sendMessage(message)
      .then((res) => {
        console.log(res);
      })
      .then(() => contactFormValidator.handleFormReset())
      .catch(catchErr);
  },
});
formContact.setEventListeners();

// SHOW MENU POPUP
const menuPopup = new PopupWithMenu(popupMenu);
menuPopup.setEventListeners();

// function of handeler click menu
function handleMenuClick() {
  // close menu if menu has been alredy opened
  if (btnMenu.classList.contains(active)) {
    menuPopup.close(popupMenu);
  } else {
    menuPopup.open(popupMenu);
  }
}

if (animationItems.length > 0) {
  window.addEventListener("scroll", scrollAnimation);
  scrollAnimation();
  setTimeout(() => {
    scrollAnimation();
  }, 300);
}

// define listener for button menu
btnMenu.addEventListener("click", handleMenuClick);
