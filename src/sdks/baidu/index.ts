import { translate } from "@/api/baidu/translate";
import { BaseTranslateEngine, TranslateResult } from "../common/translate";
import { SupportedLangs } from "../common/baseEngine";
import { EngineNames } from "../common";

export class BaiduEngine extends BaseTranslateEngine {
  name: EngineNames = "baidu";
  langs: SupportedLangs = {
    zh: {
      label: "中文（大陆）",
      toText: "",
      translation: "zh",
    },
    en: {
      label: "英语",
      toText: "",
      translation: "en",
    },
    ja: {
      label: "日语",
      toText: "",
      translation: "jp",
    },
    ko: {
      label: "韩语",
      toText: "",
      translation: "kor",
    },
    fra: {
      label: "法语",
      toText: "",
      translation: "fra",
    },
    spa: {
      label: "西班牙语",
      toText: "",
      translation: "spa",
    },
  };
  translate: (arg: { source: string; target: string; textList: string[] }) => Promise<TranslateResult> = ({
    source,
    target,
    textList,
  }) => {
    return translate({ source, target, textList }).then((res) => {
      if ("from" in res) {
        return {
          isValid: true,
          data: res.trans_result.map((item) => item.dst),
        };
      } else {
        return {
          isValid: false,
          code: res.error_code,
          message: res.error_msg,
        };
      }
    });
  };
  async check() {
    const secretsHasError = this.checkSecrets();
    if (secretsHasError) {
      return secretsHasError;
    }
    return {
      isValid: true,
      detail: {
        code: "-1",
        message: "",
        source: this.name,
      },
    };
  }
}
