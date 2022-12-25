import React, { useCallback, useMemo } from "react";
import { Formik, Form } from "formik";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  Dialog,
  DialogContent,
  Typography,
  TextField,
  DialogActions,
  Button,
  DialogTitle,
  ToggleButton,
  ToggleButtonGroup,
  Link,
  Switch,
} from "@mui/material";
import { Help } from "@mui/icons-material";
import { engineState, settingsOpenState, toTextEngineState, translateEngineState } from "@/store/app";
import { DEFAULT_SECRETS, Engine_Docs, FORM_KEY_NAMES, appStorage } from "@/common/constants";
import { Abilities, EngineNames, exclusiveEngines, toTextEngines, translateEngines } from "@/sdks/common";

const handleOnBlur = (updater: (field: string, value: any, shouldValidate?: boolean) => void) => {
  return (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
    updater(e.target.name, e.target.value.trim());
  };
};
const Secrets = () => {
  const [settingsOpen, setSettingsOpen] = useRecoilState(settingsOpenState);
  const [currentEngine, setEngine] = React.useState<EngineNames>("baidu");

  const [toTextEngine, setTotextEngine] = useRecoilState(toTextEngineState);
  const [translateEngine, setTranslateEngine] = useRecoilState(translateEngineState);
  const engine = useRecoilValue(engineState);
  const handleAlignment = (_: React.MouseEvent<HTMLElement>, newAlignment: EngineNames | null) => {
    if (newAlignment) {
      setEngine(newAlignment);
    }
  };
  const updateToTextEngine = useCallback(
    (engineName: EngineNames) => {
      engine.setToTextEngine(engineName);
    },
    [engine],
  );
  const updateTranslateEngine = useCallback(
    (engineName: EngineNames) => {
      engine.setTranslateEngine(engineName);
    },
    [engine],
  );
  const switchToTextEngine = useCallback(
    (value: EngineNames) => {
      const targetEngine = toTextEngines.find((item) => item.value === value);
      let _translateEngine = translateEngine;
      setTotextEngine(value);
      if (targetEngine?.exclusive) {
        setTranslateEngine(value);
      } else {
        if (exclusiveEngines.includes(translateEngine)) {
          setTranslateEngine("");
          _translateEngine = "";
        }
      }
      appStorage.set("preference", {
        toTextEngine: value,
        translateEngine: _translateEngine,
      });
      updateToTextEngine(value);
      if (_translateEngine) {
        updateTranslateEngine(_translateEngine);
      }
    },
    [setTotextEngine, setTranslateEngine, translateEngine, updateToTextEngine, updateTranslateEngine],
  );
  const switchTranslateEngine = useCallback(
    (value: EngineNames) => {
      const targetEngine = toTextEngines.find((item) => item.value === value);
      let _toTextEngine = toTextEngine;
      setTranslateEngine(value);

      if (targetEngine?.exclusive) {
        setTotextEngine(value);
      } else {
        if (exclusiveEngines.includes(toTextEngine)) {
          setTotextEngine("");
          _toTextEngine = "";
        }
      }
      appStorage.set("preference", {
        toTextEngine: _toTextEngine,
        translateEngine: value,
      });
      if (_toTextEngine) {
        updateToTextEngine(_toTextEngine);
      }
      updateTranslateEngine(value);
    },
    [setTranslateEngine, setTotextEngine, toTextEngine, updateToTextEngine, updateTranslateEngine],
  );

  const hasToTextAbility = useMemo(() => {
    return toTextEngines.find((item) => item.value === currentEngine)?.abilities.includes(Abilities.toText);
  }, [currentEngine]);
  const hasTranslateAbility = useMemo(() => {
    return translateEngines.find((item) => item.value === currentEngine)?.abilities.includes(Abilities.translate);
  }, [currentEngine]);
  return (
    <Dialog open={settingsOpen} maxWidth="xs" fullWidth>
      <Formik
        initialValues={{
          ...DEFAULT_SECRETS,
          ...appStorage.get("secrets"),
        }}
        onSubmit={(value) => {
          appStorage.set("secrets", value);
          setSettingsOpen(false);
        }}
      >
        {({ values, handleChange, setFieldValue }) => {
          return (
            <Form>
              <DialogTitle>配置项</DialogTitle>

              <DialogContent sx={{ p: 2 }} dividers>
                <ToggleButtonGroup fullWidth sx={{ mb: 2 }} value={currentEngine} exclusive onChange={handleAlignment}>
                  <ToggleButton value="baidu" aria-label="left aligned">
                    百度翻译
                  </ToggleButton>
                  <ToggleButton value="tencent" aria-label="centered">
                    腾讯云
                  </ToggleButton>
                  <ToggleButton value="microsoft" aria-label="right aligned">
                    Microsoft Azure
                  </ToggleButton>
                </ToggleButtonGroup>

                <Typography
                  className="flex items-center justify-between"
                  sx={{ mt: 2, mb: 2 }}
                  color="text.secondary"
                  fontSize="small"
                >
                  密钥等均存储在本地，请放心使用。
                  <Link className="!no-underline" href={Engine_Docs[currentEngine]} target="_blank" rel="noreferrer">
                    <Button size="small" color="primary" startIcon={<Help fontSize="small" />}>
                      如何获取
                    </Button>
                  </Link>
                </Typography>
                {FORM_KEY_NAMES[currentEngine].map((item) => (
                  <TextField
                    fullWidth
                    sx={{ mb: 1 }}
                    key={item.name}
                    className="flex-grow"
                    placeholder={`输入${item.key}`}
                    name={item.name}
                    value={(values[currentEngine] as any)[item.key]}
                    onChange={handleChange}
                    onBlur={handleOnBlur(setFieldValue)}
                  />
                ))}

                {!exclusiveEngines.includes(currentEngine) ? (
                  <>
                    <Typography
                      className="flex items-center"
                      sx={{ mt: 2, mb: 1 }}
                      color="text.secondary"
                      fontSize="small"
                    >
                      {hasToTextAbility ? "使用此服务完成语音转文字" : "无法使用此服务完成语音转文字"}
                      <Switch
                        sx={{
                          ml: "auto",
                        }}
                        checked={toTextEngine === currentEngine}
                        readOnly={toTextEngine === currentEngine}
                        disabled={!hasToTextAbility}
                        onChange={(_, checked) => {
                          if (checked) {
                            switchToTextEngine(currentEngine);
                          }
                        }}
                      />
                    </Typography>
                    <Typography className="flex items-center" color="text.secondary" fontSize="small">
                      {hasTranslateAbility ? "使用此服务完成文本翻译" : "无法使用此服务完成文本翻译"}

                      <Switch
                        sx={{
                          ml: "auto",
                        }}
                        checked={translateEngine === currentEngine}
                        readOnly={translateEngine === currentEngine}
                        disabled={!hasTranslateAbility}
                        onChange={(_, checked) => {
                          if (checked) {
                            switchTranslateEngine(currentEngine);
                          }
                        }}
                      />
                    </Typography>
                  </>
                ) : (
                  <Typography sx={{ mt: 2 }} className="flex items-center" color="text.secondary" fontSize="small">
                    使用此服务完成语音转文字和文本翻译
                    <Switch
                      sx={{
                        ml: "auto",
                      }}
                      checked={translateEngine === currentEngine}
                      readOnly={translateEngine === currentEngine}
                      disabled={!hasTranslateAbility}
                      onChange={(_, checked) => {
                        if (checked) {
                          setTotextEngine(currentEngine);
                          setTranslateEngine(currentEngine);
                          appStorage.set("preference", {
                            toTextEngine: currentEngine,
                            translateEngine: currentEngine,
                          });
                          updateToTextEngine(currentEngine);
                          updateTranslateEngine(currentEngine);
                        }
                      }}
                    />
                  </Typography>
                )}
              </DialogContent>

              <DialogActions>
                <Button
                  color="inherit"
                  onClick={() => {
                    setSettingsOpen(false);
                  }}
                >
                  取消
                </Button>
                <Button disableElevation variant="contained" type="submit">
                  保存
                </Button>
              </DialogActions>
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default Secrets;
