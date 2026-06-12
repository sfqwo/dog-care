import { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  REMINDER_CATEGORY_LABELS,
  getReminderRoute,
} from "@dog-care/core/shared";
import {
  buildReminderStats,
  formatDateTime,
  getDayPlanReminders,
  getCompletedSourceId,
  isBeforeToday,
  isSameLocalDay,
  parseReminderDateTime,
} from "@dog-care/core/utils";
import type {
  CompletedCareTask,
  Feeding,
  Reminder,
  ReminderCategory,
  VetRecord,
  Walk,
} from "@dog-care/types";
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
} from "@/src/components";
import { useCareRecordsContext, useProfileContext } from "@/src/hooks";
import {
  completeReminderInList,
  removeReminderFromList,
} from "@/src/services/reminderActions";
import { loadJSON, saveJSON } from "@/src/storage/jsonStorage";
import { STORAGE_KEYS } from "@/src/storage/keys";
import {
  dueGradient,
  overdueGradient,
  pageGradient,
  planGradient,
  todayStyles,
} from "./today.styles";
import type { TodayCompletedItemProps, TodayPlanItemProps } from "./today.types";

type RemindersByPet = Record<string, Reminder[]>;
type TodayVetPlanItemData = {
  record: VetRecord;
  scheduledAt: number;
};

const CATEGORY_ICONS: Record<ReminderCategory, ReminderCardIcon> = {
  feeding: "food-variant",
  walk: "walk",
  vet: "medical-bag",
  treatment: "pill",
  other: "bell-outline",
};

type ReminderCardIcon =
  | "food-variant"
  | "walk"
  | "medical-bag"
  | "pill"
  | "bell-outline"
  | "check-circle-outline";

