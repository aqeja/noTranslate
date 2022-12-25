import { BaiduEngine } from "../baidu";
import { MicroSoftToTextEngine } from "../microsoft";
import { TencentEngine } from "../tencent";
import { LangItem, SupportedLangs } from "./baseEngine";
import { BaseToTextEngine } from "./toText";
import { BaseTranslateEngine, SentenceItem, TranslationStatus } from "./translate";

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
    exclusive: false,
  },
  {
    label: "百度",
    value: "baidu" as const,
    abilities: [Abilities.translate],
    constructor: BaiduEngine,
    exclusive: false,
  },
  {
    label: "微软",
    value: "microsoft" as const,
    abilities: [Abilities.toText, Abilities.translate],
    constructor: MicroSoftToTextEngine,
    exclusive: true,
  },
];

export const toTextEngines = engines.filter((engine) => engine.abilities.includes(Abilities.toText));
export const translateEngines = engines.filter((engine) => engine.abilities.includes(Abilities.translate));
export const exclusiveEngines = engines.filter((engine) => engine.exclusive).map((item) => item.value) as (
  | EngineNames
  | ""
)[];
export type EngineNames = typeof engines[number]["value"];

export function createEngineInstance(engineName: EngineNames, parent: Engine) {
  const engine = engines.find((item) => item.value === engineName);
  if (!engine) throw new Error("no engine"); // TODO 报错完善
  return new engine.constructor(parent);
}

export function createEngine(engineName: EngineNames, ability: Abilities, parent: Engine) {
  const engine = engines.find((item) => item.value === engineName);
  if (!engine || !engine.abilities.includes(ability)) {
    throw Error("unavaliable"); // TODO 报错完善
  }
  return createEngineInstance(engineName, parent);
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
  toTextEngine!: BaseToTextEngine;
  translateEngine!: BaseTranslateEngine;
  constructor(toTextEngineName: EngineNames, translateEngineName: EngineNames) {
    this.setToTextEngine(toTextEngineName);
    this.setTranslateEngine(translateEngineName);
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
    this.toTextEngine = createEngine(engineName, Abilities.toText, this) as BaseToTextEngine;
  }
  setTranslateEngine(engineName: EngineNames) {
    this.translateEngine = createEngine(engineName, Abilities.translate, this) as BaseTranslateEngine;
  }
  stop() {
    this.toTextEngine.stop();
  }
}
