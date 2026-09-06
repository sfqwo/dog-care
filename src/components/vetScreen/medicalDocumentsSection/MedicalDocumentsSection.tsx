import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Select, SelectOption, SelectOptionTitle } from "@dog-care/select";
import { sortMedicalDocuments } from "@dog-care/domain";
import type { MedicalDocument, MedicalDocumentType, VetRecord } from "@dog-care/domain";
import { formatLocalDate, getOptionTitle } from "@dog-care/core/utils";
import { DateInput, Input } from "@/packages/ui/input";
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
  SwipeableCardsListItemFooter,
  SwipeableCardsListItemHeader,
  SwipeableCardsListItemHelper,
  SwipeableCardsListItemNote,
  SwipeableCardsListItemSubtitle,
  SwipeableCardsListItemTextBlock,
  SwipeableCardsListItemTitle,
  TimeRecorder,
  TimeRecorderButton,
  TimeRecorderTitle,
} from "@/src/components";
import { useCareRecordsContext, useMedicalDocumentEditor } from "@/src/hooks";
import type { MedicalDocumentForm } from "@/src/hooks/useMedicalDocumentEditor";
import { documentStyles } from "./styles";
import type { MedicalDocumentsSectionProps } from "./types";
import { gradients } from "@/src/theme";

const DOCUMENT_GRADIENT = gradients.card;
const DOCUMENT_TYPE_OPTIONS: { value: MedicalDocumentType; title: string }[] = [
  { value: "analysis", title: "Анализы" },
  { value: "prescription", title: "Рецепт" },
  { value: "conclusion", title: "Заключение" },
  { value: "passport", title: "Ветпаспорт" },
  { value: "other", title: "Другое" },
];

export function MedicalDocumentsSection({
  isActive,
  hasPets,
  selectedPetId,
}: MedicalDocumentsSectionProps) {
  const {
    getMedicalDocuments,
    addMedicalDocument,
    updateMedicalDocument,
    removeMedicalDocument,
    getVetRecords,
  } = useCareRecordsContext();
  const documents = useMemo(
    () => sortMedicalDocuments(getMedicalDocuments(selectedPetId)),
    [getMedicalDocuments, selectedPetId]
  );
  const visits = getVetRecords(selectedPetId);
  const editor = useMedicalDocumentEditor({
    selectedPetId,
    addDocument: addMedicalDocument,
    updateDocument: updateMedicalDocument,
    removeDocument: removeMedicalDocument,
  });
  const [previewDocument, setPreviewDocument] = useState<MedicalDocument | null>(null);
  const linkedCount = documents.filter((document) => document.visitId).length;
  const photoCount = documents.reduce((total, document) => total + document.imageUris.length, 0);

  if (!isActive) return null;

  return (
    <View style={documentStyles.section}>
      <StatsBlocks>
        <StatsBlock label="Документов" value={documents.length} />
        <StatsBlock label="Фото" value={photoCount} />
        <StatsBlock label="С визитом" value={linkedCount} />
      </StatsBlocks>

      <TimeRecorder>
        <TimeRecorderTitle>Добавить документ</TimeRecorderTitle>
        <MedicalDocumentFields
          form={editor.form}
          visits={visits}
          disabled={!selectedPetId || editor.isSaving}
          onChange={editor.updateForm}
          onPickImages={() => editor.pickImages(false)}
          onRemoveImage={(uri) => editor.removeImage(uri, false)}
        />
        <TimeRecorderButton
          label={editor.isSaving ? "Сохранение" : "Сохранить документ"}
          onPress={editor.handleSubmit}
          disabled={!editor.canSubmit}
        />
        <Hint visible={!selectedPetId}>
          Добавьте питомца, чтобы хранить медицинские документы.
        </Hint>
      </TimeRecorder>

      {documents.length === 0 ? (
        <SwipeableCardsListEmpty
          text={hasPets ? "Медицинских документов пока нет." : "Сначала добавьте питомца."}
        />
      ) : null}

      {documents.map((document) => (
        <MedicalDocumentCard
          key={document.id}
          document={document}
          visit={visits.find((record) => record.id === document.visitId)}
          onOpen={setPreviewDocument}
          onEdit={editor.handleEdit}
          onRemove={editor.handleRemove}
        />
      ))}

      <Modal visible={Boolean(editor.editingDocument)} onClose={editor.closeEditModal}>
        <ModalTitle>Редактировать документ</ModalTitle>
        <ModalSubtitle>Обновите фото, описание или связь с визитом.</ModalSubtitle>
        <MedicalDocumentFields
          form={editor.editForm}
          visits={visits}
          disabled={editor.isSaving}
          onChange={editor.updateEditForm}
          onPickImages={() => editor.pickImages(true)}
          onRemoveImage={(uri) => editor.removeImage(uri, true)}
        />
        <ModalActions>
          <ModalActionButton closeOnPress>Отменить</ModalActionButton>
          <ModalActionButton onPress={editor.handleSaveEdit} disabled={!editor.canSaveEdit}>
            Сохранить
          </ModalActionButton>
        </ModalActions>
      </Modal>

      <DocumentPreviewModal
        document={previewDocument}
        visit={visits.find((record) => record.id === previewDocument?.visitId)}
        onClose={() => setPreviewDocument(null)}
        onEdit={(document) => {
          setPreviewDocument(null);
          editor.handleEdit(document);
        }}
      />
    </View>
  );
}

