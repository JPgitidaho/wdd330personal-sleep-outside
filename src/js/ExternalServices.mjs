const baseURL = (
  import.meta?.env?.VITE_SERVER_URL || "https://wdd330-backend.onrender.com/"
).replace(/\/$/, "");

async function convertToJson(res) {
  const jsonResponse = await res.json().catch(() => null);
  if (res.ok) return jsonResponse ?? {};
  throw {
    name: "servicesError",
    message: jsonResponse ?? { error: "Bad Response" },
  };
}

export async function postCheckout(payload) {
  const res = await fetch(`${baseURL}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return convertToJson(res);
}

export { convertToJson };
