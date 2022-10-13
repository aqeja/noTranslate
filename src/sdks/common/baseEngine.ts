import { secretsStorage } from "@/common/storage";
import { EngineNames } from ".";
import { OnErrorArg } from "./toText";

export type SupportedLangs = Record<
  string,
  {
    label: string;
    toText: string;
    translation: string;
  }
>;
export type LangItem = { value: string; label: string; toText: string; translation: string };

export abstract class BaseEngine {
  abstract name: EngineNames;
  /**
   * 支持的语言
   */
  langs: SupportedLangs = {};
  get langsList() {
    return Object.entries(this.langs).reduce((acc: LangItem[], [key, value]) => {
      return [
        ...acc,
        {
          value: key,
          ...value,
        },
      ];
    }, []);
  }
  getLangLabel(lang: string) {
    return this.langs[lang].label ?? "/";
  }
  protected checkSecrets() {
    const secrets = Object.values(secretsStorage.get("secrets")?.[this.name] || {});
    const isSecretsFilled = secrets.length > 0 && secrets.every((item) => item.trim().length > 0);
    if (!isSecretsFilled) {
      return {
        isValid: false,
        detail: {
          code: "-1",
          message: "缺少配置信息",
          source: this.name,
        },
      };
    }
  }
  /**
   * 自检，功能是否可用
   */
  abstract check(): Promise<{
    isValid: boolean;
    detail: OnErrorArg;
  }>;
}
