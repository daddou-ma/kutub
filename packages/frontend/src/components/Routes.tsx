import { hot } from 'react-hot-loader/root';
import React, { useEffect } from "react";
import { Switch, useHistory } from "react-router-dom";
import loadable from "@loadable/component";

// import { QuotePage } from "Pages/Quotes";
const LibraryPage = loadable(() => import("Pages/Library"), {
  fallback: <LoadingPage />,
});

const LoginPage = loadable(() => import("Pages/Login"), {
  fallback: <LoadingPage />,
});

const SettingsPage = loadable(() => import("Pages/Settings"), {
  fallback: <LoadingPage />,
});

const LanguageSettingsPage = loadable(() => import("Pages/LanguageSettings"), {
  fallback: <LoadingPage />,
});

const ReaderPage = loadable(() => import("Pages/Reader"), {
  fallback: <LoadingPage />,
});

const FavoriteQuotesPage = loadable(() => import("Pages/FavoriteQuotes"), {
  fallback: <LoadingPage />,
});

const AboutPage = loadable(() => import("Pages/About"), {
  fallback: <LoadingPage />,
});

const FileHandlerPage = loadable(() => import("Pages/FileHandler"), {
  fallback: <LoadingPage />,
});

import { LoadingPage } from "Pages/Loading";

import { CustomRoute, Role } from "Components/CustomRoute";

import ReactGA from "react-ga";

function Routes(): React.ReactElement {
  const history = useHistory();

  useEffect(
    () =>
      history.listen((location) => {
        ReactGA.pageview(location.pathname + location.search);
      }),
    []
  );

  return (
    <Switch>
      <CustomRoute path="/library" role={Role.USER} redirect="login">
        <LibraryPage />
      </CustomRoute>
      <CustomRoute path="/login" role={Role.GUEST} redirect="/">
        <LoginPage />
      </CustomRoute>
      {/* <CustomRoute path="/quotes" role={Role.USER} redirect="/login">
        <QuotePage />
      </CustomRoute> */}
      <CustomRoute path="/favorites" role={Role.USER} redirect="/login">
        <FavoriteQuotesPage />
      </CustomRoute>
      <CustomRoute path="/reader/:lectureId" role={Role.USER} redirect="/login">
        <ReaderPage />
      </CustomRoute>
      <CustomRoute path="/settings/language" role={Role.USER} redirect="/login">
        <LanguageSettingsPage />
      </CustomRoute>
      <CustomRoute path="/settings" role={Role.USER} redirect="/login">
        <SettingsPage />
      </CustomRoute>
      <CustomRoute path="/about" role={Role.USER} redirect="/login">
        <AboutPage />
      </CustomRoute>
      <CustomRoute path="/file-handler" role={Role.USER} redirect="/login">
        <FileHandlerPage />
      </CustomRoute>
      <CustomRoute path="/" role={Role.USER} redirect="/login">
        <LibraryPage />
      </CustomRoute>
    </Switch>
  );
}

export default hot(Routes)