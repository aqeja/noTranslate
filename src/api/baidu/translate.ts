import SparkMD5 from "spark-md5";
import { jsonp } from "@/common/request";

export const APP_ID = "20200602000483888";
export const SECRET = "jtl7w4Ybsq53decwAi1k";

export const translate = ({ source, target, textList }: { source: string; target: string; textList: string[] }) => {
  const q = textList.join("\n");
  const salt = "salt";
  const signStr = `${APP_ID}${q}${salt}${SECRET}`;
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
    appid: APP_ID,
    salt,
    sign,
  });
};

// translate(["你好", "你是谁？"]);
