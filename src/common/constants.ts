import { EngineNames } from "@/sdks/common";
import Storage from "./storage";

export const DEFAULT_SECRETS = {
  tencent: {
    AppId: "",
    SecretId: "",
    SecretKey: "",
  },
  baidu: {
    AppId: "",
    Secret: "",
  },
  microsoft: {
    /**
     * English: https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/how-to-translate-speech?source=recommendations&tabs=terminal&pivots=programming-language-javascript
     *
     * 中文：https://learn.microsoft.com/zh-cn/azure/cognitive-services/speech-service/how-to-translate-speech?source=recommendations&tabs=terminal&pivots=programming-language-javascript
     */
    SubscriptionKey: "",
    Region: "",
  },
};
export type AppStorage = {
  secrets: typeof DEFAULT_SECRETS;
  preference: {
    toTextEngine: EngineNames | "";
    translateEngine: EngineNames | "";
  };
};
export const appStorage = new Storage<AppStorage>();

export const Engine_Docs: Record<EngineNames, string> = {
  baidu: "https://fanyi-api.baidu.com/doc/21",
  microsoft:
    "https://learn.microsoft.com/zh-cn/azure/cognitive-services/speech-service/how-to-translate-speech?source=recommendations&tabs=terminal&pivots=programming-language-javascript",
  tencent: "https://cloud.tencent.com/document/product/1093/48982",
};

export const FORM_KEY_NAMES = Object.entries(DEFAULT_SECRETS).reduce((acc, [engineName, values]) => {
  const keyNames: string[] = Object.keys(values);
  return {
    ...acc,
    [engineName]: keyNames.map((key) => ({
      name: `${engineName}.${key}`,
      key,
    })),
  };
}, {}) as Record<EngineNames, { name: string; key: string }[]>;
