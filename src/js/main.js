import { loadHeaderFooter } from "./utils.mjs";
import Alert from "./Alert.js";
import { initCartBadge } from "./cartBadge.mjs";

async function init() {
  await loadHeaderFooter();
  initCartBadge();
  const alerts = new Alert("/json/alerts.json");
  alerts.load();
}
init();