function MedicalDocumentFields({
  form,
  visits,
  disabled,
  onChange,
  onPickImages,
  onRemoveImage,
}: {
  form: MedicalDocumentForm;
  visits: VetRecord[];
  disabled: boolean;
  onChange: <K extends keyof MedicalDocumentForm>(field: K, value: MedicalDocumentForm[K]) => void;
  onPickImages: () => void;
  onRemoveImage: (uri: string) => void;
}) {
  return (
    <View style={documentStyles.formColumn}>
      <View style={documentStyles.inlineRow}>
        <View style={documentStyles.inlineField}>
          <Select
            value={form.type}
            onChange={(value) => onChange("type", value as MedicalDocumentType)}
            placeholder="Тип документа"
            disabled={disabled}
          >
            {DOCUMENT_TYPE_OPTIONS.map((option) => (
              <SelectOption key={option.value} value={option.value}>
                <SelectOptionTitle text={option.title} />
              </SelectOption>
            ))}
          </Select>
        </View>
        <View style={documentStyles.inlineField}>
          <DateInput
            value={form.date}
            onChangeText={(value) => onChange("date", value)}
            placeholder="Дата"
            maximumDate={Date.now()}
            editable={!disabled}
          />
        </View>
      </View>
      <Input
        value={form.title}
        onChangeText={(value) => onChange("title", value)}
        placeholder="Название (опционально)"
        editable={!disabled}
      />
      <Select
        value={form.visitId}
        onChange={(value) => onChange("visitId", value)}
        placeholder="Связать с визитом"
        disabled={disabled}
      >
        <SelectOption value="">
          <SelectOptionTitle text="Без привязки к визиту" />
        </SelectOption>
        {visits.map((visit) => (
          <SelectOption key={visit.id} value={visit.id}>
            <SelectOptionTitle text={`${visit.title} • ${visit.date}`} />
          </SelectOption>
        ))}
      </Select>
      <Input
        value={form.note}
        onChangeText={(value) => onChange("note", value)}
        placeholder="Комментарий (опционально)"
        multiline
        editable={!disabled}
      />
      <Pressable
        style={[
          documentStyles.pickerButton,
          (disabled || form.imageUris.length >= 5) && documentStyles.pickerButtonDisabled,
        ]}
        onPress={onPickImages}
        disabled={disabled || form.imageUris.length >= 5}
      >
        <MaterialCommunityIcons name="image-plus" size={20} style={documentStyles.pickerIcon} />
        <Text style={documentStyles.pickerButtonText}>
          {form.imageUris.length ? `Добавить фото (${form.imageUris.length}/5)` : "Выбрать фото"}
        </Text>
      </Pressable>
      <PhotoThumbnails imageUris={form.imageUris} onRemove={onRemoveImage} />
    </View>
  );
}

