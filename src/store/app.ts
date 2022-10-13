import { atom } from "recoil";
import { Engine } from "@/sdks/common";
import type { SentenceItem } from "@/sdks/common/translate";

export enum AppStatus {
  idle = "idle",
  working = "working",
  pause = "pause",
  finished = "finished",
  error = "error",
}

/**
 * app 状态
 */
export const statusState = atom({
  key: "appStatus",
  default: AppStatus.idle,
});

export const sourceLangState = atom({
  key: "sourceLang",
  default: "zh",
});

export const targetLangState = atom({
  key: "targetLang",
  default: "en",
});

export const translationEnabledState = atom({
  key: "translationEnabled",
  default: false,
});

export const sentenceListState = atom<SentenceItem[]>({
  key: "sentenceList",
  default: [],
});

export const translationTimerState = atom<number | null>({
  key: "translationTimer",
  default: null,
});

export const engineState = atom({
  key: "engine",
  default: new Engine("tencent", "baidu"),
  dangerouslyAllowMutability: true,
});

export const settingsOpenState = atom({
  key: "settingsOpen",
  default: false,
});

export const micState = atom<{ currentDevice: string; deviceList: MediaDeviceInfo[]; rejected: boolean }>({
  key: "micDevices",
  default: {
    currentDevice: "",
    deviceList: [],
    rejected: false,
  },
});

export const errorState = atom({
  key: "errorInfo",
  default: {
    code: "-1",
    message: "",
    source: "",
    open: false,
  },
});

export const scrollTimerState = atom<number | null>({
  key: "scrollTimer",
  default: null,
});
