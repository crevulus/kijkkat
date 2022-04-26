import { useCallback, useEffect, useRef, useState } from "react";
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
  QueryDocumentSnapshot,
  QuerySnapshot,
  startAt,
} from "firebase/firestore";
import { firebaseApp } from "../../firebase";
import { createImage, createMapButton } from "../../utils/mapUtils";

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
  const googlemapRef = useRef(null);
  const [hasLoadedMarkers, setHasLoadedMarkers] = useState(false);
  const [mapObject, setMapObject] = useState<google.maps.Map | null>(null);
  const [docSnapshots, setDocSnapshots] = useState<
    Promise<QuerySnapshot<DocumentData>>[]
  >([]);

  const handleGeohashingQuery = useCallback(() => {
    const bounds = geofire.geohashQueryBounds(
      coords
        ? [coords.lat, coords.lng]
        : [AMSTERDAM_COORDS.lat, AMSTERDAM_COORDS.lng],
      DEFAULT_RADIUS
    );

    const docSnapshots = bounds.map((bound) => {
      const q = query(
        collection(db, "posts"),
        orderBy("geohash"),
        startAt(bound[0]),
        endAt(bound[1])
      );
      return getDocs(q);
    });

    setDocSnapshots(docSnapshots);
  }, [coords]);

  const handleAddMarkers = useCallback(() => {
    Promise.all(docSnapshots)
      .then((snapshots) => {
        const matchingDocs: QueryDocumentSnapshot<DocumentData>[] = [];
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
      .then((matchingDocs) => {
        matchingDocs.map((doc) => {
          const data = doc.data();
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
    setHasLoadedMarkers(true);
  }, [docSnapshots, mapObject, coords]);

  useEffect(() => {
    // Loading Google Maps JavaScript API
    if (!mapObject) {
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
            mapTypeControl: false,
          });

          const centerControlDiv = document.createElement("div");
          // CenterControl(centerControlDiv, map);
          createMapButton(centerControlDiv, map, coords ?? AMSTERDAM_COORDS);
          map.controls[google.maps.ControlPosition.TOP_CENTER].push(
            centerControlDiv
          );
          setMapObject(map);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMapObject, googlemapRef]);

  useEffect(() => {
    if (coords) {
      if (mapObject) {
        mapObject.setCenter(coords);
        mapObject.setZoom(14);
      }
    }
  }, [coords, mapObject]);

  useEffect(() => {
    if (mapObject) {
      handleGeohashingQuery();
      handleAddMarkers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapObject, hasLoadedMarkers]);

  return <div ref={googlemapRef} style={{ height: "100%" }} />;
}
