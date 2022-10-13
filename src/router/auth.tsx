import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { identificationInstance } from "@/shared/Identification";
import { useParams } from "react-router";

export const AuthRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  if (!identificationInstance.isValidLogin) {
    identificationInstance.removeToken();
    return <Navigate to="/login" state={{ from: location }} />;
  }
  return children;
};

export const StudioAuthRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const { id } = useParams() as { id: string };
  const studioToken = identificationInstance.getStudioToken(id);
  if (!studioToken) {
    return <Navigate to={`/guest_auth?studio=${id}`} state={{ from: location }} />;
  }
  return children;
};
