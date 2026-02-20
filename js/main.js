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
        close(item, wrapper);
      }
    });
  };

  items.forEach((box) => {
    const head = box.querySelector(header);
    const wrapper = box.querySelector(overlay);

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
  activeClass = "is-open",
}) {
  const modal = document.querySelector(modalSelector);
  if (!modal) return;

  const overlay = modal.querySelector(overlaySelector);
  const closeBtn = modal.querySelector(closeBtnSelector);
  const openButtons = document.querySelectorAll(openBtnSelector);

  const open = () => {
    modal.classList.add(activeClass);
    document.body.style.overflow = "hidden";
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
});
