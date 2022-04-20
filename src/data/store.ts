import create from "zustand";
import { PlaceType } from "../components/Search/Search";

type StoreStateType = {
  chosenLocation: PlaceType | null;
  setChosenLocation: (place: PlaceType | null) => void;
};

export const useStore = create<StoreStateType>((set) => ({
  chosenLocation: null,
  setChosenLocation: (location: PlaceType | null) =>
    set((state) => ({ ...state, chosenLocation: location })),
}));
