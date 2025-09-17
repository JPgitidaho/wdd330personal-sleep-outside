const fs = require("fs");
const path = require("path");

const jsonPath = path.resolve(__dirname, "src", "public", "json", "tents.json");

if (!fs.existsSync(jsonPath)) {
  console.error("❌ No se encontró el archivo:", jsonPath);
  process.exit(1);
}

const tents = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

tents.forEach((product) => {
  const imagePath = product.Image.startsWith("/")
    ? product.Image.substring(1)
    : product.Image;

  const fullPath = path.resolve("src", "public", imagePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`❌ Imagen no encontrada para: ${product.Name}`);
    console.log(`   Esperada en: ${fullPath}`);
  } else {
    console.log(`✅ Imagen encontrada para: ${product.Name}`);
  }
});
