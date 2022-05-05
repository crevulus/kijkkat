export function createMapButton(controlDiv: Element) {
  // Set CSS for the control border.
  const controlUI = document.createElement("button");
  controlUI.classList.add("search-button");
  controlUI.disabled = true;
  controlUI.title = "Click to search for more cats";
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  const controlText = document.createElement("div");
  controlText.textContent = "Search this area";
  controlUI.appendChild(controlText);
}

export const createImage = (url: string) =>
  `<img class="info-window-image" src="${url}" alt="Cat marker" />`;
