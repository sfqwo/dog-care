import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Select, SelectOption, SelectOptionTitle } from "@dog-care/select";
import {
  getWellnessEntryContext,
  getWellnessSymptomScore,
  hasWellnessSymptoms,
  sortWellnessEntries,
} from "@dog-care/domain";
import type {
  ActivityStatus,
  AppetiteStatus,
  StoolStatus,
  WellnessEntry,
} from "@dog-care/domain";
import {
  formatDateTime,
  getOptionTitle,
  isSameLocalDay,
} from "@dog-care/core/utils";
import { DateInput, Input, TimeInput } from "@/packages/ui/input";
import {
  Hint,
  CareTrend,
  CareTrendSeries,
  Modal,
  ModalActionButton,
  ModalActions,
  ModalSubtitle,
  ModalTitle,
  StatsBlock,
  StatsBlocks,
  SwipeableCardsListEmpty,
  SwipeableCardsListItem,
  SwipeableCardsListItemBadge,
  SwipeableCardsListItemFooter,
  SwipeableCardsListItemHeader,
  SwipeableCardsListItemHelper,
  SwipeableCardsListItemNote,
  SwipeableCardsListItemSubtitle,
  SwipeableCardsListItemTextBlock,
  SwipeableCardsListItemTitle,
  TimeRecorder,
  TimeRecorderButton,
  TimeRecorderTitle,
} from "@/src/components";
import { useCareRecordsContext, useWellnessEntryEditor } from "@/src/hooks";
import type { WellnessEntryForm } from "@/src/hooks/useWellnessEntryEditor";
import { wellnessStyles } from "./styles";
import type { WellnessSectionProps } from "./types";
import { gradients } from "@/src/theme";

const NORMAL_GRADIENT = gradients.card;
const SYMPTOM_GRADIENT = gradients.danger;

const APPETITE_OPTIONS: { value: AppetiteStatus; title: string }[] = [
  { value: "normal", title: "Обычный" },
  { value: "reduced", title: "Снижен" },
  { value: "none", title: "Нет аппетита" },
  { value: "increased", title: "Повышен" },
];
const ACTIVITY_OPTIONS: { value: ActivityStatus; title: string }[] = [
  { value: "normal", title: "Обычная" },
  { value: "reduced", title: "Снижена" },
  { value: "low", title: "Вялость" },
  { value: "high", title: "Повышена" },
];
const STOOL_OPTIONS: { value: StoolStatus; title: string }[] = [
  { value: "normal", title: "Нормальный" },
  { value: "soft", title: "Мягкий" },
  { value: "diarrhea", title: "Диарея" },
  { value: "constipation", title: "Запор" },
];

