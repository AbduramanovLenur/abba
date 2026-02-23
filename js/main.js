const adjustZoom = () => {
  const containerWidth = Number(
    getComputedStyle(document.documentElement)
      .getPropertyValue("--screen-width")
      .trim()
      .replace("px", ""),
  );

  const wrapper = document.querySelector(".wrapper");

  if (!wrapper || !containerWidth) return;

  if (window.innerWidth > 1024) {
    wrapper.style.zoom = (window.innerWidth / containerWidth).toString();
  } else {
    wrapper.style.zoom = "1";
  }
};

const initScrolledHeader = (
  headerSelector,
  scrolledSelector,
  modificatorSelector,
  offset = 0,
) => {
  const header = document.querySelector(headerSelector);

  if (header.classList.contains(modificatorSelector)) return;

  window.addEventListener("scroll", () => {
    header.classList.toggle(scrolledSelector, window.scrollY > offset);
  });
};

function closeAll(dropdowns, activeClass) {
  dropdowns.forEach((d) => d.classList.remove(activeClass));
}

function initDropdown({
  rootSelector,
  toggleSelector,
  itemSelector,
  selectedSelector,
  activeClass = "active",
}) {
  const dropdowns = document.querySelectorAll(rootSelector);

  if (!dropdowns.length) return;

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(toggleSelector);
    const items = dropdown.querySelectorAll(itemSelector);
    const selected = dropdown.querySelector(selectedSelector);

    if (!toggle || !items.length || !selected) return;

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAll(dropdowns, activeClass);
      dropdown.classList.toggle(activeClass);
    });

    items.forEach((item) => {
      item.addEventListener("click", () => {
        selected.textContent = item.dataset.value || item.textContent.trim();

        const img = item.querySelector("img");
        const toggleImg = toggle.querySelector("img");

        if (img && toggleImg) toggleImg.src = img.src;

        dropdown.classList.remove(activeClass);
      });
    });
  });

  document.addEventListener("click", () => closeAll(dropdowns, activeClass));
}

function initSwiper(selector, options = {}) {
  if (typeof Swiper === "undefined") {
    console.warn("Swiper не подключён");
    return null;
  }

  const slider = document.querySelector(selector);

  if (!slider) return null;

  const instance = new Swiper(selector, options);

  return instance;
}

const initFaqAccordion = (
  root,
  item,
  header,
  overlay,
  active,
  options = {},
) => {
  const faq = document.querySelector(root);

  if (!faq) return;

  const settings = {
    duration: 300,
    single: true,
    ...options,
  };

  const items = faq.querySelectorAll(item);

  if (!items.length) return;

  const setHeight = (el, value) => {
    el.style.height = value;
  };

  const open = (box, wrapper) => {
    box.classList.add(active);

    setHeight(wrapper, wrapper.scrollHeight + "px");

    wrapper.addEventListener(
      "transitionend",
      () => setHeight(wrapper, "auto"),
      { once: true },
    );
  };

  const close = (box, wrapper) => {
    setHeight(wrapper, wrapper.scrollHeight + "px");

    requestAnimationFrame(() => {
      setHeight(wrapper, "0px");
    });

    box.classList.remove(active);
  };

  const closeAll = (current) => {
    items.forEach((item) => {
      if (item !== current) {
        const wrapper = item.querySelector(overlay);

        if (!wrapper) return;

        close(item, wrapper);
      }
    });
  };

  items.forEach((box) => {
    const head = box.querySelector(header);
    const wrapper = box.querySelector(overlay);

    if (!head || !wrapper) return;

    head.addEventListener("click", () => {
      const isOpen = box.classList.contains(active);

      if (settings.single) closeAll(box);

      isOpen ? close(box, wrapper) : open(box, wrapper);
    });

    wrapper.style.transitionDuration = `${settings.duration}ms`;
  });
};

