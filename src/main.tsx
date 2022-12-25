import React, { useMemo } from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Router from "./router";
import { QueryClient, QueryClientProvider } from "react-query";
import { useMediaQuery } from "@mui/material";
import "./index.css";

const queryClient = new QueryClient();

const App: React.FC = ({ children }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          button: {
            textTransform: "none",
          },
        },
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          secondary: {
            light: "#9b9b9b",
            dark: "#9b9b9b",
            main: "#eaeaea",
          },
          background: {
            paper: prefersDarkMode ? "#3a3a3a" : "#fff",
          },
        },
      }),
    [prefersDarkMode],
  );
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <App>
        <QueryClientProvider client={queryClient}>
          <Router />
        </QueryClientProvider>
      </App>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById("root"),
);