export function WellnessSection({ isActive, hasPets, selectedPetId }: WellnessSectionProps) {
  const {
    getWellnessEntries,
    addWellnessEntry,
    updateWellnessEntry,
    removeWellnessEntry,
    getWeightEntries,
    getMedicationCourses,
  } = useCareRecordsContext();
  const entries = useMemo(
    () => sortWellnessEntries(getWellnessEntries(selectedPetId)),
    [getWellnessEntries, selectedPetId]
  );
  const weightEntries = getWeightEntries(selectedPetId);
  const medicationCourses = getMedicationCourses(selectedPetId);
  const editor = useWellnessEntryEditor({
    selectedPetId,
    addEntry: addWellnessEntry,
    updateEntry: updateWellnessEntry,
    removeEntry: removeWellnessEntry,
  });
  const todayCount = entries.filter((entry) => isSameLocalDay(entry.at, Date.now())).length;
  const symptomCount = entries.filter(hasWellnessSymptoms).length;
  const latestTemperature = entries.find((entry) => entry.temperature)?.temperature;
  const trendPoints = useMemo(
    () => entries.map((entry) => ({ at: entry.at, value: getWellnessSymptomScore(entry) })),
    [entries]
  );

  if (!isActive) return null;

  return (
    <View style={wellnessStyles.section}>
      <StatsBlocks>
        <StatsBlock label="Сегодня" value={todayCount} />
        <StatsBlock label="С симптомами" value={symptomCount} />
        <StatsBlock
          label="Температура"
          value={latestTemperature ? `${latestTemperature} °C` : "—"}
        />
      </StatsBlocks>

      <CareTrend title="Динамика симптомов">
        <CareTrendSeries
          points={trendPoints}
          aggregation="last"
          comparison="firstLast"
          thresholdPercent={25}
          formatValue={(value) => `Индекс ${Math.round(value)}`}
        />
      </CareTrend>

      <TimeRecorder>
        <TimeRecorderTitle>Записать самочувствие</TimeRecorderTitle>
        <WellnessFields
          form={editor.form}
          disabled={!selectedPetId}
          onChange={editor.updateForm}
        />
        <TimeRecorderButton
          label="Добавить запись"
          onPress={editor.handleSubmit}
          disabled={!editor.canSubmit}
        />
        <Hint visible={!selectedPetId}>
          Добавьте питомца, чтобы вести журнал самочувствия.
        </Hint>
      </TimeRecorder>

      {entries.length === 0 ? (
        <SwipeableCardsListEmpty
          text={hasPets ? "Записей о самочувствии пока нет." : "Сначала добавьте питомца."}
        />
      ) : null}

      {entries.map((entry) => (
        <WellnessEntryCard
          key={entry.id}
          entry={entry}
          context={getWellnessEntryContext(entry, weightEntries, medicationCourses)}
          onEdit={editor.handleEdit}
          onRemove={editor.handleRemove}
        />
      ))}

      <Modal visible={Boolean(editor.editingEntry)} onClose={editor.closeEditModal}>
        <ModalTitle>Редактировать самочувствие</ModalTitle>
        <ModalSubtitle>Измените показатели и сохраните запись.</ModalSubtitle>
        <WellnessFields
          form={editor.editForm}
          disabled={false}
          onChange={editor.updateEditForm}
        />
        <ModalActions>
          <ModalActionButton closeOnPress>Отменить</ModalActionButton>
          <ModalActionButton onPress={editor.handleSaveEdit} disabled={!editor.canSaveEdit}>
            Сохранить
          </ModalActionButton>
        </ModalActions>
      </Modal>
    </View>
  );
}

function WellnessFields({
  form,
  disabled,
  onChange,
}: {
  form: WellnessEntryForm;
  disabled: boolean;
  onChange: <K extends keyof WellnessEntryForm>(field: K, value: WellnessEntryForm[K]) => void;
}) {
  return (
    <View style={wellnessStyles.formColumn}>
      <View style={wellnessStyles.inlineRow}>
        <View style={wellnessStyles.inlineField}>
          <DateInput
            value={form.date}
            onChangeText={(value) => onChange("date", value)}
            placeholder="Дата"
            maximumDate={Date.now()}
            editable={!disabled}
          />
        </View>
        <View style={wellnessStyles.inlineField}>
          <TimeInput
            value={form.time}
            onChangeText={(value) => onChange("time", value)}
            placeholder="Время"
            editable={!disabled}
          />
        </View>
      </View>
      <WellnessSelect
        value={form.appetite}
        placeholder="Аппетит"
        options={APPETITE_OPTIONS}
        disabled={disabled}
        onChange={(value) => onChange("appetite", value as AppetiteStatus)}
      />
      <WellnessSelect
        value={form.activity}
        placeholder="Активность"
        options={ACTIVITY_OPTIONS}
        disabled={disabled}
        onChange={(value) => onChange("activity", value as ActivityStatus)}
      />
      <WellnessSelect
        value={form.stool}
        placeholder="Стул"
        options={STOOL_OPTIONS}
        disabled={disabled}
        onChange={(value) => onChange("stool", value as StoolStatus)}
      />
      <View style={wellnessStyles.toggles}>
        <SymptomToggle
          label="Рвота"
          icon="emoticon-sick-outline"
          checked={form.vomiting}
          disabled={disabled}
          onPress={() => onChange("vomiting", !form.vomiting)}
        />
        <SymptomToggle
          label="Зуд"
          icon="hand-back-right-outline"
          checked={form.itching}
          disabled={disabled}
          onPress={() => onChange("itching", !form.itching)}
        />
      </View>
      <Input
        value={form.temperature}
        onChangeText={(value) => onChange("temperature", value)}
        placeholder="Температура, °C (опционально)"
        keyboardType="decimal-pad"
        editable={!disabled}
      />
      <Input
        value={form.note}
        onChangeText={(value) => onChange("note", value)}
        placeholder="Комментарий (опционально)"
        multiline
        editable={!disabled}
      />
    </View>
  );
}

