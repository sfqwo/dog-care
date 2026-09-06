import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  REMINDER_CATEGORY_LABELS,
  getReminderRoute,
} from "@dog-care/core/shared";
import {
  buildCalendarWeek,
  buildCareCalendarDay,
  type CareCalendarEvent,
  type CompletedCareTask,
  type VetRecord,
} from "@dog-care/domain";
import { formatLocalDate } from "@dog-care/core/utils";
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
  SwipeableCardsListItemBadge,
  SwipeableCardsListItemCheckAction,
  SwipeableCardsListItemFooter,
  SwipeableCardsListItemHeader,
  SwipeableCardsListItemNote,
  SwipeableCardsListItemSubtitle,
  SwipeableCardsListItemTextBlock,
  SwipeableCardsListItemTitle,
} from "@/src/components";
import { useCareRecordsContext } from "@/src/hooks/careRecordsContext";
import { useProfileContext } from "@/src/hooks/profileContext";
import { useRemindersStorage } from "@/src/hooks/useRemindersStorage";
import { useInformer } from "@/src/components/informer";
import { REMINDER_CATEGORY_ICONS } from "@/src/presentation/reminders";
import {
  calendarStyles,
  doneGradient,
  notDoneGradient,
  pageGradient,
  plannedGradient,
} from "@/src/screens/tabs/calendar/calendar.styles";
import type { CalendarDayButtonProps, CalendarEventItemProps } from "@/src/screens/tabs/calendar/calendar.types";

export default function CareCalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(Date.now());
  const { showSuccess } = useInformer();
  const { profile, selectedPetId } = useProfileContext();
  const {
    getFeedings,
    getWalks,
    getVetRecords,
    getMedicationCourses,
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
  const medicationCourses = getMedicationCourses(selectedPetId);
  const completedTasks = getCompletedTasks(selectedPetId);
  const weekDays = useMemo(() => buildCalendarWeek(selectedDate), [selectedDate]);
  const events = useMemo(
    () =>
      buildCareCalendarDay({
        date: selectedDate,
        feedings,
        walks,
        vetRecords,
        medicationCourses,
        reminders,
        completedTasks,
      }),
    [completedTasks, feedings, medicationCourses, reminders, selectedDate, vetRecords, walks]
  );

  const doneCount = events.filter((event) => event.status === "done").length;
  const plannedCount = events.filter((event) => event.status === "planned").length;
  const notDoneCount = events.filter((event) => event.status === "notDone").length;
  const selectedDateText = formatLocalDate(selectedDate, {
    day: "numeric",
    month: "long",
    weekday: "long",
  });
  const heroSubtitle = hasPets
    ? events.length
      ? `${selectedDateText}: ${events.length} событий`
      : `${selectedDateText}: событий нет`
    : "Добавьте питомца, чтобы видеть календарь ухода.";
  const heroBadgeText = hasPets ? "Обзор по дням" : "Нет питомцев";
  const emptyText = hasPets
    ? "На выбранную дату нет событий."
    : "Чтобы видеть календарь, добавьте питомца в профиле.";

  const handleOpenEvent = (event: CareCalendarEvent) => {
    if (event.kind === "feeding") router.push("/feeding");
    else if (event.kind === "walk") router.push("/walks");
    else if (event.kind === "vet" || event.category === "vet") router.push("/vet");
    else if (event.kind === "medication" || event.category === "treatment") {
      router.push("/vet?section=medications");
    } else if (event.category) {
      router.push(getReminderRoute(event.category));
    } else {
      router.push("/today");
    }
  };

  const handleCompleteEvent = async (event: CareCalendarEvent) => {
    if (!selectedPetId || !event.canComplete || !event.sourceId) return;

    if (event.kind === "reminder") {
      await completeReminder(event.sourceId, {
        onCompletedTask: addCompletedTask,
      });
      showSuccess("Дело отмечено выполненным");
      return;
    }

    if (event.kind === "vet") {
      const record = vetRecords.find((item) => item.id === event.sourceId);
      if (!record) return;
      addCompletedTask(selectedPetId, createCompletedVetTask(selectedPetId, record));
      showSuccess("Визит отмечен выполненным");
    }
  };

  const handleRemoveEvent = async (event: CareCalendarEvent) => {
    if (!selectedPetId || !event.canRemove || !event.sourceId) return;

    if (event.kind === "feeding") {
      removeFeeding(selectedPetId, event.sourceId);
    } else if (event.kind === "walk") {
      removeWalk(selectedPetId, event.sourceId);
    } else if (event.kind === "vet") {
      removeVetRecord(selectedPetId, event.sourceId);
    } else if (event.kind === "reminder") {
      await removeReminder(event.sourceId);
    } else if (event.kind === "completed") {
      removeCompletedTask(selectedPetId, event.sourceId);
    } else {
      return;
    }

    showSuccess("Событие удалено");
  };

  return (
    <LinearGradient colors={pageGradient} style={calendarStyles.screenGradient}>
      <SafeAreaView style={calendarStyles.safeArea}>
        <SwipeableCardsList>
          <SwipeableCardsListHeader>
            <View style={{ gap: 18 }}>
              <HeroCard>
                <HeroCardTitle text="Календарь ухода" />
                <HeroCardSubtitle text={heroSubtitle} />
                <HeroCardBadge text={heroBadgeText} />
              </HeroCard>

              <PetTabs />

              <View style={calendarStyles.weekRow}>
                {weekDays.map((day) => (
                  <CalendarDayButton
                    key={day.timestamp}
                    dayNumber={day.dayNumber}
                    weekDay={day.weekDay}
                    isSelected={day.isSelected}
                    isToday={day.isToday}
                    onPress={() => setSelectedDate(day.timestamp)}
                  />
                ))}
              </View>

              <StatsBlocks>
                <StatsBlock label="Запланировано" value={plannedCount} />
                <StatsBlock label="Сделано" value={doneCount} />
                <StatsBlock label="Не сделано" value={notDoneCount} />
              </StatsBlocks>
            </View>
          </SwipeableCardsListHeader>

          <SwipeableCardsListEmpty text={emptyText} />

          {events.map((event) => (
            <CalendarEventItem
              key={event.id}
              event={event}
              onOpen={handleOpenEvent}
              onComplete={handleCompleteEvent}
              onRemove={handleRemoveEvent}
            />
          ))}
        </SwipeableCardsList>
      </SafeAreaView>
    </LinearGradient>
  );
}

