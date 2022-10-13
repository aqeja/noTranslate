import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { useSetRecoilState } from "recoil";
import { settingsOpenState } from "@/store/app";
import { secretsStorage } from "@/common/storage";
import { Close } from "@mui/icons-material";
function isValueEmpty(v: Record<string, string> = {}) {
  const values = Object.values(v);
  return values.length === 0 || values.every((v) => v.trim() === "");
}
function AlertDialog() {
  const [open, setOpen] = React.useState(false);
  const setSettingsOpen = useSetRecoilState(settingsOpenState);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const secrets = secretsStorage.get("secrets");

    const isBaiduUnSet = isValueEmpty(secrets?.baidu);
    const isTencentUnSet = isValueEmpty(secrets?.tencent);
    let timer: number | null = null;
    if (isBaiduUnSet && isTencentUnSet) {
      timer = setTimeout(() => {
        setOpen(true);
      }, 2000);
    }
    return () => {
      timer && clearTimeout(timer);
    };
  }, []);
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle className="flex items-center justify-between">
          提示
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 4 }}>
          <DialogContentText id="alert-dialog-description">
            你还没有填入所需的百度/腾讯平台的相关开发密钥等信息，无法正常使用语音转文本、文本翻译等全部功能，是否现在进行设置？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>如何获取？</Button>
          <Button
            variant="contained"
            disableElevation
            autoFocus
            onClick={() => {
              handleClose();
              setSettingsOpen(true);
            }}
          >
            立即设置
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default React.memo(AlertDialog);
