import {
  Children,
  isValidElement,
  memo,
  type ReactElement,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { styles } from "./styles";
import type {
  ParsedSelectOption,
  SelectOptionProps,
  SelectOptionSlotTextProps,
  SelectHeaderProps,
  SelectProps,
  RenderConfig,
} from "./types";

function SelectComponent({
  value,
  placeholder = "Выберите значение",
  disabled,
  modalTitle = "Выберите вариант",
  onChange,
  children,
}: SelectProps) {
  const [visible, setVisible] = useState(false);
  const { options, header } = useParsedChildren(children);

  const selected = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );

  const open = useCallback(() => {
    if (!disabled) {
      setVisible(true);
    }
  }, [disabled]);

  const close = useCallback(() => setVisible(false), []);

  const handleSelect = useCallback(
    (option: ParsedSelectOption) => {
      setVisible(false);
      onChange?.(option.value, option);
    },
    [onChange]
  );

  const renderItem = useOptionRenderer({
    options,
    onSelect: handleSelect,
  });

  const selectedLabel =
    selected?.title ?? selected?.text ?? selected?.description ?? placeholder;
  const isPlaceholder = !selected;

  return (
    <>
      <Pressable
        onPress={open}
        disabled={disabled}
        style={({ pressed }) => [
          styles.trigger,
          pressed && !disabled && styles.triggerPressed,
          disabled && styles.triggerDisabled,
        ]}
      >
        <Text
          style={[
            styles.label,
            isPlaceholder && styles.placeholder,
          ]}
          numberOfLines={1}
        >
          {selectedLabel}
        </Text>
      </Pressable>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={close}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={close} />
          <View style={styles.modalCard}>
            <View style={styles.sheetHandle} />
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            {header ? <View style={styles.modalHeader}>{header}</View> : null}
            <View style={styles.optionsList}>
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={renderItem}
                keyboardShouldPersistTaps="handled"
              />
            </View>
            <Pressable style={styles.cancelButton} onPress={close}>
              <Text style={styles.cancelButtonText}>Отменить</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

export const Select = memo(SelectComponent);
Select.displayName = "@dog-care/select/Select";

export function SelectOption(_: SelectOptionProps) {
  return null;
}

SelectOption.displayName = "@dog-care/select/SelectOption";

export function SelectOptionTitle(_: SelectOptionSlotTextProps) {
  return null;
}

SelectOptionTitle.displayName = "@dog-care/select/SelectOptionTitle";

export function SelectOptionText(_: SelectOptionSlotTextProps) {
  return null;
}

SelectOptionText.displayName = "@dog-care/select/SelectOptionText";

export function SelectOptionDescription(_: SelectOptionSlotTextProps) {
  return null;
}

SelectOptionDescription.displayName = "@dog-care/select/SelectOptionDescription";

type SelectChild = ReactElement<SelectOptionProps, typeof SelectOption>;
type SelectHeaderElement = ReactElement<SelectHeaderProps, typeof SelectHeader>;

export function SelectHeader({ children }: SelectHeaderProps) {
  return <>{children}</>;
}

SelectHeader.displayName = "@dog-care/select/SelectHeader";

function useParsedChildren(children: ReactNode): {
  options: ParsedSelectOption[];
  header?: ReactNode;
} {
  return useMemo(() => {
    const parsed: ParsedSelectOption[] = [];
    let headerContent: ReactNode | undefined;

    Children.forEach(children, (child) => {
      if (isSelectOptionElement(child)) {
        parsed.push(extractOption(child));
      } else if (isSelectHeaderElement(child)) {
        headerContent = child.props.children;
      }
    });

    return { options: parsed, header: headerContent };
  }, [children]);
}

function isSelectOptionElement(child: ReactNode): child is SelectChild {
  return isValidElement(child) && child.type === SelectOption;
}

function isSelectHeaderElement(child: ReactNode): child is SelectHeaderElement {
  return isValidElement(child) && child.type === SelectHeader;
}

function extractOption(element: SelectChild): ParsedSelectOption {
  const option: ParsedSelectOption = { value: element.props.value };

  Children.forEach(element.props.children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === SelectOptionTitle) {
      const node = child as ReactElement<SelectOptionSlotTextProps, typeof SelectOptionTitle>;
      option.title = node.props.text;
    } else if (child.type === SelectOptionText) {
      const node = child as ReactElement<SelectOptionSlotTextProps, typeof SelectOptionText>;
      option.text = node.props.text;
    } else if (child.type === SelectOptionDescription) {
      const node = child as ReactElement<SelectOptionSlotTextProps, typeof SelectOptionDescription>;
      option.description = node.props.text;
    }
  });

  return option;
}

function useOptionRenderer({
  options,
  onSelect,
}: RenderConfig) {
  return useCallback(
    ({ item, index }: { item: ParsedSelectOption; index: number }) => {
      const isLast = index === options.length - 1;
      const title = item.title ?? item.text ?? item.description ?? item.value;

      return (
        <Pressable
          key={item.value}
          onPress={() => onSelect(item)}
          style={({ pressed }) => [
            styles.option,
            isLast && styles.optionLast,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={styles.optionTitle}>{title}</Text>
          {item.text && item.text !== title ? (
            <Text style={styles.optionText}>{item.text}</Text>
          ) : null}
          {item.description ? (
            <Text style={styles.optionDescription}>
              {item.description}
            </Text>
          ) : null}
        </Pressable>
      );
    },
    [
      onSelect,
      options.length,
    ]
  );
}
