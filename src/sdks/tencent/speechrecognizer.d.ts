/**
 * @see https://cloud.tencent.com/document/product/1093/48982#jump
 */
export type SpeechRecognizerParams = {
  appid: string;
  secretid: string;
  signCallback?: (sign: string) => void;
  engine_model_type: string; // 因为内置WebRecorder采样16k的数据，所以参数 engineModelType 需要选择16k的引擎，为 '16k_zh'
} & Partial<{
  voice_format: number;
  hotword_id: string;
  needvad: number;
  filter_dirty: 0 | 1 | 2;
  filter_modal: 0 | 1 | 2;
  filter_punc: 0 | 1 | 2;
  convert_num_mode: 0 | 1 | 2;
  word_info: 0 | 1 | 2;
}>;
export default class SpeechRecognizer {
  constructor(params: SpeechRecognizerParams);
}
export const NewCredential: any;
