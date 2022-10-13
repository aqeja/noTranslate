import { atom } from "recoil";

export const translationsState = atom({
  key: "translationsState",
  default: new Map<string, string>(),
});
