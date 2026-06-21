import { useMemo } from "react";
import { Text, View } from "react-native";

import type { WeightEntry } from "@dog-care/domain";
import { formatLocalDate } from "@dog-care/core/utils";
import { DateInput, Input } from "@/packages/ui/input";
import {
  Hint,
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
  TimeRecorderRow,
  TimeRecorderTitle,
} from "@/src/components";
import { useWeightEntryEditor } from "@/src/hooks";
import { weightSectionStyles } from "./styles";
import type { WeightEntryCardProps, WeightSectionProps, WeightTrendChartProps } from "./types";

const WEIGHT_GRADIENT = ["#dcfce7", "#bfdbfe", "#fde68a"] as const;
const WEIGHT_NOTE_GRADIENT = ["#e0f2fe", "#bbf7d0", "#fef3c7"] as const;

export function WeightSection({
  isActive,
  hasPets,
  entries,
  selectedPetId,
  onAddEntry,
  onUpdateEntry,
  onRemoveEntry,
}: WeightSectionProps) {
  const sortedEntries = useMemo(
    () => [...entries].sort((first, second) => second.at - first.at),
    [entries]
  );
  const previousEntriesById = useMemo(() => {
    const sortedAsc = [...entries].sort((first, second) => first.at - second.at);
    return sortedAsc.reduce<Record<string, WeightEntry | undefined>>((acc, entry, index) => {
      acc[entry.id] = sortedAsc[index - 1];
      return acc;
    }, {});
  }, [entries]);
  const latestEntry = sortedEntries[0];
  const previousEntry = sortedEntries[1];
  const delta = latestEntry && previousEntry ? latestEntry.weight - previousEntry.weight : null;
  const {
    date,
    setDate,
    weight,
    setWeight,
    note,
    setNote,
    editingEntry,
    editDate,
    setEditDate,
    editWeight,
    setEditWeight,
    editNote,
    setEditNote,
    canAddWeightEntry,
    canSaveEditedWeightEntry,
    handleSubmitWeightEntry,
    handleRemoveWeightEntry,
    handleEditWeightEntry,
    handleSaveEditedWeightEntry,
    closeEditWeightModal,
  } = useWeightEntryEditor({
    selectedPetId,
    addWeightEntry: onAddEntry,
    updateWeightEntry: onUpdateEntry,
    removeWeightEntry: onRemoveEntry,
  });

  if (!isActive) return null;

  const emptyStateText = hasPets
    ? "Добавьте первое измерение веса."
    : "Чтобы вести динамику веса, добавьте питомца.";

  return (
    <View style={weightSectionStyles.section}>
      <StatsBlocks>
        <StatsBlock label="Текущий" value={latestEntry ? `${formatWeight(latestEntry.weight)} кг` : "—"} />
        <StatsBlock label="Изменение" value={formatDelta(delta)} />
        <StatsBlock label="Записей" value={sortedEntries.length} />
      </StatsBlocks>

      <WeightTrendChart entries={sortedEntries} />

      <TimeRecorder>
        <TimeRecorderTitle>Записать вес</TimeRecorderTitle>
        <TimeRecorderRow>
          <Input
            value={weight}
            onChangeText={setWeight}
            placeholder="Вес, кг"
            keyboardType="decimal-pad"
            editable={Boolean(selectedPetId)}
          />
          <TimeRecorderButton
            label="Добавить"
            onPress={handleSubmitWeightEntry}
            disabled={!canAddWeightEntry}
          />
        </TimeRecorderRow>
        <DateInput
          value={date}
          onChangeText={setDate}
          placeholder="Дата измерения"
          editable={Boolean(selectedPetId)}
        />
        <Input
          value={note}
          onChangeText={setNote}
          placeholder="Комментарий (опционально)"
          multiline
          editable={Boolean(selectedPetId)}
        />
        <Hint visible={!selectedPetId}>
          Добавьте питомца в профиле, чтобы вести журнал веса.
        </Hint>
      </TimeRecorder>

      {sortedEntries.length === 0 ? <SwipeableCardsListEmpty text={emptyStateText} /> : null}

      {sortedEntries.map((entry) => (
        <WeightEntryCard
          key={entry.id}
          entry={entry}
          previousEntry={previousEntriesById[entry.id]}
          onRemove={handleRemoveWeightEntry}
          onEdit={handleEditWeightEntry}
        />
      ))}

      <WeightEditModal
        visible={Boolean(editingEntry)}
        date={editDate}
        weight={editWeight}
        note={editNote}
        canSave={canSaveEditedWeightEntry}
        onChangeDate={setEditDate}
        onChangeWeight={setEditWeight}
        onChangeNote={setEditNote}
        onSave={handleSaveEditedWeightEntry}
        onClose={closeEditWeightModal}
      />
    </View>
  );
}

