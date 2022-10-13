import React from "react";
import { Formik, Form } from "formik";
import { useRecoilState } from "recoil";
import { Dialog, DialogContent, Typography, TextField, DialogActions, Button, Box, DialogTitle } from "@mui/material";
import { Help } from "@mui/icons-material";
import { settingsOpenState } from "@/store/app";
import { DEFAULT_SECRETS, secretsStorage } from "@/common/storage";
const handleOnBlur = (updater: (field: string, value: any, shouldValidate?: boolean) => void) => {
  return (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
    updater(e.target.name, e.target.value.trim());
  };
};
const Secrets = () => {
  const [settingsOpen, setSettingsOpen] = useRecoilState(settingsOpenState);

  return (
    <Dialog open={settingsOpen} maxWidth="xs" fullWidth>
      <Formik
        initialValues={{
          ...DEFAULT_SECRETS,
          ...secretsStorage.get("secrets"),
        }}
        onSubmit={(value) => {
          secretsStorage.set("secrets", value);
          setSettingsOpen(false);
        }}
      >
        {({ values, handleChange, setFieldValue }) => {
          return (
            <Form>
              <DialogTitle>配置项</DialogTitle>
              <DialogContent sx={{ p: 2 }} dividers>
                <Typography color="text.secondary" fontSize="small" className="flex items-center justify-between">
                  腾讯语音识别
                  <a
                    className="inline-block"
                    href="https://cloud.tencent.com/document/product/1093/48982"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button size="small" color="primary" startIcon={<Help fontSize="small" />}>
                      如何获取
                    </Button>
                  </a>
                </Typography>
                <TextField
                  placeholder="输入AppId"
                  fullWidth
                  sx={{ my: 1 }}
                  name="tencent.AppId"
                  value={values.tencent.AppId}
                  onChange={handleChange}
                  onBlur={handleOnBlur(setFieldValue)}
                />
                <Box className="flex">
                  <TextField
                    className="flex-grow"
                    placeholder="输入SecretId"
                    sx={{ mr: 1 }}
                    name="tencent.SecretId"
                    value={values.tencent.SecretId}
                    onChange={handleChange}
                    onBlur={handleOnBlur(setFieldValue)}
                  />
                  <TextField
                    className="flex-grow"
                    placeholder="输入SecretKey"
                    name="tencent.SecretKey"
                    value={values.tencent.SecretKey}
                    onChange={handleChange}
                    onBlur={handleOnBlur(setFieldValue)}
                  />
                </Box>
                {/* <Button fullWidth variant="outlined" sx={{ mt: 1 }} startIcon={<Bolt />}>
                  测试
                </Button> */}
                <Typography
                  sx={{ mt: 4, mb: 1 }}
                  color="text.secondary"
                  fontSize="small"
                  className="flex items-center justify-between"
                >
                  百度文本翻译
                  <a href="https://fanyi-api.baidu.com/doc/21" target="_blank" rel="noreferrer">
                    <Button size="small" color="primary" startIcon={<Help fontSize="small" />}>
                      如何获取
                    </Button>
                  </a>
                </Typography>

                <Box className="flex">
                  <TextField
                    placeholder="输入AppId"
                    className="flex-grow"
                    sx={{ mr: 1 }}
                    name="baidu.AppId"
                    value={values.baidu.AppId}
                    onChange={handleChange}
                    onBlur={handleOnBlur(setFieldValue)}
                  />
                  <TextField
                    placeholder="输入Secret"
                    className="flex-grow"
                    name="baidu.Secret"
                    value={values.baidu.Secret}
                    onChange={handleChange}
                    onBlur={handleOnBlur(setFieldValue)}
                  />
                </Box>
                <Typography sx={{ mt: 4 }} color="text.secondary" fontSize="small">
                  密钥等信息均存储在本地，不会上传至服务器，请放心使用。
                </Typography>
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
