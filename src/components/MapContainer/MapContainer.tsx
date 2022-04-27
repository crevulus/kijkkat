import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import * as geofire from "geofire-common";

import {
  collection,
  DocumentData,
  endAt,
  getDocs,
  getFirestore,
  orderBy,
  query,
  startAt,
} from "firebase/firestore";

import { firebaseApp } from "../../firebase";
import { createImage, createMapButton } from "../../utils/mapUtils";
import { useGeographicStore } from "../../data/store";

type MapContainerProps = {
  coords: {
    lat: number;
    lng: number;
  } | null;
};

const AMSTERDAM_COORDS = { lat: 52.356, lng: 4.896 };
const DEFAULT_RADIUS = 5000; // in metres

const db = getFirestore(firebaseApp);

export function MapContainer({ coords }: MapContainerProps) {
  const setMapLoaded = useGeographicStore((state) => state.setMapLoaded);
  const googlemapRef = useRef(null);
  const [mapObject, setMapObject] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(AMSTERDAM_COORDS);

  useEffect(() => {
    if (coords) {
      if (mapObject) {
        mapObject.setCenter(coords);
        mapObject.setZoom(14);
      }
      setCenter(coords);
    }
  }, [coords, mapObject]);

  useEffect(() => {
    if (!mapObject) {
      return;
    }
    const bounds = geofire.geohashQueryBounds(
      [center.lat, center.lng],
      DEFAULT_RADIUS
    );

    const geohashes = bounds.map((bound) => {
      const q = query(
        collection(db, "posts"),
        orderBy("geohash"),
        startAt(bound[0]),
        endAt(bound[1])
      );
      return getDocs(q);
    });

    Promise.all(geohashes)
      .then((snapshots) => {
        const matchingDocs: DocumentData[] = [];
        snapshots.forEach((snap) => {
          snap.forEach((doc) => {
            const lat = doc.data().location.latitude;
            const lng = doc.data().location.longitude;

            const distanceInKm = geofire.distanceBetween(
              [lat, lng],
              [center.lat, center.lng]
            );
            const distanceInM = distanceInKm * 1000;
            if (distanceInM <= DEFAULT_RADIUS) {
              matchingDocs.push(doc.data());
            }
          });
        });
        return matchingDocs;
      })
      .then((matchingDocs) => {
        matchingDocs.map((data) => {
          const lat = data.location.latitude;
          const lng = data.location.longitude;
          const marker = new google.maps.Marker({
            position: { lat, lng },
            map: mapObject,
            animation: google.maps.Animation.DROP,
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
          marker.setMap(mapObject);
          return marker;
        });
      });
  }, [center, mapObject]);

  useEffect(() => {
    if (!mapObject) {
      const loader = new Loader({
        apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
      });
      let map;
      loader.load().then(() => {
        const initialView = {
          center,
          zoom: 10,
        };
        const google = window.google;
        if (googlemapRef.current) {
          map = new google.maps.Map(googlemapRef.current, {
            ...initialView,
            mapTypeControl: false,
          });
          const centerControlDiv = document.createElement("div");
          createMapButton(centerControlDiv, map, center);
          map.controls[google.maps.ControlPosition.TOP_CENTER].push(
            centerControlDiv
          );
          setMapObject(map);
          setMapLoaded(true);
        }
      });
    }
  }, [setMapLoaded, setMapObject, mapObject, googlemapRef, center]);

  return <div ref={googlemapRef} style={{ height: "100%" }} />;
}
