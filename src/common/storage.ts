export default class Storage<T extends Record<string, any>> {
  set<K extends keyof T>(key: K, value: T[K]) {
    switch (typeof value) {
      case "bigint":
      case "function":
      case "symbol":
      case "undefined":
        throw new Error("无效的数据");
      default:
        window.localStorage.setItem(key.toString(), JSON.stringify(value));
    }
  }
  get<K extends keyof T>(key: K): T[K] | null {
    const value = window.localStorage.getItem(key.toString());
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch (err) {
      return null;
    }
  }
  remove(key: string) {
    window.localStorage.removeItem(key);
  }
}
