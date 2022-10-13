import { BaiduEngine } from "../baidu";
import { TencentEngine } from "../tencent";
import { LangItem, SupportedLangs } from "./baseEngine";
import { BaseToTextEngine } from "./toText";
import { BaseTranslateEngine, SentenceItem, TranslationStatus } from "./translate";

/**
 * 分句标识
 */
export const punctuations = /(，|,|。)\s*|(\.\s+)/g;

/**
 * 引擎提供的能力
 */
export enum Abilities {
  toText = "toText",
  translate = "translate",
}
export const engines = [
  {
    label: "腾讯",
    value: "tencent" as const,
    abilities: [Abilities.toText],
    constructor: TencentEngine,
  },
  {
    label: "百度",
    value: "baidu" as const,
    abilities: [Abilities.translate],
    constructor: BaiduEngine,
  },
];

export type EngineNames = typeof engines[number]["value"];

export function createEngineInstance(engineName: EngineNames, parent: Engine) {
  const engine = engines.find((item) => item.value === engineName);
  if (!engine) throw new Error("no engine"); // TODO 报错完善
  return new engine.constructor(parent);
}

export function createEngine<T>(engineName: EngineNames, ability: Abilities, parent: Engine) {
  const engine = engines.find((item) => item.value === engineName);
  if (!engine || !engine.abilities.includes(ability)) {
    throw Error("unavaliable"); // TODO 报错完善
  }
  return createEngineInstance(engineName, parent) as T;
}

export class Engine {
  dictionary = new Map<
    string,
    {
      status: TranslationStatus;
      value: string;
    }
  >();
  sentences: SentenceItem[] = [];
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
  toTextEngine: BaseToTextEngine;
  translateEngine: BaseTranslateEngine;
  constructor(toTextEngineName: EngineNames, translateEngineName: EngineNames) {
    this.toTextEngine = createEngine(toTextEngineName, Abilities.toText, this);
    this.translateEngine = createEngine(translateEngineName, Abilities.translate, this);
  }
  reset() {
    this.dictionary.clear();
    this.sentences = [];
  }
  translate(
    args: Pick<Parameters<BaseTranslateEngine["handleTranslate"]>[0], "source" | "target" | "updateFn" | "onError">,
  ) {
    const sourceLang = this.translateEngine.langs[args.source].translation;
    const targetLang = this.translateEngine.langs[args.target].translation;
    return this.translateEngine.handleTranslate({
      ...args,
      sentences: this.sentences,
      dictionary: this.dictionary,
      source: sourceLang,
      target: targetLang,
    });
  }
  toText(...args: Parameters<BaseToTextEngine["toText"]>) {
    this.toTextEngine.toText(...args);
  }
  setToTextEngine(engineName: EngineNames) {
    this.toTextEngine = createEngine(engineName, Abilities.toText, this);
  }
  setTranslateEngine(engineName: EngineNames) {
    this.toTextEngine = createEngine(engineName, Abilities.translate, this);
  }
  stop() {
    this.toTextEngine.stop();
  }
}
