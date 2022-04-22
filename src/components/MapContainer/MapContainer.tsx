import { useEffect, useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

import styles from "./MapContainer.module.css";
import { useErrorStore, useGeographicStore } from "../../data/store";

type MapContainerProps = {
  coords: {
    lat: number;
    lng: number;
  } | null;
};

const AMSTERDAM_COORDS = { lat: 52.356, lng: 4.896 };

export function MapContainer({ coords }: MapContainerProps) {
  const setError = useErrorStore((state) => state.setError);
  const setMapLoaded = useGeographicStore((state) => state.setMapLoaded);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!, // ,
    // ...otherOptions
  });

  const [center, setCenter] = useState(AMSTERDAM_COORDS);
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    if (coords) {
      setCenter(coords);
      setZoom(14);
    }
  }, [coords]);

  useEffect(() => {
    if (loadError) {
      setError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadError]);

  const onLoad = () => setMapLoaded(true);

  const renderMap = useCallback(() => {
    return (
      //@ts-ignore
      <GoogleMap
        mapContainerClassName={styles.mapDiv}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
      >
        {
          // ...Your map components
        }
      </GoogleMap>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center, zoom]);

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  return isLoaded ? renderMap() : <p>Loading now</p>;
}
