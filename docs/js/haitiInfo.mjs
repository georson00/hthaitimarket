export async function getHaitiInfo() {
  const response = await fetch("https://restcountries.com/v3.1/name/haiti");

  if (!response.ok) {
    throw new Error("Could not load Haiti information");
  }

  const data = await response.json();
  return data[0];
}

export function renderHaitiInfo(country) {
  const container = document.querySelector("#haiti-info");

  if (!container) return;

  const currencyCode = Object.keys(country.currencies)[0];

  container.innerHTML = `
    <h2>About Haiti</h2>
    <img src="${country.flags.png}" alt="Flag of Haiti">
    <p><strong>Capital:</strong> ${country.capital[0]}</p>
    <p><strong>Currency:</strong> Haitian Gourde (${currencyCode})</p>
    <p><strong>Region:</strong> ${country.region}</p>
    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
  `;
}

async function loadHaitiInfo() {
  try {
    const haiti = await getHaitiInfo();
    renderHaitiInfo(haiti);
  } catch (error) {
    console.error("Haiti API failed:", error);
  }
}

loadHaitiInfo();