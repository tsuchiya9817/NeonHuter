const TOTAL_SEATS = 40;
const STORAGE_KEY = "neonHunterClassroomSeats";

const seatGrid = document.getElementById("seatGrid");
const registeredCount = document.getElementById("registeredCount");
const emptyCount = document.getElementById("emptyCount");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");
const clearAllButton = document.getElementById("clearAllButton");

function loadNames() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.from({ length: TOTAL_SEATS }, (_, i) =>
      typeof saved[i] === "string" ? saved[i] : ""
    );
  } catch {
    return Array(TOTAL_SEATS).fill("");
  }
}

let seatNames = loadNames();

function saveNames() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seatNames));
  } catch (error) {
    console.warn("座席データを保存できませんでした。", error);
  }
}

function updateSummary() {
  const count = seatNames.filter(name => name.trim() !== "").length;
  const rate = Math.round(count / TOTAL_SEATS * 100);
  registeredCount.textContent = count;
  emptyCount.textContent = TOTAL_SEATS - count;
  progressText.textContent = `${rate}%`;
  progressBar.style.width = `${rate}%`;
}

function renderSeats() {
  seatGrid.innerHTML = "";

  seatNames.forEach((name, index) => {
    const seat = document.createElement("label");
    seat.className = `seat${name.trim() ? " is-occupied" : ""}`;

    const top = document.createElement("span");
    top.className = "seat-top";

    const number = document.createElement("span");
    number.className = "seat-number";
    number.textContent = `席 ${String(index + 1).padStart(2, "0")}`;

    const indicator = document.createElement("span");
    indicator.className = "seat-indicator";

    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 20;
    input.autocomplete = "off";
    input.enterKeyHint = "done";
    input.placeholder = "名前";
    input.value = name;
    input.setAttribute("aria-label", `席 ${index + 1} の名前`);

    input.addEventListener("input", () => {
      seatNames[index] = input.value;
      seat.classList.toggle("is-occupied", input.value.trim() !== "");
      saveNames();
      updateSummary();
    });

    top.append(number, indicator);
    seat.append(top, input);
    seatGrid.append(seat);
  });

  updateSummary();
}

clearAllButton.addEventListener("click", () => {
  if (!seatNames.some(name => name.trim())) return;
  if (!window.confirm("40席すべての名前を消去しますか？")) return;
  seatNames = Array(TOTAL_SEATS).fill("");
  saveNames();
  renderSeats();
});

renderSeats();
