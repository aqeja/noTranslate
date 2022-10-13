import Axios from "axios";
const instance = Axios.create({});
export default instance;

function isPlainObject(data: unknown): data is Record<string, string | number> {
  return Object.prototype.toString.call(data) === "[object Object]";
}

export const jsonp = <T = unknown>(url: string, data: unknown) => {
  if (!url) throw new Error("url is necessary");
  const callbackName = "CALLBACK" + Math.random().toString(16).slice(2);
  const JSONPScriptTag = document.createElement("script");
  JSONPScriptTag.setAttribute("type", "text/javascript");

  const headElement = document.getElementsByTagName("head")[0];

  let query = "";
  if (data) {
    if (typeof data === "string") {
      query = "&" + data;
    } else if (isPlainObject(data)) {
      for (const key in data) {
        query += "&" + key + "=" + encodeURIComponent(data[key]);
      }
    }

    query += "&_STAMP=" + Date.now();
  }
  JSONPScriptTag.src = `${url}?callback=${callbackName}${query}`;
  return new Promise<T>((resolve) => {
    const _window = window as any;
    _window[callbackName] = (r: T) => {
      resolve(r);
      headElement.removeChild(JSONPScriptTag);
      delete _window[callbackName];
    };
    headElement.appendChild(JSONPScriptTag);
  });
};
