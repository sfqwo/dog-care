import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "@/packages/ui/input/src";
import {
  HeroCard,
  HeroCardBadge,
  HeroCardSubtitle,
  HeroCardTitle,
  PetTabs,
  StatsBlock,
  StatsBlocks,
  SwipeableCardsList,
  SwipeableCardsListEmpty,
  SwipeableCardsListHeader,
  SwipeableCardsListItem,
  TimeRecorder,
  TimeRecorderButton,
  TimeRecorderHint,
  TimeRecorderRow,
  TimeRecorderTitle,
} from "@/src/components";
import type { VetRecord } from "@/src/domain/types";
import { useVetCardDetails } from "@/src/hooks/useVetCardDetails";
import { useProfileContext } from "@/src/hooks/profileContext";
import { loadJSON, saveJSON } from "@/src/storage/jsonStorage";
import { STORAGE_KEYS } from "@/src/storage/keys";
import { createUid } from "@dog-care/core/utils";
import { useVetStats } from "@/src/hooks/useVetStats";
import { pageGradient, vetStyles } from "./vet.styles";
import type { VetListItemProps } from "./vet.types";

type VetRecordsByPet = Record<string, VetRecord[]>;

export default function VetScreen() {
  const { profile } = useProfileContext();
  const [recordsByPet, setRecordsByPet] = useState<VetRecordsByPet>({});
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [clinic, setClinic] = useState("");
  const [note, setNote] = useState("");
  const hasPets = profile.pets.length > 0;
  const activePetId = hasPets ? selectedPetId ?? profile.pets[0]?.id ?? null : null;
  const records = activePetId ? recordsByPet[activePetId] ?? [] : [];
  const stats = useVetStats(records);

  useEffect(() => {
    loadJSON<VetRecordsByPet>(STORAGE_KEYS.VET, {}).then((stored) => {
      setRecordsByPet(stored ?? {});
    });
  }, []);

  useEffect(() => {
    saveJSON(STORAGE_KEYS.VET, recordsByPet);
  }, [recordsByPet]);

  useEffect(() => {
    if (!profile.pets.length) {
      setSelectedPetId(null);
      return;
    }
    setSelectedPetId((current) => {
      if (current && profile.pets.some((pet) => pet.id === current)) return current;
      return profile.pets[0]?.id ?? null;
    });
  }, [profile.pets]);

  const canAddRecord = useMemo(
    () => Boolean(activePetId) && title.trim().length > 0,
    [activePetId, title]
  );

  const handleAddRecord = () => {
    if (!canAddRecord || !activePetId) return;
    const newRecord: VetRecord = {
      id: createUid(),
      at: Date.now(),
      petId: activePetId,
      title: title.trim(),
      clinic: clinic.trim() || undefined,
      note: note.trim() || undefined,
    };
    setRecordsByPet((prev) => {
      const current = prev[activePetId] ?? [];
      return { ...prev, [activePetId]: [newRecord, ...current] };
    });
    setTitle("");
    setClinic("");
    setNote("");
  };

  const handleRemoveRecord = (id: string) => {
    if (!activePetId) return;
    setRecordsByPet((prev) => {
      const current = prev[activePetId] ?? [];
      const filtered = current.filter((record) => record.id !== id);
      if (filtered.length === current.length) return prev;
      return { ...prev, [activePetId]: filtered };
    });
  };

  const heroBadgeText = hasPets
    ? records.length
      ? "Здоровье под контролем"
      : "Запланируйте прием"
    : "Добавьте питомца";
  const heroSubtitle = hasPets
    ? records.length
      ? `Последний визит: ${stats.lastVisitText}`
      : "Добавьте первую запись"
    : "Перейдите в профиль и заведите питомца.";
  const emptyStateText = hasPets
    ? "Добавьте первую запись о визите к ветеринару."
    : "Чтобы вести визиты, добавьте питомца.";

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

              <PetTabs pets={profile.pets} selectedId={activePetId} onSelect={setSelectedPetId} />

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
                    editable={Boolean(activePetId)}
                  />
                  <TimeRecorderButton label="Сохранить" onPress={handleAddRecord} disabled={!canAddRecord} />
                </TimeRecorderRow>
                <Input
                  value={clinic}
                  onChangeText={setClinic}
                  placeholder="Клиника или врач (опционально)"
                  editable={Boolean(activePetId)}
                />
                <Input
                  value={note}
                  onChangeText={setNote}
                  placeholder="Заметка (опционально)"
                  multiline
                  editable={Boolean(activePetId)}
                />
                <TimeRecorderHint visible={!activePetId}>
                  Добавьте питомца, чтобы фиксировать визиты к ветеринару.
                </TimeRecorderHint>
              </TimeRecorder>
            </View>
          </SwipeableCardsListHeader>
          <SwipeableCardsListEmpty text={emptyStateText} />

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
      badgeIcon="medical-bag"
      noteIcon="stethoscope"
      onRemove={handleRemove}
    />
  );
}
