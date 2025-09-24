export default class Alert {
  constructor(jsonPath = "/json/alerts.json") {
    this.jsonPath = jsonPath;
  }

  async load() {
    try {
      const response = await fetch(this.jsonPath);
      if (!response.ok) {
        throw new Error("Could not load alerts.json");
      }
      const alerts = await response.json();
      this.render(alerts);
    } catch (err) {
      console.error("Error loading alerts:", err);
    }
  }

  render(alerts) {
    if (!alerts || alerts.length === 0) return;

    const section = document.createElement("section");
    section.classList.add("alert-list");

    alerts.forEach((alertObj) => {
      const p = document.createElement("p");
      p.textContent = alertObj.message;
      p.style.backgroundColor = alertObj.background;
      p.style.color = alertObj.color;
      section.appendChild(p);
    });

    const main = document.querySelector("main");
    if (main) {
      main.prepend(section);
    }
  }
}
