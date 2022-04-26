import { useCallback, useEffect, useRef, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Loader } from "@googlemaps/js-api-loader";
import * as geofire from "geofire-common";

import {
  collection,
  endAt,
  getDocs,
  getFirestore,
  orderBy,
  query,
  startAt,
} from "firebase/firestore";
import { firebaseApp } from "../../firebase";

type MapContainerProps = {
  coords: {
    lat: number;
    lng: number;
  } | null;
};

const AMSTERDAM_COORDS = { lat: 52.356, lng: 4.896 };
const DEFAULT_RADIUS = 5000; // in metres

const db = getFirestore(firebaseApp);

const createImage = (url: string) =>
  `<img src="${url}" alt="post" style="height: 100px; width: 100px; aspect-ratio: 1" />`;

export function MapContainer({ coords }: MapContainerProps) {
  const googlemapRef = useRef(null);
  const [mapObject, setMapObject] = useState<google.maps.Map | null>(null);

  const bounds = geofire.geohashQueryBounds(
    coords
      ? [coords.lat, coords.lng]
      : [AMSTERDAM_COORDS.lat, AMSTERDAM_COORDS.lng],
    DEFAULT_RADIUS
  );

  const test = bounds.map((bound) => {
    const q = query(
      collection(db, "posts"),
      orderBy("geohash"),
      startAt(bound[0]),
      endAt(bound[1])
    );
    return getDocs(q);
  });

  Promise.all(test)
    .then((snapshots) => {
      const matchingDocs: any[] = [];
      snapshots.forEach((snap) => {
        snap.forEach((doc) => {
          const lat = doc.data().location.latitude;
          const lng = doc.data().location.longitude;

          const distanceInKm = geofire.distanceBetween(
            [lat, lng],
            coords
              ? [coords.lat, coords.lng]
              : [AMSTERDAM_COORDS.lat, AMSTERDAM_COORDS.lng]
          );
          const distanceInM = distanceInKm * 1000;
          if (distanceInM <= DEFAULT_RADIUS) {
            matchingDocs.push(doc);
          }
        });
      });
      return matchingDocs;
    })
    .then((matchingDocs: any) => {
      console.log(matchingDocs);
      matchingDocs.map((doc: any) => {
        const lat = doc.data().location.latitude;
        const lng = doc.data().location.longitude;
        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: mapObject,
        });
        marker.setMap(mapObject);
        return marker;
      });
    });

  const [values] = useCollectionData(collection(db, "posts"));

  useEffect(() => {
    // Loading Google Maps JavaScript API
    const loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
    });
    let map;
    loader.load().then(() => {
      // Setting parameters for embedding Google Maps
      const initialView = {
        center: AMSTERDAM_COORDS,
        zoom: 10,
      };
      // Embedding Google Maps
      const google = window.google;
      if (googlemapRef.current) {
        map = new google.maps.Map(googlemapRef.current, {
          ...initialView,
        });
        setMapObject(map);
      }
    });
  }, [setMapObject, googlemapRef]);

  useEffect(() => {
    if (coords) {
      if (mapObject) {
        mapObject.setCenter(coords);
        mapObject.setZoom(14);
      }
    }
  }, [coords, mapObject]);

  const renderMarkers = useCallback(() => {
    if (values && mapObject) {
      values.map((item) => {
        const infowindow = new google.maps.InfoWindow({
          content: createImage(item.imageUrl),
        });
        const marker = new google.maps.Marker({
          position: {
            lat: item.location.latitude,
            lng: item.location.longitude,
          },
          map: mapObject,
          animation: google.maps.Animation.DROP,
        });
        marker.addListener("click", () => {
          infowindow.open({
            anchor: marker,
            map: mapObject,
            shouldFocus: true,
          });
        });
        return marker;
      });
    }
  }, [values, mapObject]);

  // useEffect(() => {
  //   renderMarkers();
  // }, [values, renderMarkers]);

  return <div ref={googlemapRef} style={{ height: "100%" }} />;
}
