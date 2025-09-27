export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback();
  }
}

export async function loadTemplate(path) {
  const response = await fetch(path);
  if (response.ok) {
    return await response.text();
  }
  throw new Error("Failed to load template: " + path);
}

export async function loadHeaderFooter() {
  const header = await loadTemplate("/partials/header.html");
  const footer = await loadTemplate("/partials/footer.html");

  renderWithTemplate(header, document.getElementById("main-header"));
  renderWithTemplate(footer, document.getElementById("main-footer"));
}

export function alertMessage(
  messages,
  { type = "error", scroll = true, timeout = 5000 } = {},
) {
  const main = document.querySelector("main");

  let container = main.querySelector(".alert-list");
  if (!container) {
    container = document.createElement("section");
    container.classList.add("alert-list");
    main.prepend(container);
  }

  const msgs = Array.isArray(messages) ? messages : [messages];

  msgs.forEach((msg) => {
    const alert = document.createElement("div");
    alert.classList.add("alert", `alert--${type}`);

    const text = document.createElement("span");
    text.classList.add("alert__text");
    text.textContent = msg;

    const closeBtn = document.createElement("button");
    closeBtn.classList.add("alert__close");
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", () => alert.remove());

    alert.append(text, closeBtn);
    container.appendChild(alert);

    if (timeout > 0 && type === "success") {
      setTimeout(() => {
        if (alert.isConnected) alert.remove();
      }, timeout);
    }
  });

  if (scroll) window.scrollTo(0, 0);
}

export function removeAllAlerts() {
  const container = document.querySelector(".alert-list");
  if (container) container.remove();
}
