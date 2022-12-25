import jsSHA from "jssha";
import { EngineNames } from "../common";
import { BaseToTextEngine, punctuations, ToTextOptions } from "../common/toText";
import { appStorage } from "@/common/constants";
import WebAudioSpeechRecognizer from "./webaudiospeechrecognizer";
import { TranslationStatus } from "../common/translate";

export type TencentParams = {
  secretid: string;
  timestamp: number;
  expired: number;
  // 随机数
  nonce: number;
  engine_model_type: string;
  /**
   * 16位 String 串作为每个音频的唯一标识，用户自己生成
   */
  voice_id: string;
};
const langs = {
  zh: {
    label: "中文（大陆）",
    toText: "16k_zh",
    translation: "zh",
  },
  en: {
    label: "英语",
    toText: "16k_en",
    translation: "en",
  },
  ja: {
    label: "日语",
    toText: "16k_ja",
    translation: "ja",
  },
  ko: {
    label: "韩语",
    toText: "16k_ko",
    translation: "ko",
  },
  zh_tw: {
    label: "中文（台湾）",
    toText: '"16k_zh-TW"',
    translation: "zh-TW",
  },
  ca: {
    label: "粤语",
    toText: "16k_ca",
    translation: "ca",
  },
  th: {
    label: "泰语",
    toText: "16k_th",
    translation: "th",
  },
};

export class TencentEngine extends BaseToTextEngine {
  name: EngineNames = "tencent";
  langs = langs;
  private instance: WebAudioSpeechRecognizer | null = null;
  isWorking = false;
  private createInstance(modelType: string) {
    const secrets = appStorage.get("secrets");
    const AppId = secrets?.tencent.AppId ?? "";
    const SecretId = secrets?.tencent.SecretId ?? "";
    const SecretKey = secrets?.tencent.SecretKey ?? "";

    const sha = new jsSHA("SHA-1", "TEXT", {
      hmacKey: { value: SecretKey, format: "TEXT" },
    });
    this.instance = new WebAudioSpeechRecognizer({
      appid: AppId,
      secretid: SecretId,
      signCallback: (sign) => {
        sha.update(sign);
        return sha.getHMAC("B64");
      },
      engine_model_type: modelType,
      voice_format: 1,
      word_info: 2,
    });
  }
  toText(lang: string, { onChange, onError, deviceId }: ToTextOptions): void {
    const _lang = this.langs[lang as "zh"].toText;
    this.createInstance(_lang);
    if (!this.instance) {
      throw Error("no instance"); // TODO
    }
    const dictionary = this.root.dictionary;

    this.instance.OnRecognitionResultChange = (result) => {
      //代表成功
      if (result.code === 0) {
        this.root.sentences = [];

        const content = result.result.voice_text_str;
        if (dictionary.size > 10000) {
          dictionary.clear(); // TODO
        }
        const taskSentences = content.split(punctuations).filter((item) => !!item);

        taskSentences.forEach((item) => {
          const isPunctuation = punctuations.test(item);
          if (!isPunctuation && !dictionary.has(item)) {
            dictionary.set(item, {
              status: TranslationStatus.processing,
              value: "",
            });
          }
          this.addSentence({
            source: item,
            key: Math.random(),
          });
        });
        onChange(this.root.sentences);
      } else {
        onError?.({
          code: result.code.toString(),
          message: result.message,
          source: this.name,
        });
      }
    };
    this.instance.OnSentenceEnd = (res) => {
      //
    };
    this.instance.OnRecognitionComplete = (res) => {
      //
    };
    this.instance.OnError = (e) => {
      if (e instanceof CloseEvent) {
        console.error(e);
        return;
      }
      if (typeof e === "string") {
        onError?.({
          code: "-1",
          message: e,
          source: this.name,
        });
        return;
      }
      onError?.({
        code: e.code,
        message: e.message,
        source: this.name,
      });
    };

    this.instance.OnRecognitionStart = (r) => {
      this.isWorking = true;
    };
    this.instance.start({
      deviceId,
      onReceiveData: (data: Int8Array) => {
        const array = Array.from(data);
        const size = 16;
        const gap = Math.trunc(data.length / size);
        const result: number[] = [];
        for (let i = 0; i < size; i++) {
          const v = array[i * gap] / 127;
          result.push(v);
        }
        this.audioVisualiseData = result;
      },
    });
  }
  stop() {
    if (this.isWorking) {
      this.instance?.stop();
      this.isWorking = false;
    }
  }
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
