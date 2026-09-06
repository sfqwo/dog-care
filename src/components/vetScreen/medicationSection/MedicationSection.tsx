import { useMemo } from "react";
import { Text, View } from "react-native";
import {
  getMedicationCourseStatus,
  sortMedicationCourses,
} from "@dog-care/domain";
import type { MedicationCourse } from "@dog-care/domain";
import {
  formatDateTime,
  formatLocalDate,
  isSameLocalDay,
} from "@dog-care/core/utils";
import { DateInput, Input, TimeInput } from "@/packages/ui/input";
import {
  Hint,
  Modal,
  ModalActionButton,
  ModalActions,
  ModalSubtitle,
  ModalTitle,
  StatsBlock,
  StatsBlocks,
  SwipeableCardsListEmpty,
  SwipeableCardsListItem,
  SwipeableCardsListItemBadge,
  SwipeableCardsListItemCheckAction,
  SwipeableCardsListItemFooter,
  SwipeableCardsListItemHeader,
  SwipeableCardsListItemNote,
  SwipeableCardsListItemSubtitle,
  SwipeableCardsListItemTextBlock,
  SwipeableCardsListItemTitle,
  TimeRecorder,
  TimeRecorderButton,
  TimeRecorderTitle,
} from "@/src/components";
import {
  useCareRecordsContext,
  useMedicationCourseEditor,
  useRemindersStorage,
} from "@/src/hooks";
import type { MedicationCourseForm } from "@/src/hooks/useMedicationCourseEditor";
import { medicationStyles } from "./styles";
import type { MedicationSectionProps } from "./types";
import { useInformer } from "@/src/components/informer";
import { gradients } from "@/src/theme";

const ACTIVE_GRADIENT = gradients.cardWarm;
const PLANNED_GRADIENT = gradients.card;
const COMPLETED_GRADIENT = gradients.cardMuted;

