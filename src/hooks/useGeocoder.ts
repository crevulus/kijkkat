import Geocode from "react-geocode";

import { useErrorStore } from "../data/store";

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_GEOCODING_API_KEY!);

export const useGeocoder = () => {
  const setError = useErrorStore((state) => state.setError);
  const setErrorMessage = useErrorStore((state) => state.setErrorMessage);

  const geocodeAddressFromCoords = (coords: any) =>
    Geocode.fromLatLng(coords.latitude.toString(), coords.longitude.toString())
      .then(
        (response) => {
          const address = response.results[0];
          const formattedAddress = address.address_components
            .slice(1, 4)
            .map((a: any) => a.long_name)
            .join(", ");
          return formattedAddress;
        },
        (error) => {
          setError(true);
          setErrorMessage(error.message);
        }
      )
      .then((data) => data ?? null);

  const geocodeCoordsFromAddress = (address: string) =>
    Geocode.fromAddress(address)
      .then(
        (response: any) => {
          const { lat, lng } = response.results[0].geometry.location;
          return { lat, lng };
        },
        (error: any) => {
          setError(true);
        }
      )
      .then((data) => data ?? null);

  return { geocodeAddressFromCoords, geocodeCoordsFromAddress };
};
