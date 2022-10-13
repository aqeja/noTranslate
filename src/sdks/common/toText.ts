import { BaseEngine } from "./baseEngine";
import { SentenceItem } from "./translate";
import type { Engine } from ".";
export type OnErrorArg = {
  code: string;
  message: string;
  source: string;
};
export type ToTextOptions = {
  onChange: (texts: SentenceItem[]) => void;
  onSentenceEnd?: () => void;
  onError?: (err: OnErrorArg) => void;
  onComplete?: () => void;
  deviceId: string;
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
}
