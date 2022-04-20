import { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

import styles from "./MapContainer.module.css";

type MapContainerProps = {
  coords: {
    lat: number;
    lng: number;
  } | null;
};

const AMSTERDAM_COORDS = { lat: 52.356, lng: 4.896 };

export function MapContainer({ coords }: MapContainerProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!, // ,
    // ...otherOptions
  });

  const [center, setCenter] = useState(AMSTERDAM_COORDS);
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    if (coords) {
      console.log(coords);
      setCenter(coords);
      setZoom(14);
    }
  }, [coords]);

  const renderMap = () => {
    // wrapping to a function is useful in case you want to access `window.google`
    // to eg. setup options or create latLng object, it won't be available otherwise
    // feel free to render directly if you don't need that
    const onLoad = function onLoad(mapInstance: any) {
      console.log(mapInstance);
    };
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
  };

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>;
  }

  return isLoaded ? renderMap() : <p>Loading now</p>;
}
