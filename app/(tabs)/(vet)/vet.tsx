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
import { formatDateTime } from "@/src/ui/format";
import { createUid } from "@/src/utils/createUid";
import { pageGradient, vetStyles } from "./vet.styles";

export default function VetScreen() {
  const [records, setRecords] = useState<VetRecord[]>([]);
  const [title, setTitle] = useState("");
  const [clinic, setClinic] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    loadJSON<VetRecord[]>(STORAGE_KEYS.VET, []).then(setRecords);
  }, []);

  useEffect(() => {
    saveJSON(STORAGE_KEYS.VET, records);
  }, [records]);

  const canAdd = useMemo(() => title.trim().length > 0, [title]);

  const stats = useMemo(() => {
    if (!records.length) return { clinicCount: 0, lastVisitText: "Нет визитов" };
    const clinicNames = records
      .map((record) => record.clinic?.trim())
      .filter((value): value is string => Boolean(value));
    const clinicCount = new Set(clinicNames).size;
    const lastVisitText = formatDateTime(records[0].at);
    return { clinicCount, lastVisitText };
  }, [records]);

  const addRecord = () => {
    if (!canAdd) return;
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

  const removeRecord = (id: string) =>
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
                <StatsBlock label="Последний визит" value={stats.lastVisitText} />
              </StatsBlocks>

              <TimeRecorder>
                <TimeRecorderTitle>Добавить запись</TimeRecorderTitle>
                <TimeRecorderRow>
                  <Input
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Событие (например вакцинация)"
                  />
                  <TimeRecorderButton label="Сохранить" onPress={addRecord} disabled={!canAdd} />
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
            <VetListItem key={record.id} record={record} onRemove={removeRecord} />
          ))}
        </SwipeableCardsList>
      </SafeAreaView>
    </LinearGradient>
  );
}

function VetListItem({
  record,
  onRemove,
}: {
  record: VetRecord;
  onRemove: (id: string) => void;
}) {
  const { gradientColors, cardTitle, cardSubtitle, clinicLabel, noteText } =
    useVetCardDetails(record);

  return (
    <SwipeableCardsListItem
      id={record.id}
      title={cardTitle}
      subtitle={cardSubtitle}
      durationText={clinicLabel}
      note={noteText}
      gradientColors={gradientColors}
      durationIcon="medical-bag"
      noteIcon="stethoscope"
      onRemove={() => onRemove(record.id)}
    />
  );
}
