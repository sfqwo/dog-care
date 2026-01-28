import { forwardRef, useEffect, useRef } from "react";
import type { TextInput } from "react-native";
import { BaseInput } from "../BaseInput";
import type { InputProps } from "./types";
import { styles as inputStyles } from "./styles";

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { style, valid = true, onValidityChange, ...rest },
  ref
) {
  const validityCallbackRef = useRef(onValidityChange);

  useEffect(() => {
    validityCallbackRef.current = onValidityChange;
  }, [onValidityChange]);

  useEffect(() => {
    validityCallbackRef.current?.(valid);
  }, [valid]);

  return (
    <BaseInput
      {...rest}
      ref={ref}
      style={[style, valid === false && inputStyles.invalid]}
    />
  );
});

Input.displayName = "@dog-care/input/Input";