function PhotoThumbnails({ imageUris, onRemove }: { imageUris: string[]; onRemove: (uri: string) => void }) {
  if (!imageUris.length) return null;
  return (
    <ScrollView horizontal contentContainerStyle={documentStyles.thumbnails} showsHorizontalScrollIndicator={false}>
      {imageUris.map((uri) => (
        <View key={uri} style={documentStyles.thumbnailWrapper}>
          <Image source={{ uri }} style={documentStyles.thumbnail} resizeMode="cover" />
          <Pressable style={documentStyles.removePhoto} onPress={() => onRemove(uri)}>
            <MaterialCommunityIcons name="close" size={16} style={documentStyles.removePhotoIcon} />
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

function MedicalDocumentCard({
  document,
  visit,
  onOpen,
  onEdit,
  onRemove,
}: {
  document: MedicalDocument;
  visit?: VetRecord;
  onOpen: (document: MedicalDocument) => void;
  onEdit: (document: MedicalDocument) => void;
  onRemove: (document: MedicalDocument) => void;
}) {
  const typeTitle = getOptionTitle(DOCUMENT_TYPE_OPTIONS, document.type, "Документ");
  return (
    <SwipeableCardsListItem
      id={document.id}
      gradientColors={DOCUMENT_GRADIENT}
      onPress={() => onOpen(document)}
      onLongPress={() => onEdit(document)}
      onRemove={() => onRemove(document)}
    >
      <SwipeableCardsListItemHeader>
        <SwipeableCardsListItemTextBlock>
          <SwipeableCardsListItemTitle text={document.title || typeTitle} />
          <SwipeableCardsListItemSubtitle
            text={`${typeTitle} • ${formatLocalDate(document.at)}${visit ? ` • ${visit.title}` : ""}`}
          />
        </SwipeableCardsListItemTextBlock>
        <SwipeableCardsListItemBadge text={`${document.imageUris.length} фото`} icon="file-image-outline" />
      </SwipeableCardsListItemHeader>
      <Image source={{ uri: document.imageUris[0] }} style={documentStyles.cardImage} resizeMode="cover" />
      <SwipeableCardsListItemNote text={document.note} icon="text-box-outline" />
      <SwipeableCardsListItemFooter>
        <SwipeableCardsListItemHelper text="Тап — открыть • долгое нажатие — редактировать" />
      </SwipeableCardsListItemFooter>
    </SwipeableCardsListItem>
  );
}

function DocumentPreviewModal({
  document,
  visit,
  onClose,
  onEdit,
}: {
  document: MedicalDocument | null;
  visit?: VetRecord;
  onClose: () => void;
  onEdit: (document: MedicalDocument) => void;
}) {
  const [selectedUri, setSelectedUri] = useState<string | null>(null);
  const activeUri = selectedUri && document?.imageUris.includes(selectedUri)
    ? selectedUri
    : document?.imageUris[0];

  return (
    <Modal visible={Boolean(document)} onClose={onClose}>
      <ModalTitle>
        {document?.title || getOptionTitle(DOCUMENT_TYPE_OPTIONS, document?.type, "Документ")}
      </ModalTitle>
      <ModalSubtitle>
        {[document ? formatLocalDate(document.at) : undefined, visit?.title].filter(Boolean).join(" • ")}
      </ModalSubtitle>
      {activeUri ? <Image source={{ uri: activeUri }} style={documentStyles.previewImage} resizeMode="contain" /> : null}
      {document && document.imageUris.length > 1 ? (
        <ScrollView horizontal contentContainerStyle={documentStyles.previewThumbnails} showsHorizontalScrollIndicator={false}>
          {document.imageUris.map((uri) => (
            <Pressable key={uri} onPress={() => setSelectedUri(uri)}>
              <Image
                source={{ uri }}
                style={[documentStyles.previewThumbnail, uri === activeUri && documentStyles.previewThumbnailActive]}
              />
            </Pressable>
          ))}
        </ScrollView>
      ) : null}
      {document?.note ? <ModalSubtitle>{document.note}</ModalSubtitle> : null}
      <ModalActions>
        <ModalActionButton closeOnPress>Закрыть</ModalActionButton>
        {document ? (
          <ModalActionButton onPress={() => onEdit(document)}>Редактировать</ModalActionButton>
        ) : null}
      </ModalActions>
    </Modal>
  );
}
