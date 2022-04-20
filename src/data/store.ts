import create from "zustand";
import { PlaceType } from "../components/Search/Search";

type StoreStateType = {
  chosenLocation: PlaceType | null;
  setChosenLocation: (place: PlaceType | null) => void;
  mapLoaded: boolean;
  setMapLoaded: (loaded: boolean) => void;
};

export const useStore = create<StoreStateType>((set) => ({
  chosenLocation: null,
  setChosenLocation: (location: PlaceType | null) =>
    set((state) => ({ ...state, chosenLocation: location })),
  mapLoaded: false,
  setMapLoaded: (loaded: boolean) =>
    set((state) => ({ ...state, mapLoaded: loaded })),
}));
