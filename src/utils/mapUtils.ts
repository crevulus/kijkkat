import { DocumentData } from "firebase/firestore";

import { primaryColor } from "../styles/theme";

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

export const createImage = (
  webpUrl: string,
  jpegUrl?: string,
  fallbackUrl?: string
) =>
  `<img class="info-window-image" src="${webpUrl}, ${jpegUrl}, ${fallbackUrl}" alt="Cat marker" />`;

export const createMarker = (
  data: DocumentData,
  mapObject: google.maps.Map
): [google.maps.Marker, google.maps.InfoWindow] => {
  const lat = data.location.latitude;
  const lng = data.location.longitude;
  const svgMarker = {
    path: "M 12 13 l 4 -2 l -2 -5 l -2 2 l -2 -2 l -2 5 z M 12 2.016 q 2.906 0 4.945 2.039 t 2.039 4.945 q 0 1.453 -0.727 3.328 t -1.758 3.516 t -2.039 3.07 t -1.711 2.273 l -0.75 0.797 q -0.281 -0.328 -0.75 -0.867 t -1.688 -2.156 t -2.133 -3.141 t -1.664 -3.445 t -0.75 -3.375 q 0 -2.906 2.039 -4.945 t 4.945 -2.039 z M 10 6 L 8 11 L 12 13 L 16 11 L 14 6 L 12 8 L 10 6",
    fillColor: primaryColor,
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: "white",
    rotation: 0,
    scale: 2,
    anchor: new google.maps.Point(15, 30),
  };
  const marker = new google.maps.Marker({
    position: { lat, lng },
    map: mapObject,
    animation: google.maps.Animation.DROP,
    icon: svgMarker,
  });
  const infowindow = new google.maps.InfoWindow({
    content: createImage(data.imageUrl),
  });
  marker.addListener("click", () => {
    infowindow.open({
      anchor: marker,
      map: mapObject,
      shouldFocus: true,
    });
  });
  return [marker, infowindow];
};
