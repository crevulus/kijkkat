import React, { useEffect, useRef, ReactElement, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

import styles from "./MapContainer.module.css";

const render = (status: Status): ReactElement => {
  if (status === Status.LOADING) return <h3>{status} ..</h3>;
  return <h3>{status} ...</h3>;
};

function MapComponent({
  center,
  zoom,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
}) {
  const [map, setMap] = useState<google.maps.Map>();
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && !map) {
      setMap(
        new window.google.maps.Map(mapRef.current!, {
          center,
          zoom,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapRef, map]);

  return <div ref={mapRef} id="map" className={styles.mapDiv} />;
}

export function MapContainer() {
  const center = { lat: 52.356, lng: 4.896 };
  const zoom = 10;

  return (
    <Wrapper
      apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY!}
      render={render}
    >
      <MapComponent center={center} zoom={zoom} />
    </Wrapper>
  );
}
