import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  HeroCard,
  HeroCardBadge,
  HeroCardSubtitle,
  HeroCardTitle,
  Input,
  StatsBlock,
  StatsBlocks,
  SwipeableCardsList,
  SwipeableCardsListEmpty,
  SwipeableCardsListHeader,
  SwipeableCardsListItem,
  TimeRecorder,
  TimeRecorderButton,
  TimeRecorderRow,
  TimeRecorderTitle,
} from "@/src/components";
import type { VetRecord } from "@/src/domain/types";
import { useVetCardDetails } from "@/src/hooks/useVetCardDetails";
import { loadJSON, saveJSON } from "@/src/storage/jsonStorage";
import { STORAGE_KEYS } from "@/src/storage/keys";
import { createUid } from "@/src/utils/createUid";
import { useVetStats } from "@/src/hooks/useVetStats";
import { pageGradient, vetStyles } from "./vet.styles";

type VetListItemProps = {
  record: VetRecord;
  onRemove: (id: string) => void;
};

export default function VetScreen() {
  const [records, setRecords] = useState<VetRecord[]>([]);
  const [title, setTitle] = useState("");
  const [clinic, setClinic] = useState("");
  const [note, setNote] = useState("");
  const stats = useVetStats(records);

  useEffect(() => {
    loadJSON<VetRecord[]>(STORAGE_KEYS.VET, []).then(setRecords);
  }, []);

  useEffect(() => {
    saveJSON(STORAGE_KEYS.VET, records);
  }, [records]);

  const canAddRecord = useMemo(() => title.trim().length > 0, [title]);

  const handleAddRecord = () => {
    if (!canAddRecord) return;
    const newRecord: VetRecord = {
      id: createUid(),
      at: Date.now(),
      title: title.trim(),
      clinic: clinic.trim() || undefined,
      note: note.trim() || undefined,
    };
    setRecords((prev) => [newRecord, ...prev]);
    setTitle("");
    setClinic("");
    setNote("");
  };

  const handleRemoveRecord = (id: string) =>
    setRecords((prev) => prev.filter((record) => record.id !== id));

  const heroBadgeText = records.length ? "Здоровье под контролем" : "Запланируйте прием";
  const heroSubtitle = records.length
    ? `Последний визит: ${stats.lastVisitText}`
    : "Добавьте первую запись";

  return (
    <LinearGradient colors={pageGradient} style={vetStyles.screenGradient}>
      <SafeAreaView style={vetStyles.safeArea}>
        <SwipeableCardsList>
          <SwipeableCardsListHeader>
            <View style={{ gap: 18 }}>
              <HeroCard>
                <HeroCardTitle text="Вет-журнал" />
                <HeroCardSubtitle text={heroSubtitle} />
                <HeroCardBadge text={heroBadgeText} />
              </HeroCard>

              <StatsBlocks>
                <StatsBlock label="Записей" value={records.length} />
                <StatsBlock label="Клиник" value={stats.clinicCount} />
                <StatsBlock label="Прошлый визит" value={stats.lastVisitText} />
              </StatsBlocks>

              <TimeRecorder>
                <TimeRecorderTitle>Добавить запись</TimeRecorderTitle>
                <TimeRecorderRow>
                  <Input
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Событие (например вакцинация)"
                  />
                  <TimeRecorderButton label="Сохранить" onPress={handleAddRecord} disabled={!canAddRecord} />
                </TimeRecorderRow>
                <Input
                  value={clinic}
                  onChangeText={setClinic}
                  placeholder="Клиника или врач (опционально)"
                />
                <Input
                  value={note}
                  onChangeText={setNote}
                  placeholder="Заметка (опционально)"
                  multiline
                />
              </TimeRecorder>
            </View>
          </SwipeableCardsListHeader>
          <SwipeableCardsListEmpty text="Добавьте первую запись о визите к ветеринару." />

          {records.map((record) => (
            <VetListItem key={record.id} record={record} onRemove={handleRemoveRecord} />
          ))}
        </SwipeableCardsList>
      </SafeAreaView>
    </LinearGradient>
  );
}

function VetListItem({ record, onRemove }: VetListItemProps) {
  const {
    gradientColors,
    cardTitle,
    cardSubtitle,
    badgeText,
    noteText
  } = useVetCardDetails(record);

  const handleRemove = () => onRemove(record.id);

  return (
    <SwipeableCardsListItem
      id={record.id}
      title={cardTitle}
      subtitle={cardSubtitle}
      badgeText={badgeText}
      note={noteText}
      gradientColors={gradientColors}
      durationIcon="medical-bag"
      noteIcon="stethoscope"
      onRemove={handleRemove}
    />
  );
}
