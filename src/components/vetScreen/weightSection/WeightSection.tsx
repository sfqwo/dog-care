import { useMemo } from "react";
import { View } from "react-native";

import type { WeightEntry } from "@dog-care/domain";
import { formatLocalDate } from "@dog-care/core/utils";
import { DateInput, Input } from "@/packages/ui/input";
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
  TimeRecorderRow,
  TimeRecorderTitle,
} from "@/src/components";
import { useWeightEntryEditor } from "@/src/hooks";
import { weightSectionStyles } from "./styles";
import type { WeightEntryCardProps, WeightSectionProps } from "./types";
import { formatWeight, formatWeightDelta } from "./utils";
import { gradients } from "@/src/theme";

const WEIGHT_GRADIENT = gradients.card;
const WEIGHT_NOTE_GRADIENT = gradients.cardWarm;

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
  const trendPoints = useMemo(
    () => entries.map((entry) => ({ at: entry.at, value: entry.weight })),
    [entries]
  );
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
        <StatsBlock label="Изменение" value={formatWeightDelta(delta)} />
        <StatsBlock label="Записей" value={sortedEntries.length} />
      </StatsBlocks>

      <CareTrend title="Динамика веса">
        <CareTrendSeries
          points={trendPoints}
          aggregation="last"
          comparison="firstLast"
          thresholdPercent={5}
          formatValue={(value) => `${formatWeight(value)} кг`}
        />
      </CareTrend>

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
        <SwipeableCardsListItemBadge text={formatWeightDelta(delta)} icon="scale-bathroom" />
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
