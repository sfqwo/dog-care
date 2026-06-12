import { useMemo } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

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
  formatReminderDateInput,
  formatReminderTimeInput,
  sortReminders,
} from "@dog-care/domain";
import {
  createUid,
  formatDateTime,
  isBeforeToday,
} from "@dog-care/core/utils";
import type {
  Reminder,
  ReminderCategory,
  ReminderRepeat,
} from "@dog-care/domain";
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
  TimeRecorder,
  TimeRecorderButton,
  TimeRecorderRow,
  TimeRecorderTitle,
} from "@/src/components";
import {
  useCareRecordsContext,
  useProfileContext,
  useReminderForm,
  useRemindersStorage,
} from "@/src/hooks";
import { REMINDER_CATEGORY_ICONS } from "@/src/presentation/reminders";
import {
  scheduleReminderNotification,
} from "@/src/services/reminderNotifications";
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

export default function RemindersScreen() {
  const { profile, selectedPetId } = useProfileContext();
  const { getCompletedTasks, addCompletedTask, removeCompletedTask } = useCareRecordsContext();
  const {
    reminders,
    addReminder,
    removeReminder,
    completeReminder,
  } = useRemindersStorage(selectedPetId);
  const {
    title,
    setTitle,
    date,
    setDate,
    time,
    setTime,
    category,
    setCategory,
    repeat,
    setRepeat,
    note,
    setNote,
    dueAt,
    canAddReminder,
    resetReminderForm,
  } = useReminderForm(selectedPetId);
  const hasPets = profile.pets.length > 0;
  const sortedReminders = useMemo(() => sortReminders(reminders), [reminders]);
  const completedReminderItems = useMemo(
    () =>
      getCompletedTasks(selectedPetId)
        .filter((item) => item.source === "reminder")
        .sort((a, b) => b.completedAt - a.completedAt),
    [getCompletedTasks, selectedPetId]
  );
  const stats = useMemo(() => buildReminderStats(reminders), [reminders]);

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

    addReminder(newReminder);
    resetReminderForm();
  };

  const handleRemoveReminder = async (id: string) => {
    if (!selectedPetId) return;
    await removeReminder(id);
  };

  const handleToggleReminderDone = async (id: string) => {
    if (!selectedPetId) return;
    await completeReminder(id, {
      onCompletedTask: addCompletedTask,
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
      gradientColors={gradientColors}
      onPress={() => onOpen(reminder)}
      onLongPress={() => onToggleDone(reminder.id)}
      onRemove={() => onRemove(reminder.id)}
    >
      <SwipeableCardsListItemHeader>
        <SwipeableCardsListItemTextBlock>
          <SwipeableCardsListItemTitle text={reminder.title} />
          <SwipeableCardsListItemSubtitle
            text={`Напоминание • ${REMINDER_CATEGORY_LABELS[reminder.category]} • ${formatDateTime(reminder.dueAt)}`}
          />
        </SwipeableCardsListItemTextBlock>
        <SwipeableCardsListItemBadge
          text={statusText}
          icon={REMINDER_CATEGORY_ICONS[reminder.category]}
        />
      </SwipeableCardsListItemHeader>
      <SwipeableCardsListItemNote text={noteParts.join(" • ")} icon="bell-ring-outline" />
      <SwipeableCardsListItemFooter>
        <SwipeableCardsListItemHelper text="Тап — открыть • свайп влево — кнопка удаления" />
        <SwipeableCardsListItemCheckAction onPress={() => onToggleDone(reminder.id)} />
      </SwipeableCardsListItemFooter>
    </SwipeableCardsListItem>
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
      gradientColors={completedGradient}
      onRemove={() => onRemove(item.id)}
    >
      <SwipeableCardsListItemHeader>
        <SwipeableCardsListItemTextBlock>
          <SwipeableCardsListItemTitle text={item.title} />
          <SwipeableCardsListItemSubtitle
            text={`Напоминание • ${item.detail ?? "Выполнено"} • ${formatDateTime(item.completedAt)}`}
          />
        </SwipeableCardsListItemTextBlock>
        <SwipeableCardsListItemBadge
          text="Выполнено"
          icon={item.category ? REMINDER_CATEGORY_ICONS[item.category] : "bell-outline"}
        />
      </SwipeableCardsListItemHeader>
      <SwipeableCardsListItemNote text={item.note} />
      <SwipeableCardsListItemFooter>
        <SwipeableCardsListItemHelper />
      </SwipeableCardsListItemFooter>
    </SwipeableCardsListItem>
  );
}