function WeightTrendChart({ entries }: WeightTrendChartProps) {
  const chartEntries = useMemo(
    () => [...entries].sort((first, second) => first.at - second.at).slice(-8),
    [entries]
  );
  const weights = chartEntries.map((entry) => entry.weight);
  const min = weights.length ? Math.min(...weights) : 0;
  const max = weights.length ? Math.max(...weights) : 0;
  const range = max - min || 1;

  return (
    <View style={weightSectionStyles.chartCard}>
      <View style={weightSectionStyles.chartHeader}>
        <Text style={weightSectionStyles.chartTitle}>Динамика веса</Text>
        <Text style={weightSectionStyles.chartSubtitle}>Последние измерения по датам</Text>
      </View>

      {chartEntries.length === 0 ? (
        <View style={weightSectionStyles.chartEmpty}>
          <Text style={weightSectionStyles.chartEmptyText}>
            График появится после первой записи.
          </Text>
        </View>
      ) : (
        <View style={weightSectionStyles.chartBars}>
          {chartEntries.map((entry, index) => {
            const height = 24 + ((entry.weight - min) / range) * 88;
            const isLatest = index === chartEntries.length - 1;
            return (
              <View key={entry.id} style={weightSectionStyles.chartSlot}>
                <Text style={weightSectionStyles.chartWeight}>{formatWeight(entry.weight)}</Text>
                <View
                  style={[
                    weightSectionStyles.chartBar,
                    isLatest && weightSectionStyles.chartBarCurrent,
                    { height },
                  ]}
                />
                <Text style={weightSectionStyles.chartDate}>
                  {formatLocalDate(entry.at, { day: "2-digit", month: "2-digit" })}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

function WeightEntryCard({ entry, previousEntry, onRemove, onEdit }: WeightEntryCardProps) {
  const delta = previousEntry ? entry.weight - previousEntry.weight : null;
  const handleRemove = () => onRemove(entry.id);
  const handleEdit = () => onEdit(entry);

  return (
    <SwipeableCardsListItem
      id={entry.id}
      gradientColors={entry.note ? WEIGHT_NOTE_GRADIENT : WEIGHT_GRADIENT}
      onRemove={handleRemove}
      onPress={handleEdit}
    >
      <SwipeableCardsListItemHeader>
        <SwipeableCardsListItemTextBlock>
          <SwipeableCardsListItemTitle text={`${formatWeight(entry.weight)} кг`} />
          <SwipeableCardsListItemSubtitle text={`Измерение • ${formatLocalDate(entry.at)}`} />
        </SwipeableCardsListItemTextBlock>
        <SwipeableCardsListItemBadge text={formatDelta(delta)} icon="scale-bathroom" />
      </SwipeableCardsListItemHeader>
      <SwipeableCardsListItemNote text={entry.note} icon="note-text-outline" />
      <SwipeableCardsListItemFooter>
        <SwipeableCardsListItemHelper text="Тап — редактировать • свайп влево — кнопка удаления" />
      </SwipeableCardsListItemFooter>
    </SwipeableCardsListItem>
  );
}

function WeightEditModal({
  visible,
  date,
  weight,
  note,
  canSave,
  onChangeDate,
  onChangeWeight,
  onChangeNote,
  onSave,
  onClose,
}: {
  visible: boolean;
  date: string;
  weight: string;
  note: string;
  canSave: boolean;
  onChangeDate: (value: string) => void;
  onChangeWeight: (value: string) => void;
  onChangeNote: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} onClose={onClose}>
      <ModalTitle>Редактировать вес</ModalTitle>
      <ModalSubtitle>Обновите дату, вес и комментарий.</ModalSubtitle>
      <DateInput value={date} onChangeText={onChangeDate} placeholder="Дата измерения" />
      <Input
        value={weight}
        onChangeText={onChangeWeight}
        placeholder="Вес, кг"
        keyboardType="decimal-pad"
      />
      <Input
        value={note}
        onChangeText={onChangeNote}
        placeholder="Комментарий"
        multiline
      />
      <ModalActions>
        <ModalActionButton closeOnPress>Отменить</ModalActionButton>
        <ModalActionButton onPress={onSave} disabled={!canSave}>
          Сохранить
        </ModalActionButton>
      </ModalActions>
    </Modal>
  );
}

function formatWeight(value: number) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}

function formatDelta(value: number | null) {
  if (value === null || Number.isNaN(value)) return "—";
  if (value === 0) return "0 кг";
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatWeight(value)} кг`;
}
