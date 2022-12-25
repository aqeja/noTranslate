import type { SetterOrUpdater } from "recoil";
import { BaseEngine } from "./baseEngine";
import { SentenceItem, TranslationStatus } from "./translate";
import { Engine } from ".";
/**
 * 分句标识
 */
export const punctuations = /(，|,|。)\s*|(\.\s+)/;
export type OnErrorArg = {
  code: string;
  message: string;
  source: string;
};
export type ToTextOptions = {
  onChange: SetterOrUpdater<SentenceItem[]>;
  onSentenceEnd?: () => void;
  onError?: (err: OnErrorArg) => void;
  onComplete?: () => void;
  deviceId: string;
  translationEnabled: boolean;
  target: string;
};
export abstract class BaseToTextEngine extends BaseEngine {
  constructor(public root: Engine) {
    super();
  }
  /**
   * 语音转文本
   */
  abstract toText(lang: string, options: ToTextOptions): void;
  abstract stop(): void;
  audioVisualiseData: number[] = [];
  addSentence({ source, target, key }: { source: string; target?: string; key: string | number }) {
    this.root.sentences = this.root.sentences.filter((item) => item.key !== key);
    const isPunctuation = punctuations.test(source);
    const dictionary = this.root.dictionary;
    const translationExist = dictionary.has(source) && dictionary.get(source)?.status === TranslationStatus.success;
    if (target) {
      dictionary.set(source, {
        status: TranslationStatus.success,
        value: target,
      });
    }
    this.root.sentences.push({
      key,
      isSentence: !isPunctuation,
      source: source,
      target: isPunctuation ? source : translationExist ? dictionary.get(source)?.value || "" : "",
      status: isPunctuation ? TranslationStatus.success : dictionary.get(source)?.status || TranslationStatus.unset,
    });
  }
}
