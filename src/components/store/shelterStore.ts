import { atom } from "recoil";
import { ShelterType } from "../../api";

export const shelterAtom = atom<ShelterType[]>({
  key: "shelterAtom",
  default: [],
});
