import { forwardRef, useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import type { TextInput } from "react-native";
import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { useController } from "react-hook-form";
import { colors } from "@/src/theme";
import { formatDateInput, isDateValueValid } from "@dog-care/core/utils";
import { BaseInput } from "../BaseInput";
import { dateInputStyles } from "./styles";
import type { DateInputProps, NativeDatePickerProps } from "./types";
import {
  attachDateValidation,
  formatDatePickerValue,
  resolveDatePickerValue,
  toDateBoundary,
} from "./utils";

export const DateInput = forwardRef<TextInput, DateInputProps>(function DateInput(
  props,
  ref
) {
  const { control, name } = props;

  if (control && name) {
    return <ControlledDateInput ref={ref} {...props} control={control} name={name} />;
  }

  return <PlainDateInput ref={ref} {...props} />;
});
DateInput.displayName = "@dog-care/input/DateInput";

type ControlledDateInputProps = DateInputProps &
  Required<Pick<DateInputProps, "control" | "name">>;

const ControlledDateInput = forwardRef<TextInput, ControlledDateInputProps>(function ControlledDateInput(
  {
    minimumDate,
    maximumDate,
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
    rules: attachDateValidation(rules, minimumDate, maximumDate),
  });

  return (
    <PlainDateInput
      ref={ref}
      {...rest}
      editable={editable}
      placeholder={placeholder}
      minimumDate={minimumDate}
      maximumDate={maximumDate}
      value={controller.field.value ?? valueProp ?? ""}
      style={[style, controller.fieldState.invalid && dateInputStyles.invalid]}
      onChangeText={(nextValue) => {
        controller.field.onChange(nextValue);
        onChangeText?.(nextValue);
      }}
    />
  );
});
ControlledDateInput.displayName = "@dog-care/input/ControlledDateInput";

const PlainDateInput = forwardRef<TextInput, DateInputProps>(function PlainDateInput(
  {
    minimumDate,
    maximumDate,
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
  const isInvalid = !isDateValueValid(value, minimumDate, maximumDate);
  const isDisabled = editable === false;
  const isWeb = Platform.OS === "web";

  const openPicker = () => {
    if (isDisabled || isWeb) return;
    setPickerValue(resolveDatePickerValue(value, minimumDate, maximumDate));
  };

  const closePicker = () => setPickerValue(null);

  const selectDate = (nextDate: Date) => {
    onChangeText?.(formatDatePickerValue(nextDate));
    setPickerValue(null);
  };

  const handleWebChange = (text: string) => {
    onChangeText?.(formatDateInput(text));
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
        style={[style, isInvalid && dateInputStyles.invalid]}
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
          style={[style, isInvalid && dateInputStyles.invalid, dateInputStyles.nonInteractive]}
        />
      </Pressable>
      {pickerValue ? (
        <NativeDatePicker
          value={pickerValue}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onClose={closePicker}
          onSelect={selectDate}
        />
      ) : null}
    </>
  );
});
PlainDateInput.displayName = "@dog-care/input/PlainDateInput";

function NativeDatePicker({
  value,
  minimumDate,
  maximumDate,
  onClose,
  onSelect,
}: NativeDatePickerProps) {
  const [draftValue, setDraftValue] = useState(value);

  if (Platform.OS === "android") {
    return (
      <DateTimePicker
        value={value}
        mode="date"
        presentation="dialog"
        display="default"
        accentColor={colors.primary}
        minimumDate={toDateBoundary(minimumDate)}
        maximumDate={toDateBoundary(maximumDate)}
        positiveButton={{ label: "Выбрать" }}
        negativeButton={{ label: "Отменить" }}
        onDismiss={onClose}
        onValueChange={(_, selectedDate) => onSelect(selectedDate)}
      />
    );
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={dateInputStyles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={dateInputStyles.card}>
          <DateTimePicker
            value={draftValue}
            mode="date"
            display="inline"
            accentColor={colors.primary}
            locale="ru_RU"
            minimumDate={toDateBoundary(minimumDate)}
            maximumDate={toDateBoundary(maximumDate)}
            onValueChange={(_, selectedDate) => setDraftValue(selectedDate)}
          />
          <View style={dateInputStyles.actions}>
            <Pressable style={dateInputStyles.cancelButton} onPress={onClose}>
              <Text style={dateInputStyles.cancelText}>Отменить</Text>
            </Pressable>
            <Pressable style={dateInputStyles.confirmButton} onPress={() => onSelect(draftValue)}>
              <Text style={dateInputStyles.confirmText}>Выбрать</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
