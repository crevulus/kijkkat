import create from "zustand";

import type { User } from "firebase/auth";
import { PlaceType } from "../components/Search/Search";

type GeographicStateType = {
  chosenLocation: PlaceType | null;
  setChosenLocation: (place: PlaceType | null) => void;
  mapLoaded: boolean;
  setMapLoaded: (loaded: boolean) => void;
};

export const useGeographicStore = create<GeographicStateType>((set) => ({
  chosenLocation: null,
  setChosenLocation: (location: PlaceType | null) =>
    set((state) => ({ ...state, chosenLocation: location })),
  mapLoaded: false,
  setMapLoaded: (loaded: boolean) =>
    set((state) => ({ ...state, mapLoaded: loaded })),
}));

type UserStateType = {
  user: User | null;
  setUser: (userData: User | null) => void;
  isSignedIn: boolean;
  setIsSignedIn: (isSignedIn: boolean) => void;
};

export const useUserStore = create<UserStateType>((set) => ({
  user: null,
  setUser: (userData) => set((state) => ({ ...state, user: userData })),
  isSignedIn: false,
  setIsSignedIn: (signedIn) =>
    set((state) => ({ ...state, isSignedIn: signedIn })),
}));

type ErrorStateType = {
  error: boolean;
  setError: (error: boolean) => void;
  errorMessage: string;
  setErrorMessage: (isSignedIn: string) => void;
};

const defaultErrorMessage = "Oops! Something went wrong.";

export const useErrorStore = create<ErrorStateType>((set) => ({
  error: false,
  setError: (error) => set((state) => ({ ...state, error })),
  errorMessage: defaultErrorMessage,
  setErrorMessage: (message = defaultErrorMessage) =>
    set((state) => ({ ...state, errorMessage: message })),
}));
