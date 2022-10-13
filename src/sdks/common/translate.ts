import { BaseEngine } from "./baseEngine";
import type { Engine } from "./";

export enum TranslationStatus {
  processing = "loading",
  success = "success",
  failed = "failed",
  unset = "unset",
}

export type TranslateResult =
  | {
      isValid: true;
      data: string[];
    }
  | {
      isValid: false;
      code: string;
      message: string;
    };
export type SentenceDictionary = Map<
  string,
  {
    status: TranslationStatus;
    value: string;
  }
>;
export type SentenceItem = {
  source: string;
  target: string;
  status: TranslationStatus;
  key: string | number;
  isSentence: boolean;
};
export abstract class BaseTranslateEngine extends BaseEngine {
  constructor(public root: Engine) {
    super();
  }
  /**
   * 翻译
   */
  abstract translate(arg: { source: string; target: string; textList: string[] }): Promise<TranslateResult>;
  handleTranslate({
    source: from,
    target: to,
    sentences,
    dictionary,
    updateFn,
    onError,
  }: {
    source: string;
    target: string;
    sentences: SentenceItem[];
    dictionary: SentenceDictionary;
    updateFn: (value: React.SetStateAction<SentenceItem[]>) => void;
    onError?: (err: { code: string; message: string; source: string }) => void;
  }) {
    if (sentences.length === 0) return;
    const texts = sentences
      .filter(
        (item) => [TranslationStatus.unset, TranslationStatus.processing].includes(item.status) && item.isSentence,
      )
      .map((item) => item.source)
      .slice(-5);
    texts.forEach((item) => {
      updateFn((list) =>
        list.map((i) =>
          i.source === item
            ? {
                ...i,
                status: TranslationStatus.processing,
              }
            : i,
        ),
      );
    });
    return this.translate?.({
      source: from,
      target: to,
      textList: texts,
    }).then((res) => {
      if (res.isValid) {
        const TargetTextList = res.data;
        for (let i = 0; i < texts.length; i++) {
          const source = texts[i];
          const target = TargetTextList[i];
          if (dictionary.has(source)) {
            dictionary.set(texts[i], {
              status: TranslationStatus.success,
              value: target,
            });
          }
          updateFn((list) =>
            list.map((item) =>
              item.source === source
                ? {
                    ...item,
                    target,
                    status: TranslationStatus.success,
                  }
                : item,
            ),
          );
        }
      } else {
        onError?.({
          code: res.code,
          message: res.message,
          source: this.name,
        });
      }
      return res;
    });
  }
}
