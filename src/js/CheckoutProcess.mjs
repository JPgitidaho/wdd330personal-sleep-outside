import { alertMessage, getLocalStorage } from "./utils.mjs";
import { postCheckout } from "./ExternalServices.mjs";

export default class CheckoutProcess {
  constructor(formElement, services = { checkout: postCheckout }) {
    this.form = formElement;
    this.services = services;
  }
  payload() {
    const formData = new FormData(this.form);
    const order = Object.fromEntries(formData.entries());
    order.items = getLocalStorage("so-cart") || [];
    return order;
  }
  async checkout() {
    try {
      const result = await this.services.checkout(this.payload());
      localStorage.removeItem("so-cart");
      window.location.assign("./checkoutsuccess.html");
      return result;
    } catch (err) {
      const msg =
        typeof err?.message === "string"
          ? err.message
          : err?.message?.message || err?.message?.error || "Bad Request";
      alertMessage(msg, { type: "error", scroll: true });
    }
  }
}
