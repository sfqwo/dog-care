import { View } from "react-native";

import { DateInput, Input } from "@/packages/ui/input";
import {
  Hint,
  SwipeableCardsListEmpty,
  SwipeableCardsListItemBadge,
  SwipeableCardsListItemFooter,
  SwipeableCardsListItemHeader,
  SwipeableCardsListItemHelper,
  SwipeableCardsListItem,
  SwipeableCardsListItemNote,
  SwipeableCardsListItemSubtitle,
  SwipeableCardsListItemTextBlock,
  SwipeableCardsListItemTitle,
  TimeRecorder,
  TimeRecorderButton,
  TimeRecorderRow,
  TimeRecorderTitle,
} from "@/src/components";
import { useVetCardDetails, useVetRecordForm } from "@/src/hooks";
import type {
  VetRecordCardProps,
  VetRecordsSectionProps,
} from "./types";
import { vetRecordsStyles } from "./styles";
import { formatTimeInput } from "@dog-care/core/utils";

export function VetRecordsSection({
  isActive,
  hasPets,
  records,
  selectedPetId,
  onAddRecord,
  onRemoveRecord,
}: VetRecordsSectionProps) {
  const {
    title,
    setTitle,
    clinic,
    setClinic,
    note,
    setNote,
    date,
    setDate,
    time,
    setTime,
    canSubmit,
    handleSubmit,
  } = useVetRecordForm({ selectedPetId, onSubmit: onAddRecord });

  if (!isActive) return null;

  const emptyStateText = hasPets
    ? "Добавьте первую запись о визите к ветеринару."
    : "Чтобы вести визиты, добавьте питомца.";

  return (
    <View style={vetRecordsStyles.section}>
      <TimeRecorder>
        <TimeRecorderTitle>Добавить запись</TimeRecorderTitle>
        <TimeRecorderRow>
          <Input
            value={title}
            onChangeText={setTitle}
            placeholder="Событие (например вакцинация)"
            editable={Boolean(selectedPetId)}
          />
          <TimeRecorderButton
            label="Сохранить"
            onPress={handleSubmit}
            disabled={!canSubmit}
          />
        </TimeRecorderRow>

        <DateInput
          value={date}
          onChangeText={setDate}
          placeholder="Дата приема"
          editable={Boolean(selectedPetId)}
        />

        <Input
          value={time}
          onChangeText={(value) => setTime(formatTimeInput(value))}
          placeholder="Время приема"
          keyboardType="number-pad"
          editable={Boolean(selectedPetId)}
        />

        <Input
          value={clinic}
          onChangeText={setClinic}
          placeholder="Клиника или врач (опционально)"
          editable={Boolean(selectedPetId)}
        />
        <Input
          value={note}
          onChangeText={setNote}
          placeholder="Заметка (опционально)"
          multiline
          editable={Boolean(selectedPetId)}
        />
        <Hint visible={!selectedPetId}>
          Добавьте питомца, чтобы фиксировать визиты к ветеринару.
        </Hint>
      </TimeRecorder>

      {records.length === 0 ? <SwipeableCardsListEmpty text={emptyStateText} /> : null}

      {records.map((record) => (
        <VetRecordCard key={record.id} record={record} onRemove={onRemoveRecord} />
      ))}
    </View>
  );
}

function VetRecordCard({ record, onRemove }: VetRecordCardProps) {
  const { gradientColors, cardTitle, cardSubtitle, badgeText, noteText } = useVetCardDetails(record);

  const handleRemove = () => onRemove(record.id);

  return (
    <SwipeableCardsListItem
      id={record.id}
      gradientColors={gradientColors}
      onRemove={handleRemove}
    >
      <SwipeableCardsListItemHeader>
        <SwipeableCardsListItemTextBlock>
          <SwipeableCardsListItemTitle text={cardTitle} />
          <SwipeableCardsListItemSubtitle text={cardSubtitle} />
        </SwipeableCardsListItemTextBlock>
        <SwipeableCardsListItemBadge text={badgeText} icon="medical-bag" />
      </SwipeableCardsListItemHeader>
      <SwipeableCardsListItemNote text={noteText} icon="stethoscope" />
      <SwipeableCardsListItemFooter>
        <SwipeableCardsListItemHelper />
      </SwipeableCardsListItemFooter>
    </SwipeableCardsListItem>
  );
}
