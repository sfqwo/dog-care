import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { Input } from "@/packages/ui/input";
import {
  HeroCard,
  HeroCardBadge,
  HeroCardSubtitle,
  HeroCardTitle,
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
import { pageGradient, walkStyles } from "./walks.styles";
import type { WalkListItemProps } from "./walks.types";

export default function WalksScreen() {
  const { profile, selectedPetId } = useProfileContext();
  const { getWalks, addWalk, updateWalk, removeWalk } = useCareRecordsContext();
  const {
    durationMin,
    setDurationMin,
    note,
    setNote,
    editingWalk,
    editDurationMin,
    setEditDurationMin,
    editNote,
    setEditNote,
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
          canSave={canSaveEditedWalk}
          onChangeDurationMin={setEditDurationMin}
          onChangeNote={setEditNote}
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
  canSave,
  onChangeDurationMin,
  onChangeNote,
  onSave,
  onClose,
}: {
  visible: boolean;
  durationMin: string;
  note: string;
  canSave: boolean;
  onChangeDurationMin: (value: string) => void;
  onChangeNote: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} onClose={onClose}>
      <ModalTitle>Редактировать прогулку</ModalTitle>
      <ModalSubtitle>Обновите длительность и заметку.</ModalSubtitle>
      <Input
        value={durationMin}
        onChangeText={onChangeDurationMin}
        placeholder="Минуты"
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
