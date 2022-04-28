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
import { useErrorStore, useGeographicStore } from "../../data/store";
import { CoordsType } from "../../pages/Map";

type MapContainerProps = {
  coords: CoordsType | null;
  forceTriggerQuery?: boolean;
};

const AMSTERDAM_COORDS = { lat: 52.356, lng: 4.896 };
const DEFAULT_RADIUS = 5000; // in metres

const db = getFirestore(firebaseApp);

export function MapContainer({ coords, forceTriggerQuery }: MapContainerProps) {
  const setError = useErrorStore((state) => state.setError);
  const setErrorMessage = useErrorStore((state) => state.setErrorMessage);
  const setMapLoaded = useGeographicStore((state) => state.setMapLoaded);
  const googlemapRef = useRef(null);
  const [mapObject, setMapObject] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(AMSTERDAM_COORDS);
  const [triggerQuery, setTriggerQuery] = useState(forceTriggerQuery);

  useEffect(() => {
    if (coords) {
      if (mapObject) {
        mapObject.setCenter(coords);
      }
      setTriggerQuery(true);
      setCenter(coords);
    }
  }, [coords, mapObject]);

  const performGeoQuery = () => {
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
        if (matchingDocs.length === 0) {
          setError(true);
          setErrorMessage("No cats found within 5km");
        }
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
  };

  useEffect(() => {
    if (triggerQuery) {
      performGeoQuery();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center, mapObject, triggerQuery]);

  useEffect(() => {
    if (!mapObject) {
      const loader = new Loader({
        apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
      });
      let map: google.maps.Map;
      loader.load().then(() => {
        const initialView = {
          center,
          zoom: 14,
        };
        const google = window.google;
        if (googlemapRef.current) {
          map = new google.maps.Map(googlemapRef.current, {
            ...initialView,
            mapTypeControl: false,
          });
          const centerControlDiv = document.createElement("div");
          createMapButton(centerControlDiv);
          map.controls[google.maps.ControlPosition.TOP_CENTER].push(
            centerControlDiv
          );
          const centerControlButton: HTMLButtonElement | null =
            centerControlDiv.querySelector(".search-button");
          centerControlButton!.addEventListener("click", () => {
            setTriggerQuery(true);
          });
          map.addListener("center_changed", () => {
            centerControlButton!.disabled = false;
            setTriggerQuery(false);
            // @ts-ignore
            const newCenter = {
              lat: map.getCenter()!.lat(),
              lng: map.getCenter()!.lng(),
            };
            setCenter(newCenter);
          });
          setMapObject(map);
          setMapLoaded(true);
        }
      });
    }
  }, [setMapLoaded, setMapObject, mapObject, googlemapRef, center]);

  return <div ref={googlemapRef} style={{ height: "100%" }} />;
}
