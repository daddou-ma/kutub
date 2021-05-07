import React, { useState, useContext, createContext } from "react";
import { Snackbar, Slide } from "@material-ui/core";

interface SnackbarProviderProps {
  children: React.ReactElement;
}

interface SnackbarContext {
  message: string;
  visible: boolean;
  showSnackbar: CallableFunction;
  hideSnackbar: CallableFunction;
}

const snackbarContext = createContext(null);

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

export function SnackbarProvider({
  children,
}: SnackbarProviderProps): React.ReactElement {
  const auth = useSnackbarProvider();
  return (
    <snackbarContext.Provider value={auth}>
      {children}
      <Snackbar
        open={auth.visible}
        onClose={() => auth.hideSnackbar()}
        autoHideDuration={1000}
        TransitionComponent={TransitionUp}
        message={auth.message}
        key={TransitionUp.name}
      />
    </snackbarContext.Provider>
  );
}

export function useSnackbar(): SnackbarContext {
  return useContext(snackbarContext);
}

export function useSnackbarProvider(): SnackbarContext {
  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);

  function showSnackbar(message, duration = 1000) {
    setMessage(message);
    setVisible(true);
  }

  function hideSnackbar() {
    setMessage(null);
    setVisible(false);
  }

  return {
    message,
    visible,
    showSnackbar,
    hideSnackbar,
  };
}
