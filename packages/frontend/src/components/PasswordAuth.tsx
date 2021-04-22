import React, { useState } from "react";

import { LoginForm } from "Components/LoginForm";
import { RegisterForm } from "Components/RegisterForm";

export function PasswordAuth(): React.ReactElement {
  const [isRegistered, setIsRegistered] = useState(true);

  return (
    <>
      {isRegistered ? (
        <LoginForm onSwitch={() => setIsRegistered(false)} />
      ) : (
        <RegisterForm onSwitch={() => setIsRegistered(true)} />
      )}
    </>
  );
}