export default function TodayScreen() {
  const { profile, selectedPetId } = useProfileContext();
  const {
    getFeedings,
    getWalks,
    getVetRecords,
    getCompletedTasks,
    removeFeeding,
    removeWalk,
    removeVetRecord,
    addCompletedTask,
    removeCompletedTask,
  } = useCareRecordsContext();
  const [remindersByPet, setRemindersByPet] = useState<RemindersByPet>({});
  const [storageLoaded, setStorageLoaded] = useState(false);
  const hasPets = profile.pets.length > 0;
  const reminders = useMemo(
    () => (selectedPetId ? remindersByPet[selectedPetId] ?? [] : []),
    [remindersByPet, selectedPetId]
  );
  const feedings = getFeedings(selectedPetId);
  const walks = getWalks(selectedPetId);
  const vetRecords = getVetRecords(selectedPetId);
  const completedTasks = getCompletedTasks(selectedPetId);
  const planItems = useMemo(() => getDayPlanReminders(reminders), [reminders]);
  const vetPlanItems = useMemo(
    () =>
      buildVetPlanItems({
        vetRecords,
        completedTasks,
      }),
    [completedTasks, vetRecords]
  );
  const completedItems = useMemo(
    () =>
      buildCompletedTodayItems({
        feedings,
        walks,
        completedTasks,
      }),
    [completedTasks, feedings, walks]
  );
  const stats = useMemo(() => buildReminderStats(reminders), [reminders]);
  const now = Date.now();
  const notDoneVetCount = vetPlanItems.filter((item) => item.scheduledAt <= now).length;
  const plannedVetCount = vetPlanItems.filter((item) => item.scheduledAt > now).length;
  const notDoneCount = stats.dueNow + stats.overdue + notDoneVetCount;
  const plannedLaterToday = Math.max(stats.today - stats.dueNow, 0) + plannedVetCount;
  const nextItemAt = getNextPlanItemAt(planItems, vetPlanItems);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      loadJSON<RemindersByPet>(STORAGE_KEYS.REMINDERS, {}).then((storedReminders) => {
        if (!isActive) return;
        setRemindersByPet(storedReminders ?? {});
        setStorageLoaded(true);
      });
      return () => {
        isActive = false;
      };
    }, [])
  );

  useEffect(() => {
    if (!storageLoaded) return;
    saveJSON(STORAGE_KEYS.REMINDERS, remindersByPet);
  }, [remindersByPet, storageLoaded]);

  const handleOpenReminder = (reminder: Reminder) => {
    router.push(getReminderRoute(reminder.category));
  };

  const handleCompleteReminder = async (id: string) => {
    if (!selectedPetId) return;
    const nextList = await completeReminderInList(reminders, id, {
      onCompletedTask: addCompletedTask,
    });
    setRemindersByPet((prev) => {
      if (nextList === reminders) return prev;
      return { ...prev, [selectedPetId]: nextList };
    });
  };

  const handleRemoveReminder = async (id: string) => {
    if (!selectedPetId) return;
    const nextList = await removeReminderFromList(reminders, id);
    setRemindersByPet((prev) => {
      if (nextList === reminders) return prev;
      return { ...prev, [selectedPetId]: nextList };
    });
  };

  const handleRemoveCompletedItem = async (item: CompletedCareTask) => {
    if (!selectedPetId) return;
    const sourceId = getCompletedSourceId(item);

    if (item.source === "feeding") {
      removeFeeding(selectedPetId, sourceId);
    } else if (item.source === "walk") {
      removeWalk(selectedPetId, sourceId);
    } else if (item.source === "vet") {
      removeVetRecord(selectedPetId, sourceId);
      removeCompletedTask(selectedPetId, item.id);
    }
  };

  const handleOpenVetRecord = () => {
    router.push(getReminderRoute("vet"));
  };

  const handleCompleteVetRecord = async (record: VetRecord) => {
    if (!selectedPetId) return;
    const completedTask: CompletedCareTask = {
      id: `vet-${record.id}`,
      petId: selectedPetId,
      title: record.title,
      completedAt: Date.now(),
      source: "vet",
      category: "vet",
      detail: record.clinic ?? "Вет",
      note: record.note,
    };
    addCompletedTask(selectedPetId, completedTask);
  };

  const handleRemoveVetRecord = async (id: string) => {
    if (!selectedPetId) return;
    removeVetRecord(selectedPetId, id);
  };

  const heroSubtitle = hasPets
    ? nextItemAt
      ? `Ближайшее дело: ${formatDateTime(nextItemAt)}`
      : "На сегодня нет запланированных дел"
    : "Добавьте питомца, чтобы видеть план ухода.";
  const heroBadgeText = hasPets
    ? planItems.length + vetPlanItems.length
      ? `Дел: ${planItems.length + vetPlanItems.length}`
      : "Свободный день"
    : "Нет питомцев";
  const emptyStateText = hasPets
    ? "На сегодня нет дел. Добавьте напоминание, чтобы оно появилось здесь."
    : "Чтобы видеть план на день, добавьте питомца в профиле.";

  return (
    <LinearGradient colors={pageGradient} style={todayStyles.screenGradient}>
      <SafeAreaView style={todayStyles.safeArea}>
        <SwipeableCardsList>
          <SwipeableCardsListHeader>
            <View style={{ gap: 18 }}>
              <HeroCard>
                <HeroCardTitle text="План на день" />
                <HeroCardSubtitle text={heroSubtitle} />
                <HeroCardBadge text={heroBadgeText} />
              </HeroCard>

              <PetTabs />

              <StatsBlocks>
                <StatsBlock label="Не сделано" value={notDoneCount} />
                <StatsBlock label="Запланировано" value={plannedLaterToday} />
                <StatsBlock label="Сделано" value={completedItems.length} />
              </StatsBlocks>
            </View>
          </SwipeableCardsListHeader>

          <SwipeableCardsListEmpty text={emptyStateText} />

          {planItems.map((reminder) => (
            <TodayPlanItem
              key={reminder.id}
              reminder={reminder}
              onOpen={handleOpenReminder}
              onComplete={handleCompleteReminder}
              onRemove={handleRemoveReminder}
            />
          ))}

          {vetPlanItems.map((item) => (
            <TodayVetPlanItem
              key={item.record.id}
              item={item}
              onOpen={handleOpenVetRecord}
              onComplete={handleCompleteVetRecord}
              onRemove={handleRemoveVetRecord}
            />
          ))}

          {completedItems.map((item) => (
            <TodayCompletedItem key={item.id} item={item} onRemove={handleRemoveCompletedItem} />
          ))}
        </SwipeableCardsList>
      </SafeAreaView>
    </LinearGradient>
  );
}

function TodayPlanItem({
  reminder,
  onOpen,
  onComplete,
  onRemove,
}: TodayPlanItemProps) {
  const now = Date.now();
  const isOverdue = isBeforeToday(reminder.dueAt, now);
  const isDueNow = reminder.dueAt <= now && !isOverdue;
  const isTimedVetProcedure = reminder.category === "vet" || reminder.category === "treatment";
  const canComplete = !isTimedVetProcedure || reminder.dueAt <= now;
  const statusText = reminder.dueAt > now ? "Запланировано" : "Не сделано";
  const gradientColors = isOverdue ? overdueGradient : isDueNow ? dueGradient : planGradient;

  return (
    <SwipeableCardsListItem
      id={reminder.id}
      title={reminder.title}
      subtitle={`${REMINDER_CATEGORY_LABELS[reminder.category]} • ${formatDateTime(reminder.dueAt)}`}
      badgeText={statusText}
      note={reminder.note}
      gradientColors={gradientColors}
      badgeIcon={CATEGORY_ICONS[reminder.category]}
      noteIcon="calendar-check-outline"
      helperIcon="check-circle-outline"
      checkLabel="Отметить"
      checked={false}
      checkDisabled={!canComplete}
      onCheckPress={() => onComplete(reminder.id)}
      onPress={() => onOpen(reminder)}
      onLongPress={canComplete ? () => onComplete(reminder.id) : undefined}
      onRemove={() => onRemove(reminder.id)}
    />
  );
}

