import { useMemo } from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  REMINDER_CATEGORY_LABELS,
  getReminderRoute,
} from "@dog-care/core/shared";
import {
  buildCompletedTodayItems,
  buildReminderStats,
  buildVetPlanItems,
  type CompletedCareTask,
  getCompletedSourceId,
  getCompletedSourceLabel,
  getDayPlanReminders,
  getNextPlanItemAt,
  type Reminder,
  type TodayVetPlanItem as TodayVetPlanEntry,
  type VetRecord,
} from "@dog-care/domain";
import {
  formatDateTime,
  isBeforeToday,
} from "@dog-care/core/utils";
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
  SwipeableCardsListItemBadge,
  SwipeableCardsListItemCheckAction,
  SwipeableCardsListItemFooter,
  SwipeableCardsListItemHeader,
  SwipeableCardsListItemHelper,
  SwipeableCardsListItem,
  SwipeableCardsListItemNote,
  SwipeableCardsListItemSubtitle,
  SwipeableCardsListItemTextBlock,
  SwipeableCardsListItemTitle,
} from "@/src/components";
import { useCareRecordsContext, useProfileContext, useRemindersStorage } from "@/src/hooks";
import {
  REMINDER_CATEGORY_ICONS,
  type ReminderCategoryIcon,
} from "@/src/presentation/reminders";
import {
  dueGradient,
  overdueGradient,
  pageGradient,
  planGradient,
  todayStyles,
} from "./today.styles";
import type { TodayCompletedItemProps, TodayPlanItemProps } from "./today.types";

type ReminderCardIcon = ReminderCategoryIcon | "check-circle-outline";

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
  const { reminders, removeReminder, completeReminder } = useRemindersStorage(selectedPetId);
  const hasPets = profile.pets.length > 0;
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

  const handleOpenReminder = (reminder: Reminder) => {
    router.push(getReminderRoute(reminder.category));
  };

  const handleCompleteReminder = async (id: string) => {
    if (!selectedPetId) return;
    await completeReminder(id, {
      onCompletedTask: addCompletedTask,
    });
  };

  const handleRemoveReminder = async (id: string) => {
    if (!selectedPetId) return;
    await removeReminder(id);
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
      gradientColors={gradientColors}
      onPress={() => onOpen(reminder)}
      onLongPress={canComplete ? () => onComplete(reminder.id) : undefined}
      onRemove={() => onRemove(reminder.id)}
    >
      <SwipeableCardsListItemHeader>
        <SwipeableCardsListItemTextBlock>
          <SwipeableCardsListItemTitle text={reminder.title} />
          <SwipeableCardsListItemSubtitle
            text={`${REMINDER_CATEGORY_LABELS[reminder.category]} • ${formatDateTime(reminder.dueAt)}`}
          />
        </SwipeableCardsListItemTextBlock>
        <SwipeableCardsListItemBadge
          text={statusText}
          icon={REMINDER_CATEGORY_ICONS[reminder.category]}
        />
      </SwipeableCardsListItemHeader>
      <SwipeableCardsListItemNote text={reminder.note} icon="calendar-check-outline" />
      <SwipeableCardsListItemFooter>
        <SwipeableCardsListItemHelper icon="check-circle-outline" />
        <SwipeableCardsListItemCheckAction
          onPress={() => onComplete(reminder.id)}
          disabled={!canComplete}
        />
      </SwipeableCardsListItemFooter>
    </SwipeableCardsListItem>
  );
}

function TodayVetPlanItem({
  item,
  onOpen,
  onComplete,
  onRemove,
}: {
  item: TodayVetPlanEntry;
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
      gradientColors={gradientColors}
      onPress={onOpen}
      onLongPress={canComplete ? () => onComplete(item.record) : undefined}
      onRemove={() => onRemove(item.record.id)}
    >
      <SwipeableCardsListItemHeader>
        <SwipeableCardsListItemTextBlock>
          <SwipeableCardsListItemTitle text={item.record.title} />
          <SwipeableCardsListItemSubtitle text={`Вет • ${formatDateTime(item.scheduledAt)}`} />
        </SwipeableCardsListItemTextBlock>
        <SwipeableCardsListItemBadge text={statusText} icon="medical-bag" />
      </SwipeableCardsListItemHeader>
      <SwipeableCardsListItemNote text={item.record.note ?? item.record.clinic} icon="stethoscope" />
      <SwipeableCardsListItemFooter>
        <SwipeableCardsListItemHelper icon="check-circle-outline" />
        <SwipeableCardsListItemCheckAction
          onPress={() => onComplete(item.record)}
          disabled={!canComplete}
        />
      </SwipeableCardsListItemFooter>
    </SwipeableCardsListItem>
  );
}

function TodayCompletedItem({ item, onRemove }: TodayCompletedItemProps) {
  return (
    <SwipeableCardsListItem
      id={item.id}
      gradientColors={planGradient}
      onRemove={() => onRemove(item)}
    >
      <SwipeableCardsListItemHeader>
        <SwipeableCardsListItemTextBlock>
          <SwipeableCardsListItemTitle text={item.title} />
          <SwipeableCardsListItemSubtitle
            text={`${item.detail ?? getCompletedSourceLabel(item.source)} • ${formatDateTime(item.completedAt)}`}
          />
        </SwipeableCardsListItemTextBlock>
        <SwipeableCardsListItemBadge text="Сделано" icon={getCompletedSourceIcon(item)} />
      </SwipeableCardsListItemHeader>
      <SwipeableCardsListItemNote text={item.note} />
      <SwipeableCardsListItemFooter>
        <SwipeableCardsListItemHelper text="Отмечено сегодня" icon="checkbox-marked" />
      </SwipeableCardsListItemFooter>
    </SwipeableCardsListItem>
  );
}

function getCompletedSourceIcon(item: CompletedCareTask): ReminderCardIcon {
  if (item.category) return REMINDER_CATEGORY_ICONS[item.category];
  if (item.source === "feeding") return "food-variant";
  if (item.source === "walk") return "walk";
  if (item.source === "vet") return "medical-bag";
  return "check-circle-outline";
}
