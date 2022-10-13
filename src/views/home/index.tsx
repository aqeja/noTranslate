import React from "react";
import { useRecoilValue } from "recoil";
import { AppStatus, statusState } from "@/store/app";
import { Box } from "@mui/material";
import Launch from "./Launch";
import Errors from "./Errors";
import List from "./List";
const Home = () => {
  const status = useRecoilValue(statusState);

  return (
    <Box className="flex flex-col h-screen">
      {status === AppStatus.idle && <Launch />}
      {status !== AppStatus.idle && <List />}
      <Errors />
    </Box>
  );
};

export default Home;
