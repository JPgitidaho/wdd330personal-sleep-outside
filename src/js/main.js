import { loadHeaderFooter } from "./utils.mjs";
import Alert from "./Alert.js";

const alerts = new Alert("/json/alerts.json");
alerts.load();

loadHeaderFooter();
