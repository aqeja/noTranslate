import React, { useState } from "react";
import { Avatar, Box, Typography, Link, Button, Dialog, DialogTitle, IconButton, DialogContent } from "@mui/material";
import { Close } from "@mui/icons-material";
const About = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        sx={{ ml: 1 }}
        disableElevation
      >
        关于
      </Button>

      <Dialog open={open} maxWidth="xs" fullWidth>
        <DialogTitle className="flex items-center justify-between">
          关于
          <IconButton
            onClick={() => {
              setOpen(false);
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ p: 2 }}>
            <Avatar
              src="/site-logo-dark.png"
              sx={{
                width: 80,
                height: 80,
              }}
              className="mx-auto"
            ></Avatar>
            <Typography fontWeight="bold" className="text-center" color="text.primary" sx={{ mt: 2 }}>
              不译
            </Typography>
            <Typography className="text-center" fontSize="small" color="text.secondary">
              版本: {__APP_VERSION__}
            </Typography>
            <Link
              sx={{ mt: 2 }}
              className="text-center block"
              href="https://github.com/aqeja/noTranslate"
              target="_blank"
              rel="noreferrer"
            >
              https://github.com/aqeja/noTranslate
            </Link>
            <Typography className="text-center" sx={{ mt: 2 }} fontSize="small" color="text.secondary">
              如果项目有帮助到你，希望你能给个Star👆
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default About;
