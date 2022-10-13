import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components";
import Home from "@/views/home";

const LinearProgress = () => {
  return <div>loading...</div>;
};

const NotFound = () => {
  return <div>not found...</div>;
};

const RouterView = () => {
  return (
    <Suspense fallback={<LinearProgress />}>
      <BrowserRouter basename="/">
        <ErrorBoundary hasError={false}>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </Suspense>
  );
};

export default RouterView;
