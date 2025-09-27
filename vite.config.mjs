import { resolve } from "path";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  root: "src/",
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve("src/index.html"),
        cart: resolve("src/cart/index.html"),
        checkout: resolve("src/checkout/index.html"),
        checkoutSuccess: resolve("src/checkout/checkoutsuccess.html"),
        productIndex: resolve("src/product_pages/index.html"),
        productListing: resolve("src/product-listing/index.html"),
      },
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [{ src: "css/style.css", dest: "css" }],
    }),
  ],
});
