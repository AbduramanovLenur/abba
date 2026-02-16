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
});
