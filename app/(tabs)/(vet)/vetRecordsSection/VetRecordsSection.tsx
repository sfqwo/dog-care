import { View } from "react-native";

import { Input } from "@/packages/ui/input";
import {
  Hint,
  SwipeableCardsListEmpty,
  SwipeableCardsListItem,
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
      title={cardTitle}
      subtitle={cardSubtitle}
      badgeText={badgeText}
      note={noteText}
      gradientColors={gradientColors}
      badgeIcon="medical-bag"
      noteIcon="stethoscope"
      onRemove={handleRemove}
    />
  );
}
