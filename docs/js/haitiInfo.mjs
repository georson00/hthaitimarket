export async function getHaitiHolidays() {
  const response = await fetch(
    "https://date.nager.at/api/v3/PublicHolidays/2026/HT",
  );

  if (!response.ok) {
    throw new Error("Could not load Haiti holiday information");
  }

  return await response.json();
}

export function renderHaitiHolidays(holidays) {
  const container = document.querySelector("#haiti-info");
  if (!container) return;

  const firstThree = holidays.slice(0, 3);

  container.innerHTML = `
    <h2>Upcoming Haiti Holidays</h2>
    <ul>
      ${firstThree
        .map(
          (holiday) => `
            <li>
              <strong>${holiday.localName}</strong> - ${holiday.date}
            </li>
          `,
        )
        .join("")}
    </ul>
  `;
}
