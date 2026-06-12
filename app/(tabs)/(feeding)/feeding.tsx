import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { formatDateTime } from "@dog-care/core/utils";
import {
  useFeedingCardDetails,
  useFeedingEntryEditor,
  useFeedingStats,
  useCareRecordsContext,
  useProfileContext,
} from "@/src/hooks";
import { Input } from "@/packages/ui/input";
import {
  HeroCard,
  HeroCardBadge,
  HeroCardSubtitle,
  HeroCardTitle,
  PetTabs,
  StatsBlock,
  StatsBlocks,
  Hint,
  Modal,
  ModalActionButton,
  ModalActions,
  ModalSubtitle,
  ModalTitle,
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
import { feedingStyles, pageGradient } from "./feeding.styles";
import type { FeedingListItemProps } from "./feeding.types";

export default function FeedingScreen() {
  const { profile, selectedPetId } = useProfileContext();
  const { getFeedings, addFeeding, updateFeeding, removeFeeding } = useCareRecordsContext();
  const {
    grams,
    setGrams,
    food,
    setFood,
    editingFeeding,
    editGrams,
    setEditGrams,
    editFood,
    setEditFood,
    canAddFeeding,
    canSaveEditedFeeding,
    handleSubmitFeeding,
    handleRemoveFeeding,
    handleEditFeeding,
    handleSaveEditedFeeding,
    closeEditFeedingModal,
  } = useFeedingEntryEditor({
    selectedPetId,
    addFeeding,
    updateFeeding,
    removeFeeding,
  });
  const hasPets = profile.pets.length > 0;
  const items = getFeedings(selectedPetId);
  const stats = useFeedingStats(items);

  const lastMealText = items[0] ? formatDateTime(items[0].at) : "Еще нет записей";
  const heroBadgeText = hasPets
    ? items.length
      ? "Сытый питомец"
      : "Пора покормить любимца"
    : "Добавьте питомца";
  const heroSubtitle = hasPets
    ? items.length
      ? `Последнее кормление: ${lastMealText}`
      : "Добавьте первую запись"
    : "Перейдите в профиль и заведите питомца.";
  const emptyStateText = hasPets
    ? "Журнал пуст — добавьте первую миску."
    : "Чтобы вести журнал, добавьте питомца.";

  return (
    <LinearGradient colors={pageGradient} style={feedingStyles.screenGradient}>
      <SafeAreaView style={feedingStyles.safeArea}>
        <SwipeableCardsList>
          <SwipeableCardsListHeader>
            <View style={{ gap: 18 }}>
              <HeroCard>
                <HeroCardTitle text="План кормлений" />
                <HeroCardSubtitle text={heroSubtitle} />
                <HeroCardBadge text={heroBadgeText} />
              </HeroCard>

              <PetTabs />

              <StatsBlocks>
                <StatsBlock label="Приемов" value={items.length} />
                <StatsBlock label="Суммарно" value={`${stats.totalGrams} г`} />
                <StatsBlock label="Среднее" value={`${stats.avgGrams} г`} />
              </StatsBlocks>

              <TimeRecorder>
                <TimeRecorderTitle>Записать кормление</TimeRecorderTitle>
                <TimeRecorderRow>
                  <Input
                    value={grams}
                    onChangeText={setGrams}
                    placeholder="Граммы (например 120)"
                    keyboardType="number-pad"
                    editable={Boolean(selectedPetId)}
                  />
                  <TimeRecorderButton
                    label="Добавить"
                    onPress={handleSubmitFeeding}
                    disabled={!canAddFeeding}
                  />
                </TimeRecorderRow>
                <Input
                  value={food}
                  onChangeText={setFood}
                  placeholder="Корм или вкусняшка (опционально)"
                  editable={Boolean(selectedPetId)}
                />
                <Hint visible={!selectedPetId}>
                  Добавьте питомца в профиле, чтобы вести записи кормления.
                </Hint>
              </TimeRecorder>
            </View>
          </SwipeableCardsListHeader>
          <SwipeableCardsListEmpty text={emptyStateText} />

          {items.map((item) => (
            <FeedingListItem
              key={item.id}
              feeding={item}
              onRemove={handleRemoveFeeding}
              onEdit={handleEditFeeding}
            />
          ))}
        </SwipeableCardsList>
        <FeedingEditModal
          visible={Boolean(editingFeeding)}
          grams={editGrams}
          food={editFood}
          canSave={canSaveEditedFeeding}
          onChangeGrams={setEditGrams}
          onChangeFood={setEditFood}
          onSave={handleSaveEditedFeeding}
          onClose={closeEditFeedingModal}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

function FeedingEditModal({
  visible,
  grams,
  food,
  canSave,
  onChangeGrams,
  onChangeFood,
  onSave,
  onClose,
}: {
  visible: boolean;
  grams: string;
  food: string;
  canSave: boolean;
  onChangeGrams: (value: string) => void;
  onChangeFood: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} onClose={onClose}>
      <ModalTitle>Редактировать кормление</ModalTitle>
      <ModalSubtitle>Обновите количество и описание корма.</ModalSubtitle>
      <Input
        value={grams}
        onChangeText={onChangeGrams}
        placeholder="Граммы"
        keyboardType="number-pad"
      />
      <Input
        value={food}
        onChangeText={onChangeFood}
        placeholder="Корм или вкусняшка"
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

function FeedingListItem({ feeding, onRemove, onEdit }: FeedingListItemProps) {
  const {
    gradientColors,
    cardSubtitle,
    cardTitle,
    noteText,
  } = useFeedingCardDetails(feeding);

  const handleRemove = () => onRemove(feeding.id);
  const handleEdit = () => onEdit(feeding);

  return (
    <SwipeableCardsListItem
      id={feeding.id}
      gradientColors={gradientColors}
      onRemove={handleRemove}
      onPress={handleEdit}
    >
      <SwipeableCardsListItemHeader>
        <SwipeableCardsListItemTextBlock>
          <SwipeableCardsListItemTitle text={cardTitle} />
          <SwipeableCardsListItemSubtitle text={cardSubtitle} />
        </SwipeableCardsListItemTextBlock>
        <SwipeableCardsListItemBadge text={`${feeding.grams} г`} icon="food-variant" />
      </SwipeableCardsListItemHeader>
      <SwipeableCardsListItemNote text={noteText} icon="silverware-fork-knife" />
      <SwipeableCardsListItemFooter>
        <SwipeableCardsListItemHelper text="Тап — открыть • свайп влево — кнопка удаления" />
      </SwipeableCardsListItemFooter>
    </SwipeableCardsListItem>
  );
}
