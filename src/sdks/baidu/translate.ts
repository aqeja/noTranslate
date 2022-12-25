import SparkMD5 from "spark-md5";
import { appStorage } from "@/common/constants";
import { jsonp } from "@/common/request";

export const translate = ({ source, target, textList }: { source: string; target: string; textList: string[] }) => {
  const q = textList.join("\n");
  const salt = "salt";
  const { AppId, Secret } = appStorage.get("secrets")?.baidu ?? { AppId: "", Secret: "" };
  const signStr = `${AppId}${q}${salt}${Secret}`;
  const md5 = new SparkMD5();
  md5.append(signStr);
  const sign = md5.end();
  return jsonp<
    | {
        from: string;
        to: string;
        trans_result: {
          src: string;
          dst: string;
        }[];
      }
    | {
        error_code: string;
        error_msg: string;
      }
  >("https://fanyi-api.baidu.com/api/trans/vip/translate", {
    q,
    from: source || "auto",
    to: target,
    appid: AppId,
    salt,
    sign,
  });
};