function WellnessSelect({
  value,
  placeholder,
  options,
  disabled,
  onChange,
}: {
  value: string;
  placeholder: string;
  options: { value: string; title: string }[];
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}>
      {options.map((option) => (
        <SelectOption key={option.value} value={option.value}>
          <SelectOptionTitle text={`${placeholder}: ${option.title}`} />
        </SelectOption>
      ))}
    </Select>
  );
}

function SymptomToggle({
  label,
  icon,
  checked,
  disabled,
  onPress,
}: {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  checked: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      style={[wellnessStyles.toggle, checked && wellnessStyles.toggleActive]}
      disabled={disabled}
      onPress={onPress}
    >
      <MaterialCommunityIcons
        name={checked ? "checkbox-marked" : icon}
        size={19}
        style={[wellnessStyles.toggleIcon, checked && wellnessStyles.toggleIconActive]}
      />
      <Text style={wellnessStyles.toggleText}>{label}</Text>
    </Pressable>
  );
}

function WellnessEntryCard({
  entry,
  context,
  onEdit,
  onRemove,
}: {
  entry: WellnessEntry;
  context: ReturnType<typeof getWellnessEntryContext>;
  onEdit: (entry: WellnessEntry) => void;
  onRemove: (id: string) => void;
}) {
  const hasSymptoms = hasWellnessSymptoms(entry);
  const details = [
    `Аппетит: ${getOptionTitle(APPETITE_OPTIONS, entry.appetite)}`,
    `Активность: ${getOptionTitle(ACTIVITY_OPTIONS, entry.activity)}`,
    `Стул: ${getOptionTitle(STOOL_OPTIONS, entry.stool)}`,
    entry.vomiting ? "Рвота" : undefined,
    entry.itching ? "Зуд" : undefined,
    entry.temperature ? `${entry.temperature} °C` : undefined,
    entry.note,
  ].filter(Boolean);
  const contextText = [
    context.nearestWeight ? `Вес: ${context.nearestWeight.weight} кг` : undefined,
    context.activeMedications.length
      ? `Лечение: ${context.activeMedications.map((course) => course.name).join(", ")}`
      : undefined,
  ].filter(Boolean).join(" • ") || "Нет связанных записей веса или лечения";

  return (
    <SwipeableCardsListItem
      id={entry.id}
      gradientColors={hasSymptoms ? SYMPTOM_GRADIENT : NORMAL_GRADIENT}
      onPress={() => onEdit(entry)}
      onRemove={() => onRemove(entry.id)}
    >
      <SwipeableCardsListItemHeader>
        <SwipeableCardsListItemTextBlock>
          <SwipeableCardsListItemTitle text="Самочувствие" />
          <SwipeableCardsListItemSubtitle text={formatDateTime(entry.at)} />
        </SwipeableCardsListItemTextBlock>
        <SwipeableCardsListItemBadge
          text={hasSymptoms ? "Есть симптомы" : "Без симптомов"}
          icon={hasSymptoms ? "alert-circle-outline" : "heart-pulse"}
        />
      </SwipeableCardsListItemHeader>
      <SwipeableCardsListItemNote text={details.join(" • ")} icon="clipboard-pulse-outline" />
      <SwipeableCardsListItemFooter>
        <SwipeableCardsListItemHelper text={contextText} icon="chart-timeline-variant" />
      </SwipeableCardsListItemFooter>
    </SwipeableCardsListItem>
  );
}
