import { useCallback, useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";

import { Select, SelectOption, SelectOptionTitle } from "@dog-care/select";
import {
  REMINDER_CATEGORY_LABELS,
  REMINDER_CATEGORY_OPTIONS,
  REMINDER_REPEAT_LABELS,
  REMINDER_REPEAT_OPTIONS,
  getReminderRoute,
} from "@dog-care/core/shared";
import {
  buildReminderStats,
  createUid,
  formatReminderDateForInput,
  formatReminderDateInput,
  formatReminderTimeForInput,
  formatReminderTimeInput,
  formatDateTime,
  isBeforeToday,
  parseReminderDateTime,
  sortReminders,
} from "@dog-care/core/utils";
import type {
  Reminder,
  ReminderCategory,
  ReminderRepeat,
} from "@dog-care/types";
import { Input } from "@/packages/ui/input";
import {
  HeroCard,
  HeroCardBadge,
  HeroCardSubtitle,
  HeroCardTitle,
  Hint,
  PetTabs,
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
import { useCareRecordsContext, useProfileContext } from "@/src/hooks";
import {
  scheduleReminderNotification,
} from "@/src/services/reminderNotifications";
import {
  completeReminderInList,
  removeReminderFromList,
} from "@/src/services/reminderActions";
import { loadJSON, saveJSON } from "@/src/storage/jsonStorage";
import { STORAGE_KEYS } from "@/src/storage/keys";
import {
  completedGradient,
  overdueGradient,
  pageGradient,
  reminderGradient,
  remindersStyles,
} from "./reminders.styles";
import type {
  CompletedReminderListItemProps,
  ReminderListItemProps,
} from "./reminders.types";

type RemindersByPet = Record<string, Reminder[]>;

const CATEGORY_ICONS: Record<ReminderCategory, ReminderCardIcon> = {
  feeding: "food-variant",
  walk: "walk",
  vet: "medical-bag",
  treatment: "pill",
  other: "bell-outline",
};

type ReminderCardIcon = "food-variant" | "walk" | "medical-bag" | "pill" | "bell-outline";

export default function RemindersScreen() {
  const { profile, selectedPetId } = useProfileContext();
  const { getCompletedTasks, addCompletedTask, removeCompletedTask } = useCareRecordsContext();
  const [remindersByPet, setRemindersByPet] = useState<RemindersByPet>({});
  const [storageLoaded, setStorageLoaded] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(formatReminderDateForInput(Date.now()));
  const [time, setTime] = useState(formatReminderTimeForInput(Date.now()));
  const [category, setCategory] = useState<ReminderCategory>("feeding");
  const [repeat, setRepeat] = useState<ReminderRepeat>("none");
  const [note, setNote] = useState("");
  const hasPets = profile.pets.length > 0;
  const reminders = useMemo(
    () => (selectedPetId ? remindersByPet[selectedPetId] ?? [] : []),
    [remindersByPet, selectedPetId]
  );
  const sortedReminders = useMemo(() => sortReminders(reminders), [reminders]);
  const completedReminderItems = useMemo(
    () =>
      getCompletedTasks(selectedPetId)
        .filter((item) => item.source === "reminder")
        .sort((a, b) => b.completedAt - a.completedAt),
    [getCompletedTasks, selectedPetId]
  );
  const dueAt = useMemo(() => parseReminderDateTime(date, time), [date, time]);
  const canAddReminder = Boolean(selectedPetId && title.trim() && dueAt);
  const stats = useMemo(() => buildReminderStats(reminders), [reminders]);

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

  const handleAddReminder = async () => {
    if (!canAddReminder || !selectedPetId || !dueAt) return;

    const reminderBase: Reminder = {
      id: createUid(),
      petId: selectedPetId,
      title: title.trim(),
      dueAt,
      category,
      repeat,
      note: note.trim() || undefined,
    };
    const notificationId = await scheduleReminderNotification({
      reminder: reminderBase,
      categoryLabel: REMINDER_CATEGORY_LABELS[category],
    });
    const newReminder = {
      ...reminderBase,
      notificationId,
    };

    setRemindersByPet((prev) => {
      const current = prev[selectedPetId] ?? [];
      return { ...prev, [selectedPetId]: [newReminder, ...current] };
    });
    setTitle("");
    setNote("");
  };

  const handleRemoveReminder = async (id: string) => {
    if (!selectedPetId) return;
    const nextList = await removeReminderFromList(reminders, id);
    setRemindersByPet((prev) => {
      if (nextList === reminders) return prev;
      return { ...prev, [selectedPetId]: nextList };
    });
  };

  const handleToggleReminderDone = async (id: string) => {
    if (!selectedPetId) return;
    const nextList = await completeReminderInList(reminders, id, {
      onCompletedTask: addCompletedTask,
    });
    setRemindersByPet((prev) => {
      if (nextList === reminders) return prev;
      return { ...prev, [selectedPetId]: nextList };
    });
  };

  const handleOpenReminder = (reminder: Reminder) => {
    router.push(getReminderRoute(reminder.category));
  };

  const handleRemoveCompletedReminder = (id: string) => {
    if (!selectedPetId) return;
    removeCompletedTask(selectedPetId, id);
  };

  const nextReminder = sortedReminders.find((reminder) => !reminder.completedAt);
  const heroSubtitle = hasPets
    ? nextReminder
      ? `Ближайшее: ${formatDateTime(nextReminder.dueAt)}`
      : "Добавьте первое напоминание"
    : "Добавьте питомца, чтобы планировать уход.";
  const heroBadgeText = hasPets
    ? stats.overdue
      ? `Просрочено: ${stats.overdue}`
      : "План ухода"
    : "Нет питомцев";
  const emptyStateText = hasPets
    ? "Напоминаний пока нет — добавьте первое дело по уходу."
    : "Чтобы добавлять напоминания, заведите питомца в профиле.";

  return (
    <LinearGradient colors={pageGradient} style={remindersStyles.screenGradient}>
      <SafeAreaView style={remindersStyles.safeArea}>
        <SwipeableCardsList>
          <SwipeableCardsListHeader>
            <View style={{ gap: 18 }}>
              <HeroCard>
                <HeroCardTitle text="Напоминания" />
                <HeroCardSubtitle text={heroSubtitle} />
                <HeroCardBadge text={heroBadgeText} />
              </HeroCard>

              <PetTabs />

              <StatsBlocks>
                <StatsBlock label="Активных" value={stats.active} />
                <StatsBlock label="Сегодня" value={stats.today} />
                <StatsBlock label="К выполнению" value={stats.dueNow} />
              </StatsBlocks>

              <TimeRecorder>
                <TimeRecorderTitle>Добавить напоминание</TimeRecorderTitle>
                <View style={remindersStyles.formColumn}>
                  <Input
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Что напомнить?"
                    editable={Boolean(selectedPetId)}
                  />
                  <TimeRecorderRow>
                    <View style={remindersStyles.inlineField}>
                      <Input
                        value={date}
                        onChangeText={(value) => setDate(formatReminderDateInput(value))}
                        placeholder="ДД.ММ.ГГГГ"
                        keyboardType="number-pad"
                        editable={Boolean(selectedPetId)}
                      />
                    </View>
                    <View style={remindersStyles.inlineField}>
                      <Input
                        value={time}
                        onChangeText={(value) => setTime(formatReminderTimeInput(value))}
                        placeholder="ЧЧ:ММ"
                        keyboardType="number-pad"
                        editable={Boolean(selectedPetId)}
                      />
                    </View>
                  </TimeRecorderRow>
                  <View style={remindersStyles.inlineRow}>
                    <View style={remindersStyles.inlineField}>
                      <Select
                        value={category}
                        onChange={(value) => setCategory(value as ReminderCategory)}
                        placeholder="Категория"
                        disabled={!selectedPetId}
                      >
                        {REMINDER_CATEGORY_OPTIONS.map((option) => (
                          <SelectOption key={option.value} value={option.value}>
                            <SelectOptionTitle text={option.title} />
                          </SelectOption>
                        ))}
                      </Select>
                    </View>
                    <View style={remindersStyles.inlineField}>
                      <Select
                        value={repeat}
                        onChange={(value) => setRepeat(value as ReminderRepeat)}
                        placeholder="Повтор"
                        disabled={!selectedPetId}
                      >
                        {REMINDER_REPEAT_OPTIONS.map((option) => (
                          <SelectOption key={option.value} value={option.value}>
                            <SelectOptionTitle text={option.title} />
                          </SelectOption>
                        ))}
                      </Select>
                    </View>
                  </View>
                  <Input
                    value={note}
                    onChangeText={setNote}
                    placeholder="Заметка (опционально)"
                    multiline
                    editable={Boolean(selectedPetId)}
                  />
                  <TimeRecorderButton
                    label="Добавить"
                    onPress={handleAddReminder}
                    disabled={!canAddReminder}
                  />
                </View>
                <Hint visible={!selectedPetId}>
                  Добавьте питомца в профиле, чтобы создавать напоминания.
                </Hint>
              </TimeRecorder>
            </View>
          </SwipeableCardsListHeader>

          <SwipeableCardsListEmpty text={emptyStateText} />

          {sortedReminders.map((reminder) => (
            <ReminderListItem
              key={reminder.id}
              reminder={reminder}
              onRemove={handleRemoveReminder}
              onToggleDone={handleToggleReminderDone}
              onOpen={handleOpenReminder}
            />
          ))}

          {completedReminderItems.length ? (
            <ReminderSectionHeader
              key="completed-reminders-title"
              id="completed-reminders-title"
              title="Выполненные"
              subtitle="Отмеченные напоминания"
            />
          ) : null}

          {completedReminderItems.map((item) => (
            <CompletedReminderListItem
              key={item.id}
              item={item}
              onRemove={handleRemoveCompletedReminder}
            />
          ))}
        </SwipeableCardsList>
      </SafeAreaView>
    </LinearGradient>
  );
}

function ReminderListItem({
  reminder,
  onRemove,
  onToggleDone,
  onOpen,
}: ReminderListItemProps) {
  const now = Date.now();
  const isCompleted = Boolean(reminder.completedAt);
  const isDueNow = !isCompleted && reminder.dueAt <= now;
  const isOverdue = !isCompleted && isBeforeToday(reminder.dueAt, now);
  const gradientColors = isCompleted
    ? completedGradient
    : isOverdue
      ? overdueGradient
      : reminderGradient;
  const statusText = isCompleted
    ? "Выполнено"
    : isOverdue
      ? "Просрочено"
      : isDueNow
        ? "К выполнению"
      : "Запланировано";
  const repeatText = REMINDER_REPEAT_LABELS[reminder.repeat];
  const noteParts = [
    reminder.note,
    reminder.repeat !== "none" ? `Повтор: ${repeatText}` : undefined,
  ].filter(Boolean);

  return (
    <SwipeableCardsListItem
      id={reminder.id}
      title={reminder.title}
      subtitle={`Напоминание • ${REMINDER_CATEGORY_LABELS[reminder.category]} • ${formatDateTime(reminder.dueAt)}`}
      badgeText={statusText}
      note={noteParts.join(" • ")}
      gradientColors={gradientColors}
      badgeIcon={CATEGORY_ICONS[reminder.category]}
      noteIcon="bell-ring-outline"
      checkLabel="Отметить"
      checked={false}
      onCheckPress={() => onToggleDone(reminder.id)}
      onPress={() => onOpen(reminder)}
      onLongPress={() => onToggleDone(reminder.id)}
      onRemove={() => onRemove(reminder.id)}
    />
  );
}

function ReminderSectionHeader({
  title,
  subtitle,
}: {
  id: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={remindersStyles.sectionHeader}>
      <Text style={remindersStyles.sectionTitle}>{title}</Text>
      <Text style={remindersStyles.sectionSubtitle}>{subtitle}</Text>
    </View>
  );
}

function CompletedReminderListItem({
  item,
  onRemove,
}: CompletedReminderListItemProps) {
  return (
    <SwipeableCardsListItem
      id={item.id}
      title={item.title}
      subtitle={`Напоминание • ${item.detail ?? "Выполнено"} • ${formatDateTime(item.completedAt)}`}
      badgeText="Выполнено"
      note={item.note}
      gradientColors={completedGradient}
      badgeIcon={item.category ? CATEGORY_ICONS[item.category] : "bell-outline"}
      helperText="Свайп влево — кнопка удаления"
      onRemove={() => onRemove(item.id)}
    />
  );
}