function CalendarDayButton({
  dayNumber,
  weekDay,
  isSelected,
  isToday,
  onPress,
}: CalendarDayButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      style={[
        calendarStyles.dayButton,
        isToday && calendarStyles.dayButtonToday,
        isSelected && calendarStyles.dayButtonSelected,
      ]}
      onPress={onPress}
    >
      <Text style={[calendarStyles.weekDayText, isSelected && calendarStyles.weekDayTextSelected]}>
        {weekDay}
      </Text>
      <Text style={[calendarStyles.dayNumberText, isSelected && calendarStyles.dayNumberTextSelected]}>
        {dayNumber}
      </Text>
    </Pressable>
  );
}

function CalendarEventItem({
  event,
  onOpen,
  onComplete,
  onRemove,
}: CalendarEventItemProps) {
  const statusText = getStatusLabel(event.status);
  const gradientColors = event.status === "done"
    ? doneGradient
    : event.status === "planned"
      ? plannedGradient
      : notDoneGradient;
  const categoryLabel = event.category ? REMINDER_CATEGORY_LABELS[event.category] : getKindLabel(event.kind);

  return (
    <SwipeableCardsListItem
      id={event.id}
      gradientColors={gradientColors}
      onPress={() => onOpen(event)}
      onRemove={() => onRemove(event)}
      renderRightActions={event.canRemove ? undefined : () => null}
    >
      <SwipeableCardsListItemHeader>
        <SwipeableCardsListItemTextBlock>
          <SwipeableCardsListItemTitle text={event.title} />
          <SwipeableCardsListItemSubtitle text={`${categoryLabel} • ${event.subtitle}`} />
        </SwipeableCardsListItemTextBlock>
        <SwipeableCardsListItemBadge text={statusText} icon={getEventIcon(event)} />
      </SwipeableCardsListItemHeader>
      <SwipeableCardsListItemNote text={event.note ?? event.detail} />
      <SwipeableCardsListItemFooter>
        {event.canComplete ? (
          <SwipeableCardsListItemCheckAction onPress={() => onComplete(event)} />
        ) : null}
      </SwipeableCardsListItemFooter>
    </SwipeableCardsListItem>
  );
}

function createCompletedVetTask(petId: string, record: VetRecord): CompletedCareTask {
  return {
    id: `vet-${record.id}`,
    petId,
    title: record.title,
    completedAt: Date.now(),
    source: "vet",
    category: "vet",
    detail: record.clinic ?? "Вет",
    note: record.note,
  };
}

function getStatusLabel(status: CareCalendarEvent["status"]) {
  if (status === "done") return "Сделано";
  if (status === "planned") return "Запланировано";
  return "Не сделано";
}

function getKindLabel(kind: CareCalendarEvent["kind"]) {
  if (kind === "feeding") return "Кормление";
  if (kind === "walk") return "Прогулка";
  if (kind === "vet") return "Вет";
  if (kind === "medication") return "Лечение";
  if (kind === "completed") return "Выполнено";
  return "Напоминание";
}

function getEventIcon(event: CareCalendarEvent) {
  if (event.category) return REMINDER_CATEGORY_ICONS[event.category];
  if (event.kind === "feeding") return "food-variant";
  if (event.kind === "walk") return "walk";
  if (event.kind === "vet") return "medical-bag";
  if (event.kind === "medication") return "pill";
  return "calendar-check-outline";
}
