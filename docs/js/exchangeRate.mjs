export async function getUsdToHtgRate() {
  const response = await fetch("https://open.er-api.com/v6/latest/USD");
  const data = await response.json();

  return data.rates.HTG;
}

export function convertUsdToHtg(price, rate) {
  return Math.round(price * rate);
}
