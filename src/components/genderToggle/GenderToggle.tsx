import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BaseInput } from "@/packages/ui/input";
import {
  Pressable,
  Text,
  View,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { genderToggleStyles } from "./styles";
import type { GenderToggleProps } from "./types";

export function GenderToggle({ value, options, onChange }: GenderToggleProps) {
  return (
    <View style={genderToggleStyles.wrapper}>
      <BaseInput
        editable={false}
        pointerEvents="none"
        value=""
        style={genderToggleStyles.backgroundInput}
      />
      <View style={genderToggleStyles.toggleRow}>
        {options.map((option, index) => {
          const isActive = option.value === value;
          const pressableStyle = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [
            genderToggleStyles.toggleOption,
            index === 0 && genderToggleStyles.toggleOptionFirst,
            index === options.length - 1 && genderToggleStyles.toggleOptionLast,
            isActive ? genderToggleStyles.toggleOptionActive : undefined,
            !isActive && pressed ? genderToggleStyles.toggleOptionPressed : undefined,
          ];

          return (
            <Pressable
              key={option.value}
              style={pressableStyle}
              onPress={() => onChange(option.value)}
            >
              <View style={genderToggleStyles.optionContent}>
                <MaterialCommunityIcons
                  name={option.icon}
                  size={20}
                  style={[
                    genderToggleStyles.optionIcon,
                    isActive && genderToggleStyles.optionIconActive,
                  ]}
                />
                <Text
                  style={[
                    genderToggleStyles.optionLabel,
                    isActive && genderToggleStyles.optionLabelActive,
                  ]}
                >
                  {option.title[0]}
                </Text>
              </View>
            </Pressable>
         );
       })}
     </View>
    </View>
  );
}
