import { useMemo } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { DateInput, Input } from "@/packages/ui/input";
import {
  HeroCard,
  HeroCardBadge,
  HeroCardSubtitle,
  HeroCardTitle,
  CareTrend,
  CareTrendSeries,
  PetTabs,
  Hint,
  Modal,
  ModalActionButton,
  ModalActions,
  ModalSubtitle,
  ModalTitle,
  StatsBlock,
  StatsBlocks,
  SwipeableCardsList,
  SwipeableCardsListEmpty,
  SwipeableCardsListHeader,
  SwipeableCardsListItemBadge,
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
  useProfileContext,
  useCareRecordsContext,
  useWalkCardDetails,
  useWalkEntryEditor,
  useWalkStats,
} from "@/src/hooks";
import { formatDateTime } from "@dog-care/core/utils";
import { pageGradient, walkStyles } from "@/src/screens/tabs/walks/walks.styles";
import type { WalkListItemProps } from "@/src/screens/tabs/walks/walks.types";

export default function WalksScreen() {
  const { profile, selectedPetId } = useProfileContext();
  const { getWalks, addWalk, updateWalk, removeWalk } = useCareRecordsContext();
  const {
    durationMin,
    setDurationMin,
    note,
    setNote,
    date,
    setDate,
    time,
    setTime,
    editingWalk,
    editDurationMin,
    setEditDurationMin,
    editNote,
    setEditNote,
    editDate,
    setEditDate,
    editTime,
    setEditTime,
    canAddWalk,
    canSaveEditedWalk,
    handleAddWalk,
    handleRemoveWalk,
    handleEditWalk,
    handleSaveEditedWalk,
    closeEditWalkModal,
  } = useWalkEntryEditor({
    selectedPetId,
    addWalk,
    updateWalk,
    removeWalk,
  });
  const hasPets = profile.pets.length > 0;
  const currentWalks = getWalks(selectedPetId);
  const stats = useWalkStats(currentWalks);
  const trendPoints = useMemo(
    () => currentWalks.map((walk) => ({ at: walk.startedAt, value: walk.durationMin })),
    [currentWalks]
  );

  const lastWalkText = currentWalks[0] ? formatDateTime(currentWalks[0].startedAt) : "Еще нет записей";
  const heroBadgeText = hasPets
    ? currentWalks.length
      ? "Свежий воздух"
      : "Готовы гулять?"
    : "Добавьте питомца";
  const heroBadgeSubtitle = hasPets
    ? currentWalks.length
      ? `Последняя прогулка: ${lastWalkText}`
      : "Добавьте первую прогулку"
    : "Перейдите в профиль и добавьте питомца, чтобы вести прогулки.";
  const emptyStateText = hasPets
    ? "Список пуст — начните с короткой прогулки и сохраните её здесь."
    : "Заведите питомца, чтобы отслеживать прогулки.";

  return (
    <LinearGradient colors={pageGradient} style={walkStyles.screenGradient}>
      <SafeAreaView style={walkStyles.safeArea}>
        <SwipeableCardsList>
          <SwipeableCardsListHeader>
            <View style={{ gap: 18 }}>
              <HeroCard>
                <HeroCardTitle text="План прогулок" />
                <HeroCardSubtitle text={heroBadgeSubtitle} />
                <HeroCardBadge text={heroBadgeText} />
              </HeroCard>

              <PetTabs />

              <StatsBlocks>
                <StatsBlock label="Прогулок" value={currentWalks.length} />
                <StatsBlock label="Минут суммарно" value={stats.totalMinutes} />
                <StatsBlock label="Среднее время" value={`${stats.avgDuration} мин`} />
              </StatsBlocks>

              <CareTrend title="Динамика прогулок">
                <CareTrendSeries
                  points={trendPoints}
                  aggregation="sum"
                  thresholdPercent={20}
                  formatValue={(value) => `${Math.round(value)} мин`}
                />
              </CareTrend>

              <TimeRecorder>
                <TimeRecorderTitle>Записать прогулку</TimeRecorderTitle>
                <TimeRecorderRow>
                  <Input
                    value={durationMin}
                    onChangeText={setDurationMin}
                    placeholder="Минуты (например 25)"
                    keyboardType="number-pad"
                    editable={Boolean(selectedPetId)}
                  />
                  <TimeRecorderButton label="Добавить" onPress={handleAddWalk} disabled={!canAddWalk} />
                </TimeRecorderRow>
                <TimeRecorderRow>
                  <DateInput
                    value={date}
                    onChangeText={setDate}
                    placeholder="Дата"
                    maximumDate={Date.now()}
                    editable={Boolean(selectedPetId)}
                  />
                  <Input
                    value={time}
                    onChangeText={setTime}
                    placeholder="Время"
                    keyboardType="number-pad"
                    editable={Boolean(selectedPetId)}
                  />
                </TimeRecorderRow>
                <Input
                  value={note}
                  onChangeText={setNote}
                  placeholder="Заметка (опционально)"
                  multiline
                  editable={Boolean(selectedPetId)}
                />
                <Hint visible={!selectedPetId}>
                  Добавьте питомца в профиле и выберите его, чтобы вести записи.
                </Hint>
              </TimeRecorder>
            </View>
          </SwipeableCardsListHeader>
          <SwipeableCardsListEmpty text={emptyStateText} />
          {currentWalks.map((item) => (
            <WalkListItem
              key={item.id}
              walk={item}
              onRemove={handleRemoveWalk}
              onEdit={handleEditWalk}
            />
          ))}
        </SwipeableCardsList>
        <WalkEditModal
          visible={Boolean(editingWalk)}
          durationMin={editDurationMin}
          note={editNote}
          date={editDate}
          time={editTime}
          canSave={canSaveEditedWalk}
          onChangeDurationMin={setEditDurationMin}
          onChangeNote={setEditNote}
          onChangeDate={setEditDate}
          onChangeTime={setEditTime}
          onSave={handleSaveEditedWalk}
          onClose={closeEditWalkModal}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

function WalkEditModal({
  visible,
  durationMin,
  note,
  date,
  time,
  canSave,
  onChangeDurationMin,
  onChangeNote,
  onChangeDate,
  onChangeTime,
  onSave,
  onClose,
}: {
  visible: boolean;
  durationMin: string;
  note: string;
  date: string;
  time: string;
  canSave: boolean;
  onChangeDurationMin: (value: string) => void;
  onChangeNote: (value: string) => void;
  onChangeDate: (value: string) => void;
  onChangeTime: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} onClose={onClose}>
      <ModalTitle>Редактировать прогулку</ModalTitle>
      <ModalSubtitle>Обновите дату, длительность и заметку.</ModalSubtitle>
      <Input
        value={durationMin}
        onChangeText={onChangeDurationMin}
        placeholder="Минуты"
        keyboardType="number-pad"
      />
      <DateInput
        value={date}
        onChangeText={onChangeDate}
        placeholder="Дата"
        maximumDate={Date.now()}
      />
      <Input
        value={time}
        onChangeText={onChangeTime}
        placeholder="Время"
        keyboardType="number-pad"
      />
      <Input
        value={note}
        onChangeText={onChangeNote}
        placeholder="Заметка"
        multiline
      />
      <ModalActions>
        <ModalActionButton closeOnPress>Отменить</ModalActionButton>
        <ModalActionButton onPress={onSave} disabled={!canSave}>
          Сохранить
        </ModalActionButton>
      </ModalActions>
    </Modal>
  );
}

function WalkListItem({ walk, onRemove, onEdit }: WalkListItemProps) {
  const { gradientColors, cardSubtitle, cardTitle } = useWalkCardDetails(walk);

  const handleRemove = () => onRemove(walk.id);
  const handleEdit = () => onEdit(walk);

  return (
    <SwipeableCardsListItem
      id={walk.id}
      gradientColors={gradientColors}
      onRemove={handleRemove}
      onLongPress={handleEdit}
    >
      <SwipeableCardsListItemHeader>
        <SwipeableCardsListItemTextBlock>
          <SwipeableCardsListItemTitle text={cardTitle} />
          <SwipeableCardsListItemSubtitle text={cardSubtitle} />
        </SwipeableCardsListItemTextBlock>
        <SwipeableCardsListItemBadge text={`${walk.durationMin} мин`} />
      </SwipeableCardsListItemHeader>
      <SwipeableCardsListItemNote text={walk.note} />
      <SwipeableCardsListItemFooter>
        <SwipeableCardsListItemHelper text="Долгое нажатие — редактировать • свайп влево — кнопка удаления" />
      </SwipeableCardsListItemFooter>
    </SwipeableCardsListItem>
  );
}
