/**
 * @see https://cloud.tencent.com/document/product/1093/48982
 */

export type Word = {
  word: string;
  start_time: number;
  end_time: number;
  /**
   * 该词的稳态结果，0表示该词在后续识别中可能发生变化，1表示该词在后续识别过程中不会变化
   */
  stable_flag: 0 | 1;
};
export type Result = {
  code: number;
  message: string;
  message_id: string;
  result: {
    end_time: number;
    index: number;
    slice_type: 0 | 1 | 2;
    start_time: number;
    voice_text_str: string;
    word_list: Word[];
    // 当前一段话的词结果个数
    word_size: number;
  };
  voice_id: string;
};
declare class WebAudioSpeechRecognizer {
  constructor(params: import("./speechrecognizer").SpeechRecognizerParams);
  start(arg: import("./webrecorder").WebRecorderStartArg & { onReceiveData: (data: Int8Array) => void }): void;
  stop(): void;
  OnRecognitionStart(res: unknown): void;
  OnSentenceBegin(sentence: unknown): void;
  OnRecognitionResultChange(res: Result): void;
  OnSentenceBegin(res: unknown): void;
  OnSentenceEnd(res: unknown): void;
  OnRecognitionComplete(res: unknown): void;
  OnError(reason: { code: string; message: string } | CloseEvent): void;
}

export default WebAudioSpeechRecognizer;
