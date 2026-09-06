import { forwardRef, useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import type { TextInput } from "react-native";
import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { useController } from "react-hook-form";
import { colors } from "@/src/theme";
import { formatTimeInput, isTimeValueValid } from "@dog-care/core/utils";
import { BaseInput } from "../BaseInput";
import { timeInputStyles } from "./styles";
import type { NativeTimePickerProps, TimeInputProps } from "./types";
import {
  attachTimeValidation,
  formatTimePickerValue,
  resolveTimePickerValue,
} from "./utils";

export const TimeInput = forwardRef<TextInput, TimeInputProps>(function TimeInput(
  props,
  ref
) {
  const { control, name } = props;

  if (control && name) {
    return <ControlledTimeInput ref={ref} {...props} control={control} name={name} />;
  }

  return <PlainTimeInput ref={ref} {...props} />;
});
TimeInput.displayName = "@dog-care/input/TimeInput";

type ControlledTimeInputProps = TimeInputProps &
  Required<Pick<TimeInputProps, "control" | "name">>;

const ControlledTimeInput = forwardRef<TextInput, ControlledTimeInputProps>(function ControlledTimeInput(
  {
    control,
    name,
    rules,
    value: valueProp,
    onChangeText,
    style,
    editable = true,
    placeholder,
    ...rest
  },
  ref
) {
  const controller = useController({
    control,
    name,
    rules: attachTimeValidation(rules),
  });

  return (
    <PlainTimeInput
      ref={ref}
      {...rest}
      editable={editable}
      placeholder={placeholder}
      value={controller.field.value ?? valueProp ?? ""}
      style={[style, controller.fieldState.invalid && timeInputStyles.invalid]}
      onChangeText={(nextValue) => {
        controller.field.onChange(nextValue);
        onChangeText?.(nextValue);
      }}
    />
  );
});
ControlledTimeInput.displayName = "@dog-care/input/ControlledTimeInput";

const PlainTimeInput = forwardRef<TextInput, TimeInputProps>(function PlainTimeInput(
  {
    value: valueProp,
    onChangeText,
    style,
    editable = true,
    placeholder,
    ...rest
  },
  ref
) {
  const [pickerValue, setPickerValue] = useState<Date | null>(null);
  const value = valueProp ?? "";
  const isInvalid = !isTimeValueValid(value);
  const isDisabled = editable === false;
  const isWeb = Platform.OS === "web";

  const openPicker = () => {
    if (isDisabled || isWeb) return;
    setPickerValue(resolveTimePickerValue(value));
  };

  const closePicker = () => setPickerValue(null);

  const selectTime = (nextDate: Date) => {
    onChangeText?.(formatTimePickerValue(nextDate));
    setPickerValue(null);
  };

  const handleWebChange = (text: string) => {
    onChangeText?.(formatTimeInput(text));
  };

  if (isWeb) {
    return (
      <BaseInput
        ref={ref}
        {...rest}
        editable={editable}
        placeholder={placeholder}
        keyboardType="number-pad"
        value={value}
        style={[style, isInvalid && timeInputStyles.invalid]}
        onChangeText={handleWebChange}
      />
    );
  }

  return (
    <>
      <Pressable accessibilityRole="button" disabled={isDisabled} onPress={openPicker}>
        <BaseInput
          ref={ref}
          {...rest}
          editable={false}
          placeholder={placeholder}
          showSoftInputOnFocus={false}
          value={value}
          style={[style, isInvalid && timeInputStyles.invalid, timeInputStyles.nonInteractive]}
        />
      </Pressable>
      {pickerValue ? (
        <NativeTimePicker value={pickerValue} onClose={closePicker} onSelect={selectTime} />
      ) : null}
    </>
  );
});
PlainTimeInput.displayName = "@dog-care/input/PlainTimeInput";

function NativeTimePicker({ value, onClose, onSelect }: NativeTimePickerProps) {
  const [draftValue, setDraftValue] = useState(value);

  if (Platform.OS === "android") {
    return (
      <DateTimePicker
        value={value}
        mode="time"
        presentation="dialog"
        display="clock"
        is24Hour
        accentColor={colors.primary}
        positiveButton={{ label: "Выбрать" }}
        negativeButton={{ label: "Отменить" }}
        onDismiss={onClose}
        onValueChange={(_, selectedDate) => onSelect(selectedDate)}
      />
    );
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={timeInputStyles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={timeInputStyles.card}>
          <DateTimePicker
            value={draftValue}
            mode="time"
            display="spinner"
            is24Hour
            accentColor={colors.primary}
            locale="ru_RU"
            onValueChange={(_, selectedDate) => setDraftValue(selectedDate)}
          />
          <View style={timeInputStyles.actions}>
            <Pressable style={timeInputStyles.cancelButton} onPress={onClose}>
              <Text style={timeInputStyles.cancelText}>Отменить</Text>
            </Pressable>
            <Pressable style={timeInputStyles.confirmButton} onPress={() => onSelect(draftValue)}>
              <Text style={timeInputStyles.confirmText}>Выбрать</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
