import { BaseInput } from "./BaseInput";
import { useInputFormatter } from "./useInputFormatter";
import type { InputProps } from "./types";

export function Input({
  type,
  keyboardType,
  onChangeText,
  multiline,
  ...rest
}: InputProps) {
  const { resolvedKeyboard, formatValue } = useInputFormatter(type, keyboardType);

  const handleChangeText = (value: string) => {
    onChangeText?.(formatValue(value));
  };

  return (
    <BaseInput
      {...rest}
      multiline={multiline}
      keyboardType={resolvedKeyboard}
      onChangeText={handleChangeText}
    />
  );
}

Input.displayName = "@dog-care/input/Input";
