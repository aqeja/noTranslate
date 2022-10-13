import React, { useCallback } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { useRecoilState } from "recoil";
import { errorState } from "@/store/app";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export default function Errors() {
  const [error, setError] = useRecoilState(errorState);
  const handleClose = useCallback(() => {
    setError((p) => ({
      ...p,
      open: false,
    }));
  }, [setError]);

  return (
    <BootstrapDialog onClose={handleClose} open={error.open} maxWidth="xs" fullWidth>
      <BootstrapDialogTitle id="close" onClose={handleClose}>
        出错了！
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Typography fontSize="small" color="text.secondary" gutterBottom>
          错误码
        </Typography>
        <Typography>{error.code}</Typography>
        <Typography sx={{ mt: 2 }} fontSize="small" color="text.secondary" gutterBottom>
          错误内容
        </Typography>
        <Typography>{error.message}</Typography>
        <Typography sx={{ mt: 2 }} fontSize="small" color="text.secondary" gutterBottom>
          错误来源
        </Typography>
        <Typography>{error.source}</Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          我知道了
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
