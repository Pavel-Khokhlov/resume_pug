// ВСЕГДА импортируйте стили в самом начале файла
import 'normalize.css/normalize.css';
import './dev/index.sass';

// Создаем стиль для предотвращения мерцания
const antiFlickerStyle = document.createElement('style');
antiFlickerStyle.textContent = `
  body * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    opacity: 0.99;
  }
  
  body.preload-finished * {
    animation-duration: initial !important;
    animation-iteration-count: initial !important;
    transition-duration: initial !important;
    opacity: 1;
  }
`;
document.head.appendChild(antiFlickerStyle);

// Только после стилей импортируйте JS модули
import { onDocumentReady, importAll } from './function';
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
import { getScrollPosition } from './components/scrolling';

// Ждем полной загрузки DOM
onDocumentReady(function () {
  console.log('DOM загружен');
  
  // Импорт медиафайлов
  importAll(
    require.context(
      './dev/images',
      true,
      /\.(png|svg|jpg|jpe?g|gif|mov|mp4|ico|webmanifest|xml)$/
    )
  );
  
  // Инициализация приложения
  initApp();
});

// Функция инициализации приложения
function initApp() {
  // Ждем немного для применения всех стилей
  setTimeout(() => {
    // Убираем anti-flicker стили
    document.body.classList.add('preload-finished');
    
    // Основная инициализация
    initializeComponents();
    
    // Запускаем начальную анимацию
    initialAnimations();
  }, 50);
}

function initializeComponents() {
  const catchErr = (res) => {
    console.error(`Server error: ${res.status}`);
    alert(`Ошибка сервера: ${res.status}`);
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
    
    if (!e.target.name) {
      console.warn('Навигационная ссылка без атрибута name', e.target);
      return;
    }
    
    const section = document.querySelector(`#${e.target.name}`);
    
    if (!section) {
      console.warn(`Секция с id="${e.target.name}" не найдена`);
      return;
    }
    
    const position = getPosition(section);
    window.scrollTo({
      top: position.top,
      behavior: "smooth",
    });
    
    if (btnMenu && btnMenu.classList.contains(active)) {
      menuPopup.close(popupMenu);
    }
  }

  // HANDLER FORM
  const formContact = new contactForm({
    handleFormSubmit: (value) => {
      const message = Object.entries(value)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
      api
        .sendMessage(message)
        .then((res) => {
          console.log('Сообщение отправлено:', res);
        })
        .then(() => contactFormValidator.handleFormReset())
        .catch(catchErr);
    },
  });
  formContact.setEventListeners();

  // SHOW MENU POPUP
  const menuPopup = new PopupWithMenu(popupMenu);
  menuPopup.setEventListeners();

  // function of handler click menu
  function handleMenuClick() {
    if (btnMenu.classList.contains(active)) {
      menuPopup.close(popupMenu);
    } else {
      menuPopup.open(popupMenu);
    }
  }

  // define listener for button menu
  if (btnMenu) {
    btnMenu.addEventListener("click", handleMenuClick);
  }
  
  // define all links on the page and set listeners
  const navLinks = document.querySelectorAll(".nav__link");
  navLinks.forEach((link) => link.addEventListener("click", handleLinkClick));

  // Слушатель скролла для позиционирования
  window.addEventListener('scroll', getScrollPosition);
  getScrollPosition();
}

function initialAnimations() {
  // Анимация скролла
  if (animationItems && animationItems.length > 0) {
    window.addEventListener("scroll", scrollAnimation);
    
    // Несколько вызовов для гарантии
    requestAnimationFrame(() => {
      scrollAnimation();
    });
    
    setTimeout(() => {
      scrollAnimation();
    }, 100);
    
    setTimeout(() => {
      scrollAnimation();
    }, 500);
  }
}

// Обработчик полной загрузки страницы
window.addEventListener('load', () => {
  console.log('Страница полностью загружена');
  
  // Финальная проверка анимаций
  if (animationItems && animationItems.length > 0) {
    setTimeout(() => {
      scrollAnimation();
    }, 300);
  }
  
  // Удаляем anti-flicker стиль после полной загрузки
  setTimeout(() => {
    if (antiFlickerStyle.parentNode) {
      antiFlickerStyle.parentNode.removeChild(antiFlickerStyle);
    }
    document.body.classList.add('page-loaded');
  }, 1000);
});

// Фолбэк на случай проблем с загрузкой
setTimeout(() => {
  if (!document.body.classList.contains('preload-finished')) {
    document.body.classList.add('preload-finished');
    console.log('Принудительное завершение прелоада по таймауту');
  }
}, 5000);