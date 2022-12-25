import type {
  SpeechConfig,
  AudioConfig,
  SpeechRecognizer,
  ResultReason,
  TranslationRecognizer,
  SpeechTranslationConfig,
} from "microsoft-cognitiveservices-speech-sdk";
// import * as speech from "microsoft-cognitiveservices-speech-sdk";
import { getTokenOrRefresh } from "./utils";
import { TranslationStatus } from "../common/translate";
import type { EngineNames } from "../common";
import { BaseToTextEngine, OnErrorArg, ToTextOptions } from "../common/toText";
import "microsoft-cognitiveservices-speech-sdk/distrib/browser/microsoft.cognitiveservices.speech.sdk.bundle";
import { appStorage } from "@/common/constants";

declare global {
  interface Window {
    SpeechSDK: {
      SpeechConfig: typeof SpeechConfig;
      AudioConfig: typeof AudioConfig;
      SpeechRecognizer: typeof SpeechRecognizer;
      TranslationRecognizer: typeof TranslationRecognizer;
      ResultReason: typeof ResultReason;
      SpeechTranslationConfig: typeof SpeechTranslationConfig;
    };
  }
}
const speechSdk = window.SpeechSDK;
console.log(speechSdk);
export class MicroSoftToTextEngine extends BaseToTextEngine {
  name: EngineNames = "microsoft";
  private recognizer: TranslationRecognizer | null = null;
  /**
   * https://learn.microsoft.com/zh-cn/azure/cognitive-services/speech-service/language-support?tabs=stt-tts
   */
  langs = {
    zh: {
      label: "中文（大陆）",
      /**
       * https://learn.microsoft.com/zh-cn/azure/cognitive-services/speech-service/language-support?tabs=stt-tts
       */
      toText: "zh-CN",
      /**
       * https://learn.microsoft.com/zh-cn/azure/cognitive-services/speech-service/language-support?tabs=speech-translation
       */
      translation: "zh-Hans",
    },
    en: {
      label: "英语（美国）",
      toText: "en-US",
      translation: "en",
    },
    ja: {
      label: "日语",
      toText: "ja-JP",
      translation: "ja",
    },
    ko: {
      label: "韩语",
      toText: "ko-KR",
      translation: "ko",
    },
  };
  async check(): Promise<{ isValid: boolean; detail: OnErrorArg }> {
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
  stop(): void {
    this.recognizer?.stopContinuousRecognitionAsync();
  }
  async toText(
    lang: string,
    { deviceId, onChange, onError, onComplete, onSentenceEnd, translationEnabled = false, target }: ToTextOptions,
  ) {
    const _lang = this.langs[lang as "zh"].toText;
    const _target = this.langs[lang as "zh"].translation;
    try {
      console.log(window.SpeechSDK);
    } catch (err) {
      console.log(err);
    }
    const {
      SpeechConfig,
      AudioConfig,
      SpeechRecognizer,
      ResultReason,
      TranslationRecognizer,
      SpeechTranslationConfig,
    } = speechSdk;
    const { SubscriptionKey, Region } = appStorage.get("secrets")?.microsoft ?? { SubscriptionKey: "", Region: "" };
    const speechConfig = SpeechTranslationConfig.fromSubscription(SubscriptionKey, Region);
    speechConfig.speechRecognitionLanguage = _lang;
    speechConfig.addTargetLanguage(_target);
    const audioConfig = AudioConfig.fromMicrophoneInput(deviceId);

    const recognizer = new TranslationRecognizer(speechConfig, audioConfig);
    recognizer.recognized = (_, e) => {
      if (e.result.reason === ResultReason.RecognizedSpeech) {
        // console.log(`RECOGNIZED: Text=${e.result.text}`);
      } else if (e.result.reason === ResultReason.NoMatch) {
        // console.log("NOMATCH: Speech could not be recognized.");
      }
    };

    recognizer.recognizing = (_, e) => {
      let displayText;
      const { result } = e;
      if (result.reason === ResultReason.RecognizedSpeech) {
        displayText = `RECOGNIZED: Text=${result.text}`;
        console.log("endeded");
      } else {
        displayText =
          "ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.";
      }
      const targetLang = result.translations.languages[0];
      const target = translationEnabled ? result.translations.get(targetLang) : "";
      const sentence = {
        source: result.text,
        target,
        isSentence: true,
        status: target ? TranslationStatus.success : TranslationStatus.unset,
        key: result.offset,
      };
      this.addSentence({
        source: sentence.source,
        key: sentence.key,
        target,
      });
      onChange((p) => {
        const newSentences = p.filter((item) => item.key !== result.offset);
        return [...newSentences, sentence];
      });
    };
    recognizer.startContinuousRecognitionAsync();
    this.recognizer = recognizer;
  }
  /**
   * 暂时不用
   */
  async toSpeechText(lang: string, { deviceId, onChange, onError, onComplete, onSentenceEnd }: ToTextOptions) {
    console.log(lang);
    const tokenObj = {
      authToken: "e589e1bcda724c2fb3cf53bae68a1804",
      region: "eastasia",
    };
    const _lang = this.langs[lang as "zh"].toText;
    try {
      console.log(window.SpeechSDK);
    } catch (err) {
      console.log(err);
    }
    const { SpeechConfig, AudioConfig, SpeechRecognizer, ResultReason } = speechSdk;
    const speechConfig = SpeechConfig.fromSubscription(tokenObj.authToken, tokenObj.region);
    speechConfig.speechRecognitionLanguage = _lang;
    const audioConfig = AudioConfig.fromMicrophoneInput(deviceId);
    const recognizer = new SpeechRecognizer(speechConfig, audioConfig);

    recognizer.recognized = (_, e) => {
      // console.log(e);
      if (e.result.reason === ResultReason.RecognizedSpeech) {
        // console.log(`RECOGNIZED: Text=${e.result.text}`);
      } else if (e.result.reason === ResultReason.NoMatch) {
        // console.log("NOMATCH: Speech could not be recognized.");
      }
    };

    recognizer.recognizing = (_, e) => {
      let displayText;
      const { result } = e;
      console.log(e.result.offset, e.result.reason, e.result.text);
      if (result.reason === ResultReason.RecognizedSpeech) {
        displayText = `RECOGNIZED: Text=${result.text}`;
        console.log("endeded");
      } else {
        displayText =
          "ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.";
      }
      const sentence = {
        source: result.text,
        target: "",
        isSentence: true,
        status: TranslationStatus.unset,
        key: result.offset,
      };
      this.addSentence({
        source: sentence.source,
        key: sentence.key,
      });
      onChange((p) => {
        const newList = p.filter((item) => item.key !== result.offset);
        return [...newList, sentence];
      });
    };
    recognizer.startContinuousRecognitionAsync();
    // this.recognizer = recognizer;
  }
}
