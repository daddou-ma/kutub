import React, { useEffect } from "react";
import { Switch, useHistory } from "react-router-dom";

// import { QuotePage } from "Pages/Quotes";
import { LibraryPage } from "Pages/Library";
import { FavoriteQuotePage } from "Pages/FavoriteQuotes";
import { ReaderPage } from "Pages/Reader";
import { LoginPage } from "Pages/Login";
import { SettingsPage } from "Pages/Settings";
import { LanguageSettingsPage } from "Pages/LanguageSettings";
import { CustomRoute, Role } from "Components/CustomRoute";
import ReactGA from "react-ga";

export function Routes(): React.ReactElement {
  const history = useHistory();

  useEffect(
    () =>
      history.listen((location) => {
        console.log(location.pathname + location.search);
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
        <FavoriteQuotePage />
      </CustomRoute>
      <CustomRoute path="/reader/:epubId" role={Role.USER} redirect="/login">
        <ReaderPage />
      </CustomRoute>
      <CustomRoute path="/settings/language" role={Role.USER} redirect="/login">
        <LanguageSettingsPage />
      </CustomRoute>
      <CustomRoute path="/settings" role={Role.USER} redirect="/login">
        <SettingsPage />
      </CustomRoute>
      <CustomRoute path="/" role={Role.USER} redirect="/login">
        <LibraryPage />
      </CustomRoute>
    </Switch>
  );
}
