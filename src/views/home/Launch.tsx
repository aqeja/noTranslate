import React, { useCallback, useMemo, useState } from "react";
import {
  Button,
  Select,
  MenuItem,
  Container,
  Card,
  Switch,
  Typography,
  Box,
  Popover,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useQuery } from "react-query";
import { ChevronRight, SettingsOutlined } from "@mui/icons-material";
import {
  AppStatus,
  engineState,
  errorState,
  sentenceListState,
  sourceLangState,
  statusState,
  targetLangState,
  translationEnabledState,
  translationTimerState,
} from "@/store/app";
import { settingsOpenState, micState } from "@/store/app";
import { Engine } from "@/sdks/common";
import Secrets from "./Secrets";
import { getMicDevices } from "@/common/device";
import { OnErrorArg } from "@/sdks/common/toText";
import About from "./About";
import Fresh from "./Fresh";
const check = async ({ translationEnabled, engine }: { translationEnabled: boolean; engine: Engine }) => {
  const result = await engine.toTextEngine.check();

  if (!result.isValid) {
    return result;
  }
  if (translationEnabled) {
    const result = await engine.translateEngine.check();
    if (!result.isValid) {
      return result;
    }
  }
};

const Launch = () => {
  const [sourceLang, setSoureLang] = useRecoilState(sourceLangState);
  const [targetLang, setTargetLang] = useRecoilState(targetLangState);
  const setError = useSetRecoilState(errorState);
  const engine = useRecoilValue(engineState);
  const setList = useSetRecoilState(sentenceListState);
  const setTranslationTimer = useSetRecoilState(translationTimerState);
  const setStatus = useSetRecoilState(statusState);
  const [translationEnabled, setTranslationEnabled] = useRecoilState(translationEnabledState);
  const setSettingsOpen = useSetRecoilState(settingsOpenState);
  const [mic, setMic] = useRecoilState(micState);
  const [micOpen, setMicOpen] = useState(false);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const start = useCallback(async () => {
    const hasError = await check({ translationEnabled, engine });
    const onError = (e: OnErrorArg) => {
      setStatus(AppStatus.error);
      setError({
        ...e,
        open: true,
      });
    };
    if (hasError?.isValid === false) {
      setError({
        ...hasError.detail,
        open: true,
      });
      return;
    }

    engine.toText(sourceLang, {
      onChange: setList,
      onError,
      deviceId: mic.currentDevice,
    });
    setStatus(AppStatus.working);
    if (translationEnabled) {
      setTranslationTimer(
        window.setInterval(() => {
          engine.translate({
            source: sourceLang,
            target: targetLang,
            updateFn: setList,
            onError,
          });
        }, 1000),
      );
    }
  }, [sourceLang, engine, targetLang, setList, setTranslationTimer, setStatus, translationEnabled, setError, mic]);
  const translateLangOptions = useMemo(() => {
    if (sourceLang in engine.translateEngine.langs) {
      return engine.translateEngine.langsList;
    }
    return [];
  }, [sourceLang, engine]);
  const openSettings = useCallback(() => {
    setSettingsOpen(true);
  }, [setSettingsOpen]);
  const { isLoading } = useQuery({
    queryFn: getMicDevices,
    queryKey: "getMicDevices",
    enabled: micOpen,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setMic({
        deviceList: data.audioInputDevices,
        currentDevice: mic.currentDevice || data.defaultDeviceId,
        rejected: data.rejected,
      });
    },
  });
  return (
    <>
      <Box className="flex h-full flex-col">
        <Box sx={{ p: 2 }} className="flex justify-end">
          <About />

          <Button sx={{ ml: 1 }} variant="contained" disableElevation>
            使用说明
          </Button>

          <IconButton sx={{ ml: 1 }} color="primary" onClick={openSettings}>
            <SettingsOutlined />
          </IconButton>
        </Box>
        <Container
          maxWidth="xs"
          sx={{
            my: "auto",
          }}
        >
          <Card variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Avatar
              sx={{
                width: 52,
                height: 52,
                mb: 4,
              }}
              className="block mx-auto "
              src="/site-logo-dark.png"
              alt=""
            />
            <Typography fontSize="small" color="text.secondary" className="flex items-center justify-between">
              音频所用语言
              <Button
                size="small"
                onClick={(e) => {
                  setMicOpen(true);
                  setAnchor(e.currentTarget);
                }}
              >
                音频输入源
                <ChevronRight fontSize="small" />
              </Button>
            </Typography>
            <Select
              sx={{ mt: 1 }}
              fullWidth
              value={sourceLang}
              onChange={(e) => {
                setSoureLang(e.target.value);
              }}
            >
              {engine.toTextEngine.langsList.map((lang) => (
                <MenuItem key={lang.value} value={lang.value} disabled={targetLang === lang.value}>
                  {lang.label}
                </MenuItem>
              ))}
            </Select>
            <Box sx={{ mt: 2 }} className="flex items-center justify-between">
              <Typography fontSize="small" color="text.secondary">
                将识别出的文本翻译至其他语言
              </Typography>
              <Switch
                value={translationEnabled}
                onChange={(_, checked) => {
                  setTranslationEnabled(checked);
                }}
              />
            </Box>
            <div className={translationEnabled ? "" : "invisible"}>
              <Typography sx={{ mt: 2 }} fontSize="small" color="text.secondary">
                选择目标语言
              </Typography>
              <Select
                sx={{ mt: 1 }}
                fullWidth
                value={targetLang}
                onChange={(e) => {
                  setTargetLang(e.target.value);
                }}
              >
                {translateLangOptions.map((lang) => (
                  <MenuItem key={lang.value} value={lang.value} disabled={sourceLang === lang.value}>
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <Button sx={{ mt: 8 }} fullWidth onClick={start} variant="contained" disableElevation>
              开始
            </Button>
          </Card>
        </Container>
      </Box>

      <Secrets />
      <Popover
        open={micOpen}
        anchorEl={anchor}
        TransitionProps={{
          onExited: () => {
            setAnchor(null);
          },
        }}
        onClose={() => {
          setMicOpen(false);
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        {mic.rejected ? (
          <Typography color="text.secondary" sx={{ pt: 2 }} className="text-center">
            未取得麦克风权限
          </Typography>
        ) : (
          <Typography color="text.secondary" sx={{ pt: 2 }} className="text-center">
            选择音频输入源
          </Typography>
        )}
        {isLoading && (
          <Typography sx={{ mt: 4 }} className="text-center">
            正在申请获取麦克风设备权限
          </Typography>
        )}
        <FormControl>
          <RadioGroup
            sx={{ p: 2, minWidth: 300 }}
            value={mic.currentDevice}
            onChange={(_, v) => {
              setMic((p) => ({
                ...p,
                currentDevice: v,
              }));
            }}
          >
            {mic.deviceList.map((device) => (
              <FormControlLabel
                value={device.deviceId}
                control={<Radio />}
                label={device.label}
                key={device.deviceId}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Popover>
      <Fresh />
    </>
  );
};

export default Launch;
