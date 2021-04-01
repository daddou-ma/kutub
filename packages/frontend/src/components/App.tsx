import * as React from "react";

export interface HelloWorldProps {
  userName: string;
  lang: string;
}

export const App = (props: HelloWorldProps) => (
  <h1>
    Hi {props.userName} mina React! Welcome to {props.lang}!
  </h1>
);
