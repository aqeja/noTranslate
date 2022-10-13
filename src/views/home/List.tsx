import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Typography, Button, Box, Divider, Avatar, FormControlLabel, Switch } from "@mui/material";
import { ArrowRightAltSharp, StopCircle, Refresh, FileDownload } from "@mui/icons-material";
import {
  AppStatus,
  engineState,
  scrollTimerState,
  sentenceListState,
  sourceLangState,
  statusState,
  targetLangState,
  translationEnabledState,
  translationTimerState,
} from "@/store/app";
import { Spinner } from "@/components";
import VolumeIndicator from "./Volume";
import { TranslationStatus } from "@/sdks/common/translate";
function exportAsTxt(data: string, fileName: string) {
  const blob = new Blob([data], { type: "plain/text" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
type SentenceProps = {
  source: string;
  target: string;
  status: TranslationStatus;
  isSentence: boolean;
  translationEnabled: boolean;
};
const SentenceItem = ({ translationEnabled, source, status, target, isSentence }: SentenceProps) => {
  if (!isSentence) return null;

  return (
    <Box className="whitespace-pre-line" sx={{ mb: 4 }}>
      {translationEnabled ? (
        <>
          <Typography fontSize="small" color="text.secondary">
            {source}
          </Typography>
          <Typography sx={{ mt: 1 }} color="text.primary">
            {status === TranslationStatus.processing ? <Spinner /> : target}
          </Typography>
        </>
      ) : (
        <Typography color="text.primary">{source}</Typography>
      )}
    </Box>
  );
};

const List = () => {
  const sourceLang = useRecoilValue(sourceLangState);
  const targetLang = useRecoilValue(targetLangState);
  const [list, setList] = useRecoilState(sentenceListState);
  const engine = useRecoilValue(engineState);
  const [status, setStatus] = useRecoilState(statusState);
  const translationTimer = useRecoilValue(translationTimerState);
  const translationEnabled = useRecoilValue(translationEnabledState);
  const ref = useRef<HTMLElement>(null);
  const [scrollTimer, setScrollTimer] = useRecoilState(scrollTimerState);
  const [autoScrollToBottom, setAutoScrollToBottom] = useState(true);
  const stop = useCallback(() => {
    engine.stop();
    window.clearInterval(translationTimer ?? 0);
    window.clearInterval(scrollTimer ?? 0);
    setStatus(AppStatus.finished);
  }, [engine, translationTimer, setStatus, scrollTimer]);
  const [scrollTop, setScrollTop] = useState(0);
  const reset = useCallback(() => {
    engine.reset();
    setList([]);
    setStatus(AppStatus.idle);
  }, [engine, setList, setStatus]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timer = window.setInterval(() => {
      if (autoScrollToBottom) {
        const toTop = el.scrollTop;
        el.scrollTop = el.scrollTop + 999;
        setScrollTop(toTop);
      }
    }, 500);
    setScrollTimer(timer);
    return () => {
      window.clearInterval(timer);
    };
  }, [setScrollTimer, autoScrollToBottom]);
  const audioVisualiseDataGetter = useCallback(() => {
    return engine.toTextEngine.audioVisualiseData;
  }, [engine]);
  return (
    <>
      <Box
        className="h-16 dark:bg-[#2a2a2a] flex items-center text-base flex-shrink-0 whitespace-nowrap"
        sx={{ px: 2 }}
      >
        <div className="flex-1">
          <Avatar
            sx={{
              width: 34,
              height: 34,
            }}
            src="/site-logo-dark.png"
            alt=""
          />
        </div>
        <Typography color="text.primary" className="inline-flex items-center flex-1 justify-center">
          <span>{engine.toTextEngine.getLangLabel(sourceLang)}</span>

          {translationEnabled && (
            <>
              <ArrowRightAltSharp sx={{ mx: 2 }} fontSize="small" />
              <span>{engine.translateEngine.getLangLabel(targetLang)}</span>
            </>
          )}
        </Typography>
        <div className="flex-1 inline-flex items-center justify-end">
          <Button
            size="small"
            variant="outlined"
            disabled={status !== AppStatus.finished}
            sx={{ mr: 2 }}
            startIcon={<FileDownload />}
            onClick={() => {
              const sentences = list
                .filter((item) => item.isSentence)
                .reduce((acc: string[], item) => {
                  return [...acc, item.source, "\n", item.target, "\n\n"];
                }, []);
              exportAsTxt(sentences.join(""), "文本.txt");
            }}
          >
            导出为文本
          </Button>

          {status === AppStatus.working && (
            <Button size="small" color="error" onClick={stop} startIcon={<StopCircle />}>
              结束
            </Button>
          )}

          {[AppStatus.error, AppStatus.finished].includes(status) && (
            <Button size="small" startIcon={<Refresh />} onClick={reset} key={1}>
              重新开始
            </Button>
          )}
        </div>
      </Box>

      <Box
        ref={ref}
        sx={{ p: 3 }}
        className="dark:bg-white bg-opacity-5 bg-gray-600 dark:bg-opacity-10 rounded-t-2xl flex-grow overflow-auto"
      >
        {list.map(({ key, ...rest }) => (
          <SentenceItem {...rest} key={key} translationEnabled={translationEnabled} />
        ))}
        {status === AppStatus.working && list.length === 0 && <Spinner />}
      </Box>
      <Divider />
      <Box
        className="relative flex items-center justify-center dark:bg-white bg-opacity-5 bg-gray-600 dark:bg-opacity-10"
        sx={{ py: 2, px: 3 }}
      >
        <VolumeIndicator dataGetter={audioVisualiseDataGetter} />

        {scrollTop > 0 && (
          <FormControlLabel
            className="top-1/2 -translate-y-1/2"
            sx={{ position: "absolute", right: 24 }}
            control={
              <Switch
                size="small"
                checked={autoScrollToBottom}
                onChange={(_, v) => {
                  setAutoScrollToBottom(v);
                }}
              />
            }
            label={
              <Typography sx={{ ml: 1 }} fontSize="small" color="text.primary">
                自动滚动到底部
              </Typography>
            }
          />
        )}
      </Box>
      <Divider />
    </>
  );
};

export default List;