export function MedicationSection({ isActive, hasPets, selectedPetId }: MedicationSectionProps) {
  const { showSuccess } = useInformer();
  const {
    getMedicationCourses,
    addMedicationCourse,
    updateMedicationCourse,
    removeMedicationCourse,
    getCompletedTasks,
    addCompletedTask,
  } = useCareRecordsContext();
  const { reminders, addReminder, removeReminder, completeReminder } = useRemindersStorage(selectedPetId);
  const courses = useMemo(
    () => sortMedicationCourses(getMedicationCourses(selectedPetId)),
    [getMedicationCourses, selectedPetId]
  );
  const completedTasks = getCompletedTasks(selectedPetId);
  const medicationHistory = useMemo(
    () => completedTasks
      .filter((task) => task.sourceRefId?.startsWith("medication:"))
      .sort((first, second) => second.completedAt - first.completedAt)
      .slice(0, 7),
    [completedTasks]
  );
  const editor = useMedicationCourseEditor({
    selectedPetId,
    addCourse: addMedicationCourse,
    updateCourse: updateMedicationCourse,
    removeCourse: removeMedicationCourse,
    addReminder,
    removeReminder,
  });
  const stats = courses.reduce(
    (current, course) => ({
      ...current,
      [getMedicationCourseStatus(course)]: current[getMedicationCourseStatus(course)] + 1,
    }),
    { active: 0, planned: 0, completed: 0 }
  );

  if (!isActive) return null;

  const handleTake = async (course: MedicationCourse) => {
    await completeReminder(course.reminderId, { onCompletedTask: addCompletedTask });
    showSuccess("Приём лекарства отмечен");
  };

  return (
    <View style={medicationStyles.section}>
      <StatsBlocks>
        <StatsBlock label="Активных" value={stats.active} />
        <StatsBlock label="Запланировано" value={stats.planned} />
        <StatsBlock label="Завершено" value={stats.completed} />
      </StatsBlocks>

      <TimeRecorder>
        <TimeRecorderTitle>Новый курс</TimeRecorderTitle>
        <MedicationFields
          form={editor.form}
          disabled={!selectedPetId || editor.isSaving}
          onChange={editor.updateForm}
        />
        <TimeRecorderButton
          label={editor.isSaving ? "Сохранение" : "Добавить курс"}
          onPress={editor.handleSubmit}
          disabled={!editor.canSubmit}
        />
        <Hint visible={!selectedPetId}>
          Добавьте питомца, чтобы назначать лекарства.
        </Hint>
      </TimeRecorder>

      {courses.length === 0 ? (
        <SwipeableCardsListEmpty
          text={hasPets ? "Курсов лечения пока нет." : "Сначала добавьте питомца."}
        />
      ) : null}

      {courses.map((course) => {
        const reminder = reminders.find((item) => item.id === course.reminderId);
        const takenToday = completedTasks.some(
          (task) => task.sourceRefId === course.reminderId && isSameLocalDay(task.completedAt, Date.now())
        );
        const canTake = Boolean(reminder && reminder.dueAt <= Date.now() && !takenToday);
        return (
          <MedicationCourseCard
            key={course.id}
            course={course}
            nextDueAt={reminder?.dueAt}
            takenToday={takenToday}
            canTake={canTake}
            onTake={handleTake}
            onEdit={editor.handleEdit}
            onRemove={editor.handleRemove}
          />
        );
      })}

      {medicationHistory.length ? (
        <View style={medicationStyles.history}>
          <Text style={medicationStyles.historyTitle}>История приёмов</Text>
          {medicationHistory.map((task) => (
            <View key={task.id} style={medicationStyles.historyRow}>
              <Text style={medicationStyles.historyText}>{task.title}</Text>
              <Text style={medicationStyles.historyDate}>{formatDateTime(task.completedAt)}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <Modal visible={Boolean(editor.editingCourse)} onClose={editor.closeEditModal}>
        <ModalTitle>Редактировать курс</ModalTitle>
        <ModalSubtitle>Изменения обновят расписание уведомлений.</ModalSubtitle>
        <MedicationFields
          form={editor.editForm}
          disabled={editor.isSaving}
          onChange={editor.updateEditForm}
        />
        <ModalActions>
          <ModalActionButton closeOnPress>Отменить</ModalActionButton>
          <ModalActionButton onPress={editor.handleSaveEdit} disabled={!editor.canSaveEdit}>
            Сохранить
          </ModalActionButton>
        </ModalActions>
      </Modal>
    </View>
  );
}

function MedicationFields({
  form,
  disabled,
  onChange,
}: {
  form: MedicationCourseForm;
  disabled: boolean;
  onChange: (field: keyof MedicationCourseForm, value: string) => void;
}) {
  return (
    <View style={medicationStyles.formColumn}>
      <Input
        value={form.name}
        onChangeText={(value) => onChange("name", value)}
        placeholder="Название препарата"
        editable={!disabled}
      />
      <Input
        value={form.dosage}
        onChangeText={(value) => onChange("dosage", value)}
        placeholder="Дозировка (например 1/2 таблетки)"
        editable={!disabled}
      />
      <View style={medicationStyles.inlineRow}>
        <View style={medicationStyles.inlineField}>
          <DateInput
            value={form.startDate}
            onChangeText={(value) => onChange("startDate", value)}
            placeholder="Начало"
            editable={!disabled}
          />
        </View>
        <View style={medicationStyles.inlineField}>
          <DateInput
            value={form.endDate}
            onChangeText={(value) => onChange("endDate", value)}
            placeholder="Окончание"
            editable={!disabled}
          />
        </View>
      </View>
      <TimeInput
        value={form.time}
        onChangeText={(value) => onChange("time", value)}
        placeholder="Время приёма"
        editable={!disabled}
      />
      <Input
        value={form.note}
        onChangeText={(value) => onChange("note", value)}
        placeholder="Комментарий (опционально)"
        multiline
        editable={!disabled}
      />
    </View>
  );
}

function MedicationCourseCard({
  course,
  nextDueAt,
  takenToday,
  canTake,
  onTake,
  onEdit,
  onRemove,
}: {
  course: MedicationCourse;
  nextDueAt?: number;
  takenToday: boolean;
  canTake: boolean;
  onTake: (course: MedicationCourse) => void;
  onEdit: (course: MedicationCourse) => void;
  onRemove: (course: MedicationCourse) => void;
}) {
  const status = getMedicationCourseStatus(course);
  const statusLabel = status === "active" ? "Активен" : status === "planned" ? "Запланирован" : "Завершён";
  const gradient = status === "active" ? ACTIVE_GRADIENT : status === "planned" ? PLANNED_GRADIENT : COMPLETED_GRADIENT;
  const helperText = takenToday
    ? "Сегодня принято"
    : nextDueAt
      ? `Следующий приём: ${formatDateTime(nextDueAt)}`
      : "Курс завершён";

  return (
    <SwipeableCardsListItem
      id={course.id}
      gradientColors={gradient}
      onPress={status === "completed" ? undefined : () => onEdit(course)}
      onRemove={() => onRemove(course)}
    >
      <SwipeableCardsListItemHeader>
        <SwipeableCardsListItemTextBlock>
          <SwipeableCardsListItemTitle text={course.name} />
          <SwipeableCardsListItemSubtitle
            text={`${formatLocalDate(course.startAt)} — ${formatLocalDate(course.endAt)} • ${course.time}`}
          />
        </SwipeableCardsListItemTextBlock>
        <SwipeableCardsListItemBadge text={statusLabel} icon="pill" />
      </SwipeableCardsListItemHeader>
      <SwipeableCardsListItemNote
        text={[course.dosage, course.note].filter(Boolean).join(" • ")}
        icon="medical-bag"
      />
      <SwipeableCardsListItemFooter>
        {status !== "completed" ? (
          <SwipeableCardsListItemCheckAction
            label={takenToday ? "Принято" : "Принять"}
            checked={takenToday}
            disabled={!canTake}
            onPress={() => onTake(course)}
          />
        ) : null}
      </SwipeableCardsListItemFooter>
    </SwipeableCardsListItem>
  );
}
