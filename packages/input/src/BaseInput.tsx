import { forwardRef } from "react";
import { TextInput } from "react-native";
import type { BaseInputProps } from "./types";
import { styles } from "./styles";

export const BaseInput = forwardRef<TextInput, BaseInputProps>(
  ({ style, multiline = false, hidden = false, ...rest }, ref) => {
    return (
      <TextInput
        ref={ref}
        style={[
          styles.base,
          multiline && styles.note,
          hidden && { display: "none" },
          style,
        ]}
        multiline={multiline}
        {...rest}
      />
    );
  }
);

BaseInput.displayName = "@dog-care/input/BaseInput";
