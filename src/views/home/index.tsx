import React, { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AppStatus, engineState, statusState, toTextEngineState, translateEngineState } from "@/store/app";
import { Box } from "@mui/material";
import Launch from "./Launch";
import Errors from "./Errors";
import List from "./List";
import { appStorage } from "@/common/constants";
import { EngineNames } from "@/sdks/common";

const Home = () => {
  const status = useRecoilValue(statusState);
  const setTranslateEngine = useSetRecoilState(translateEngineState);
  const setToTextEngine = useSetRecoilState(toTextEngineState);
  const engine = useRecoilValue(engineState);
  useEffect(() => {
    const secrets = appStorage.get("secrets");
    const preferences = appStorage.get("preference");
    const isBaiduSecretsReady = Object.values(secrets?.baidu ?? {}).every((item) => item.length > 0);
    const isTencentSecretsReady = Object.values(secrets?.tencent ?? {}).every((item) => item.length > 0);

    if (!preferences?.toTextEngine && !preferences?.translateEngine) {
      let toTextEngine: EngineNames | "" = "";
      let translateEngine: EngineNames | "" = "";
      if (isBaiduSecretsReady) {
        translateEngine = "baidu";
      }
      if (isTencentSecretsReady) {
        toTextEngine = "tencent";
      }
      console.log(isBaiduSecretsReady, isTencentSecretsReady, preferences, "xxx2");
      appStorage.set("preference", {
        toTextEngine,
        translateEngine,
      });
      setTranslateEngine(translateEngine);
      setToTextEngine(toTextEngine);
      if (translateEngine) {
        engine.setTranslateEngine(translateEngine);
      }
      if (toTextEngine) {
        engine.setToTextEngine(toTextEngine);
      }
    }
  }, [setToTextEngine, setTranslateEngine, engine]);
  return (
    <Box className="flex flex-col h-screen">
      {status === AppStatus.idle && <Launch />}
      {status !== AppStatus.idle && <List />}
      <Errors />
    </Box>
  );
};

export default Home;