function initModal({
  modalSelector,
  openBtnSelector,
  closeBtnSelector,
  overlaySelector,
  mobileMenuSelector,
  activeClass = "is-open",
}) {
  const modal = document.querySelector(modalSelector);
  if (!modal) return;

  const overlay = modal.querySelector(overlaySelector);
  const closeBtn = modal.querySelector(closeBtnSelector);
  const openButtons = document.querySelectorAll(openBtnSelector);
  const menu = document.querySelector(mobileMenuSelector);

  const closeMobileMenu = () => {
    if (menu) menu.classList.remove(activeClass);
  };

  const open = () => {
    modal.classList.add(activeClass);
    document.body.style.overflow = "hidden";

    if (menu.classList.contains(activeClass)) {
      closeMobileMenu();
    }
  };

  const close = () => {
    modal.classList.remove(activeClass);
    document.body.style.overflow = "";
  };

  openButtons.forEach((btn) => {
    btn.addEventListener("click", open);
  });

  closeBtn?.addEventListener("click", close);

  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

function updateMapSrc() {
  const iframe = document.querySelector(".map__iframe iframe");
  if (!iframe) return;

  const width = window.innerWidth;

  if (width >= 1024) {
    iframe.src = iframe.dataset.desktopSrc;
  } else if (width >= 768) {
    iframe.src = iframe.dataset.tableSrc;
  } else if (width >= 320) {
    iframe.src = iframe.dataset.mobileSrc;
  }
}

function initMenuDropdown({
  overlaySelector,
  triggerSelector,
  dropdownSelector,
  subBoxSelector,
  subSubListSelector,
  bodyOpenClass,
  activeClass,
  subActiveClass,
}) {
  const triggers = document.querySelectorAll(triggerSelector);
  const body = document.body;

  if (!triggers.length) return;

  const closeMenu = () => {
    document.querySelectorAll(`.${activeClass}`).forEach((el) => {
      el.classList.remove(activeClass);
    });

    document.querySelectorAll(`.${subActiveClass}`).forEach((el) => {
      el.classList.remove(subActiveClass);
    });

    body.classList.remove(bodyOpenClass);
  };

  const closeAllSubMenus = () => {
    document.querySelectorAll(`.${subActiveClass}`).forEach((el) => {
      el.classList.remove(subActiveClass);
    });
  };

  triggers.forEach((trigger) => {
    const parent = trigger.closest(overlaySelector);
    const dropdown = parent?.querySelector(dropdownSelector);

    if (!dropdown) return;

    trigger.addEventListener("mouseenter", () => {
      closeMenu();
      dropdown.classList.add(activeClass);
      body.classList.add(bodyOpenClass);

      const subBoxes = parent.querySelectorAll(subBoxSelector);

      if (subBoxes.length) {
        subBoxes.forEach((subBox) => {
          subBox.addEventListener("mouseenter", () => {
            closeAllSubMenus();

            const subSubList = subBox.querySelector(subSubListSelector);
            if (subSubList) {
              subSubList.classList.add(subActiveClass);
            }
          });
        });
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!body.classList.contains(bodyOpenClass)) return;

    const isInsideMenu = e.target.closest(triggerSelector);
    const isInsideDropdown = e.target.closest(dropdownSelector);

    if (isInsideMenu || isInsideDropdown) return;

    closeMenu();
  });

  window.addEventListener("scroll", () => {
    if (!body.classList.contains(bodyOpenClass)) return;
    closeMenu();
  });
}

const initPositionSubSubMenu = ({
  subListSelector,
  subSubListSelector,
  subBoxSelector,
}) => {
  const subMenuList = document.querySelectorAll(subListSelector);
  if (!subMenuList.length) return;

  const calculatePositions = () => {
    subMenuList.forEach((subMenu) => {
      const subSubMenuList = subMenu.querySelectorAll(subSubListSelector);
      const subBoxList = subMenu.querySelectorAll(subBoxSelector);

      if (!subSubMenuList.length) return;

      subSubMenuList.forEach((subSubMenu, index) => {
        const subBoxListArray = Array.from(subBoxList);
        const width = subBoxListArray.reduce((acc, el, i) => {
          if (i < index) {
            return acc + el.offsetWidth;
          }
          return acc;
        }, 0);

        subSubMenu.style.top = `${subMenu.offsetHeight}px`;
        subSubMenu.style.left = `-${width + 10}px`;
      });
    });
  };

  calculatePositions();

  if (document.readyState === "complete") {
    calculatePositions();
  } else {
    window.addEventListener("load", calculatePositions);
  }

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(calculatePositions, 100);
  });
};

const initMobileModal = (openSelector, closeSelector, overlaySelector) => {
  const openBtn = document.querySelector(openSelector);
  const closeBtn = document.querySelector(closeSelector);
  const overlay = document.querySelector(overlaySelector);

  if (!openBtn || !closeBtn || !overlay) return;

  openBtn.addEventListener("click", () => {
    overlay.classList.add("is-open");
  });

  closeBtn.addEventListener("click", () => {
    overlay.classList.remove("is-open");
  });
};

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");

  window.addEventListener("resize", adjustZoom);
  window.addEventListener("load", adjustZoom);
  adjustZoom();

  initScrolledHeader(".header", "is-changed", "header--not-scroll", 100);

  initDropdown({
    rootSelector: ".dropdown",
    toggleSelector: ".dropdown__toggle",
    itemSelector: ".dropdown__item",
    selectedSelector: ".dropdown__selected",
  });

  initSwiper(".categories-swiper", {
    slidesPerView: "auto",
    spaceBetween: 8,
    freeMode: true,
  });

  initFaqAccordion(
    ".faq",
    ".faq__box",
    ".faq__head",
    ".faq__wrapper",
    "is-open",
    {
      single: true,
      duration: 400,
    },
  );

  initModal({
    modalSelector: ".callback-modal",
    openBtnSelector: "[data-js-button-modal]",
    closeBtnSelector: ".callback-modal__close",
    overlaySelector: ".callback-modal__overlay",
    mobileMenuSelector: ".mobile-modal",
  });

  updateMapSrc();
  window.addEventListener("resize", updateMapSrc);

  initSwiper(".main-news__swiper", {
    slidesPerView: 4,
    spaceBetween: 24,
    freeMode: true,
    navigation: {
      nextEl: ".main-news__button-next",
      prevEl: ".main-news__button-prev",
    },
    breakpoints: {
      1025: {
        slidesPerView: 4,
      },
      769: {
        slidesPerView: 3,
      },
      482: {
        slidesPerView: 2,
      },
      320: {
        slidesPerView: 1,
      },
    },
  });
  initSwiper(".main-intro__swiper", {
    slidesPerView: 1,
    pagination: {
      el: ".main-intro__pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".main-intro__button-next",
      prevEl: ".main-intro__button-prev",
    },
  });

  initMenuDropdown({
    triggerSelector: "[data-js-button-menu]",
    overlaySelector: ".header__box",
    dropdownSelector: ".header__sub-list",
    subBoxSelector: ".header__sub-box",
    subSubListSelector: ".header__sub-sub-list",
    bodyOpenClass: "is-open-menu",
    activeClass: "is-open",
    subActiveClass: "is-open-sub",
  });

  initPositionSubSubMenu({
    subListSelector: ".header__sub-list",
    subSubListSelector: ".header__sub-sub-list",
    subBoxSelector: ".header__sub-box",
  });

  initMobileModal(".header__burger", ".mobile-modal__close", ".mobile-modal");

  initFaqAccordion(
    "[data-js-modal-list]",
    "[data-js-modal-box]",
    "[data-js-modal-head]",
    "[data-js-modal-wrapper]",
    "is-open",
    {
      single: true,
      duration: 400,
    },
  );

  initFaqAccordion(
    "[data-js-modal-sub-list]",
    "[data-js-modal-sub-box]",
    "[data-js-modal-sub-head]",
    "[data-js-modal-sub-wrapper]",
    "is-open",
    {
      single: true,
      duration: 400,
    },
  );
});