function TodayVetPlanItem({
  item,
  onOpen,
  onComplete,
  onRemove,
}: {
  item: TodayVetPlanItemData;
  onOpen: () => void;
  onComplete: (record: VetRecord) => void;
  onRemove: (id: string) => void;
}) {
  const now = Date.now();
  const isOverdue = isBeforeToday(item.scheduledAt, now);
  const isDueNow = item.scheduledAt <= now && !isOverdue;
  const canComplete = item.scheduledAt <= now;
  const statusText = item.scheduledAt > now ? "Запланировано" : "Не сделано";
  const gradientColors = isOverdue ? overdueGradient : isDueNow ? dueGradient : planGradient;

  return (
    <SwipeableCardsListItem
      id={item.record.id}
      title={item.record.title}
      subtitle={`Вет • ${formatDateTime(item.scheduledAt)}`}
      badgeText={statusText}
      note={item.record.note ?? item.record.clinic}
      gradientColors={gradientColors}
      badgeIcon="medical-bag"
      noteIcon="stethoscope"
      helperIcon="check-circle-outline"
      checkLabel="Отметить"
      checked={false}
      checkDisabled={!canComplete}
      onCheckPress={() => onComplete(item.record)}
      onPress={onOpen}
      onLongPress={canComplete ? () => onComplete(item.record) : undefined}
      onRemove={() => onRemove(item.record.id)}
    />
  );
}

function TodayCompletedItem({ item, onRemove }: TodayCompletedItemProps) {
  return (
    <SwipeableCardsListItem
      id={item.id}
      title={item.title}
      subtitle={`${item.detail ?? getCompletedSourceLabel(item.source)} • ${formatDateTime(item.completedAt)}`}
      badgeText="Сделано"
      note={item.note}
      gradientColors={planGradient}
      badgeIcon={getCompletedSourceIcon(item)}
      helperIcon="checkbox-marked"
      helperText="Отмечено сегодня"
      onRemove={() => onRemove(item)}
    />
  );
}

function buildCompletedTodayItems({
  feedings,
  walks,
  completedTasks,
}: {
  feedings: Feeding[];
  walks: Walk[];
  completedTasks: CompletedCareTask[];
}) {
  const now = Date.now();
  const feedingItems = feedings
    .filter((item) => isSameLocalDay(item.at, now))
    .map<CompletedCareTask>((item) => ({
      id: `feeding-${item.id}`,
      petId: item.petId,
      title: "Кормление",
      completedAt: item.at,
      source: "feeding",
      category: "feeding",
      detail: `${item.grams} г`,
      note: item.food,
    }));
  const walkItems = walks
    .filter((item) => isSameLocalDay(item.startedAt, now))
    .map<CompletedCareTask>((item) => ({
      id: `walk-${item.id}`,
      petId: item.petId,
      title: "Прогулка",
      completedAt: item.startedAt,
      source: "walk",
      category: "walk",
      detail: `${item.durationMin} мин`,
      note: item.note,
    }));
  const vetItems = completedTasks
    .filter((item) => item.source === "vet" && isSameLocalDay(item.completedAt, now));

  return [...feedingItems, ...walkItems, ...vetItems]
    .sort((a, b) => b.completedAt - a.completedAt);
}

function buildVetPlanItems({
  vetRecords,
  completedTasks,
}: {
  vetRecords: VetRecord[];
  completedTasks: CompletedCareTask[];
}) {
  const now = Date.now();
  const completedVetRecordIds = new Set(
    completedTasks
      .filter((task) => task.source === "vet")
      .map(getCompletedSourceId)
  );

  return vetRecords
    .map<TodayVetPlanItemData>((record) => ({
      record,
      scheduledAt: parseReminderDateTime(record.date, record.time) ?? record.at,
    }))
    .filter(
      (item) =>
        isSameLocalDay(item.scheduledAt, now) && !completedVetRecordIds.has(item.record.id)
    )
    .sort((a, b) => a.scheduledAt - b.scheduledAt);
}

function getNextPlanItemAt(reminders: Reminder[], vetItems: TodayVetPlanItemData[]) {
  const timestamps = [
    ...reminders.map((reminder) => reminder.dueAt),
    ...vetItems.map((item) => item.scheduledAt),
  ];
  if (!timestamps.length) return null;
  return Math.min(...timestamps);
}

function getCompletedSourceLabel(source: CompletedCareTask["source"]) {
  if (source === "feeding") return "Кормление";
  if (source === "walk") return "Прогулка";
  if (source === "vet") return "Вет";
  return "Напоминание";
}

function getCompletedSourceIcon(item: CompletedCareTask): ReminderCardIcon {
  if (item.category) return CATEGORY_ICONS[item.category];
  if (item.source === "feeding") return "food-variant";
  if (item.source === "walk") return "walk";
  if (item.source === "vet") return "medical-bag";
  return "check-circle-outline";
}
