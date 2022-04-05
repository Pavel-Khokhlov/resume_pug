import {
  animationItems,
} from "../utils/constants.js";

function scrollAnimation() {
  animationItems.forEach((el) => {
    const itemHeight = el.offsetHeight;
    const itemOffset = el.offsetTop;
    const animationStart = 4;
    // define the start point of animation
    let animationItemPoint = window.innerHeight - itemHeight / animationStart;
    if (itemHeight > window.innerHeight) {
      animationItemPoint =
        window.innerHeight - window.innerHeight / animationStart;
    }

    if (
      window.scrollY > itemOffset - animationItemPoint &&
      window.scrollY < itemOffset + itemHeight
    ) {
      el.classList.add("_active");
    } else {
      // check the animation is present one time
      if (!el.classList.contains("stop_animation")) {
        el.classList.remove("_active");
      }
    }
  });
}

export default scrollAnimation;
