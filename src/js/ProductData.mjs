const baseURL =
  import.meta.env.VITE_SERVER_URL || "https://wdd330-backend.onrender.com/";

async function convertToJson(res) {
  const jsonResponse = await res.json().catch(() => null);
  if (res.ok) return jsonResponse ?? {};
  throw {
    name: "servicesError",
    message: jsonResponse ?? { error: "Bad Response" },
  };
}

export default class ProductData {
  async getData(category) {
    const url = `${baseURL.replace(/\/$/, "")}/products/search/${category}`;
    const response = await fetch(url);
    const data = await convertToJson(response);
    return data.Result;
  }
  async findProductById(id) {
    const url = `${baseURL.replace(/\/$/, "")}/product/${id}`;
    const response = await fetch(url);
    const data = await convertToJson(response);
    const product = data.Result ?? data;
    product.FinalPrice =
      product.FinalPrice ??
      product.final_price ??
      product.list_price ??
      product.suggested_retail_price ??
      0;
    product.ListPrice =
      product.ListPrice ??
      product.list_price ??
      product.suggested_retail_price ??
      product.FinalPrice ??
      0;
    product.SuggestedRetailPrice =
      product.SuggestedRetailPrice ??
      product.suggested_retail_price ??
      product.ListPrice ??
      0;
    return product;
  }
}
