
import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { View, Text, Pressable } from "react-native";

import { Tabs, type TabItem } from "@dog-care/tabs";
import {
  FormStack,
  Hint,
  FormCard,
  FormCardTitle,
  FormCardSubtitle,
} from "@/src/components";
import { Input } from "@/packages/ui/input";
import type {
  AllergyEntry,
  TreatmentEntry,
  VaccineEntry,
  VaccineType,
} from "../vet.types";
import { VACCINE_SECTIONS, TREATMENT_SECTIONS } from "../vet.constants";
import { vetPassportStyles } from "./styles";
import type {
  TreatmentSectionCardProps,
  VetPasportProviderProps,
  VetPassportContextValue,
  VetPassportSectionProps,
} from "./types";

const VetPassportContext = createContext<VetPassportContextValue | null>(null);

export function VetPassportProvider({
  value,
  children,
}: VetPasportProviderProps) {
  return <VetPassportContext.Provider value={value}>{children}</VetPassportContext.Provider>;
}

function useVetPassportForm() {
  const context = useContext(VetPassportContext);
  if (!context) {
    throw new Error("Vet passport form components must be used within VetPassportProvider");
  }
  return context;
}

export function VaccineCard() {
  const { healthInfo, disabled, setVaccineEntries } = useVetPassportForm();
  const sections = VACCINE_SECTIONS;
  const defaultKey = sections[0]?.key ?? "core";
  const [activeTab, setActiveTab] = useState<VaccineType>(defaultKey as VaccineType);

  const tabItems: TabItem[] = useMemo(
    () => sections.map((section) => ({ id: section.key, title: section.title })),
    [sections]
  );

  const activeSection =
    sections.find((section) => section.key === activeTab) ?? sections[0] ?? undefined;

  const entries = activeSection ? healthInfo.vaccines?.[activeSection.key] ?? [] : [];
  const hasEntries = entries.length > 0;

  const handleAddEntry = () => {
    if (!activeSection || disabled) return;
    setVaccineEntries(activeSection.key, [{}, ...entries]);
  };

  const handleEntryFieldChange =
    (index: number, field: keyof VaccineEntry) => (value: string) => {
      if (!activeSection || disabled) return;
      const nextEntries = entries.map((entry, entryIndex) =>
        entryIndex === index ? { ...(entry ?? {}), [field]: value } : entry
      );
      setVaccineEntries(activeSection.key, nextEntries);
    };

  const handleRemoveEntry = (index: number) => {
    if (!activeSection || disabled) return;
    const nextEntries = entries.filter((_, entryIndex) => entryIndex !== index);
    setVaccineEntries(activeSection.key, nextEntries);
  };

  if (!activeSection) return null;

  return (
    <FormCard>
      <FormCardTitle>Данные ветпаспорта</FormCardTitle>
      <View style={vetPassportStyles.tabsContainer}>
        <Tabs
          variant="segmented"
          items={tabItems}
          selectedId={activeTab}
          onSelect={(id) => setActiveTab(id as VaccineType)}
        />
      </View>
      <FormCardSubtitle>{activeSection.description}</FormCardSubtitle>
      <View style={vetPassportStyles.tabsRow}>
        <Text style={vetPassportStyles.entryCountLabel}>
          {hasEntries ? `Записей: ${entries.length}` : "Нет записей"}
        </Text>
        <Pressable
          style={[
            vetPassportStyles.addVaccineButton,
            disabled && vetPassportStyles.addVaccineButtonDisabled,
          ]}
          onPress={handleAddEntry}
          disabled={disabled}
        >
          <Text style={vetPassportStyles.addVaccineButtonText}>Добавить прививку</Text>
        </Pressable>
      </View>
      <View style={vetPassportStyles.vaccineGroup}>
        {hasEntries ? (
          entries.map((entry, index) => (
            <View key={`${activeSection.key}-${index}`} style={vetPassportStyles.listCard}>
              <Input
                type="date"
                value={entry?.date ?? ""}
                onChangeText={handleEntryFieldChange(index, "date")}
                placeholder="Дата вакцинации"
                editable={!disabled}
              />
              <Input
                type="date"
                value={entry?.validUntil ?? ""}
                onChangeText={handleEntryFieldChange(index, "validUntil")}
                placeholder="Действительна до"
                editable={!disabled}
              />
              <Input
                value={entry?.vaccineName ?? ""}
                onChangeText={handleEntryFieldChange(index, "vaccineName")}
                placeholder="Название вакцины"
                editable={!disabled}
              />
              <Input
                value={entry?.manufacturer ?? ""}
                onChangeText={handleEntryFieldChange(index, "manufacturer")}
                placeholder="Производитель"
                editable={!disabled}
              />
              <Input
                value={entry?.batchNumber ?? ""}
                onChangeText={handleEntryFieldChange(index, "batchNumber")}
                placeholder="Серия / номер партии"
                editable={!disabled}
              />
              <Input
                value={entry?.clinic ?? ""}
                onChangeText={handleEntryFieldChange(index, "clinic")}
                placeholder={activeSection.clinicPlaceholder}
                editable={!disabled}
              />
              <Input
                value={entry?.reactionNotes ?? ""}
                onChangeText={handleEntryFieldChange(index, "reactionNotes")}
                placeholder="Комментарий / реакция"
                multiline
                editable={!disabled}
              />
              <Pressable
                style={vetPassportStyles.removeButton}
                onPress={() => handleRemoveEntry(index)}
                disabled={disabled}
              >
                <Text style={vetPassportStyles.removeButtonText}>Удалить</Text>
              </Pressable>
            </View>
          ))
        ) : (
          <Text style={vetPassportStyles.emptyNote}>
            Нет записей — нажмите «Добавить запись», чтобы сохранить вакцинацию.
          </Text>
        )}
      </View>
    </FormCard>
  );
}

export function GeneralNotesCard() {
  const { healthInfo, disabled, setHealthNoteField } = useVetPassportForm();
  return (
    <FormCard>
      <FormCardTitle>Общие заметки</FormCardTitle>
      <FormCardSubtitle>Добавьте рекомендации ветеринара или наблюдения</FormCardSubtitle>
      <Input
        value={healthInfo.healthNotes ?? ""}
        onChangeText={(text) => setHealthNoteField("healthNotes", text)}
        placeholder="Например: контроль веса, анализы, режим"
        multiline
        editable={!disabled}
      />
    </FormCard>
  );
}

export function OptionalVaccinesCard() {
  const { healthInfo, disabled, setOptionalVaccines } = useVetPassportForm();
  const entries = healthInfo.optionalVaccines ?? [];
  const handleAdd = () => {
    if (disabled) return;
    setOptionalVaccines([{}, ...(entries ?? [])]);
  };

  const handleChangeField =
    (index: number, field: keyof VaccineEntry) => (value: string) => {
      if (disabled) return;
      const nextList = [...(entries ?? [])];
      nextList[index] = { ...(nextList[index] ?? {}), [field]: value };
      setOptionalVaccines(nextList);
    };

  const handleRemove = (index: number) => {
    if (disabled) return;
    setOptionalVaccines(entries.filter((_, i) => i !== index));
  };

  const isExistEntries = entries.length;
  const descriptionText = !isExistEntries ?
    'Пока нет записей — добавьте первую вакцину.'
    : `Сделано вакцинаций: ${entries.length}`;

  return (
    <FormCard>
      <FormCardTitle>Дополнительные вакцины</FormCardTitle>
      <View style={vetPassportStyles.addButtonContainer}>
        <Text style={vetPassportStyles.emptyNote}>
          {descriptionText}
        </Text>
        <Pressable style={vetPassportStyles.addButton} onPress={handleAdd} disabled={disabled}>
          <Text style={vetPassportStyles.addButtonText}>Добавить</Text>
        </Pressable>
      </View>
      {isExistEntries ? (
        entries.map((entry, index) => (
          <View key={`optional-${index}`} style={vetPassportStyles.listCard}>
            <Input
              value={entry?.vaccineName ?? ""}
              onChangeText={handleChangeField(index, "vaccineName")}
              placeholder="Название вакцины"
              editable={!disabled}
            />
            <Input
              value={entry?.manufacturer ?? ""}
              onChangeText={handleChangeField(index, "manufacturer")}
              placeholder="Производитель"
              editable={!disabled}
            />
            <Input
              value={entry?.batchNumber ?? ""}
              onChangeText={handleChangeField(index, "batchNumber")}
              placeholder="Серия / партия"
              editable={!disabled}
            />
            <Input
              type="date"
              value={entry?.date ?? ""}
              onChangeText={handleChangeField(index, "date")}
              placeholder="Дата вакцинации"
              editable={!disabled}
            />
            <Input
              type="date"
              value={entry?.validUntil ?? ""}
              onChangeText={handleChangeField(index, "validUntil")}
              placeholder="Действительна до"
              editable={!disabled}
            />
            <Input
              value={entry?.clinic ?? ""}
              onChangeText={handleChangeField(index, "clinic")}
              placeholder="Клиника"
              editable={!disabled}
            />
            <Input
              value={entry?.reactionNotes ?? ""}
              onChangeText={handleChangeField(index, "reactionNotes")}
              placeholder="Комментарий / реакция"
              multiline
              editable={!disabled}
            />
            <Pressable
              style={vetPassportStyles.removeButton}
              onPress={() => handleRemove(index)}
              disabled={disabled}
            >
              <Text style={vetPassportStyles.removeButtonText}>Удалить</Text>
            </Pressable>
          </View>
        ))
      ) : null}
    </FormCard>
  );
}

export function TreatmentSectionCard({ section }: TreatmentSectionCardProps) {
  const { healthInfo, disabled, setTreatmentEntries } = useVetPassportForm();
  const entries =
    section.key === "deworming"
      ? healthInfo.deworming ?? []
      : healthInfo.ectoparasites ?? [];
  const handleAdd = () => {
    if (disabled) return;
    setTreatmentEntries(section.key, [{}, ...(entries ?? [])]);
  };

  const handleFieldChange =
    (index: number, field: keyof TreatmentEntry) => (value: string) => {
      if (disabled) return;
      const list = [...(entries ?? [])];
      list[index] = { ...(list[index] ?? {}), [field]: value };
      setTreatmentEntries(section.key, list);
    };

  const handleRemove = (index: number) => {
    if (disabled) return;
    setTreatmentEntries(section.key, entries.filter((_, i) => i !== index));
  };

  const isExistEntries = entries.length;
  const descriptionText = !isExistEntries ?
    'Нет записей — нажмите «Добавить», чтобы сохранить обработку.'
    : `Сделано обработок: ${entries.length}`;

  return (
    <FormCard>
      <FormCardTitle>{section.title}</FormCardTitle>
      <FormCardSubtitle>{section.description}</FormCardSubtitle>
      <View style={vetPassportStyles.addButtonContainer}>
        <Text style={vetPassportStyles.emptyNote}>
          {descriptionText}
        </Text>
        <Pressable style={vetPassportStyles.addButton} onPress={handleAdd} disabled={disabled}>
          <Text style={vetPassportStyles.addButtonText}>Добавить</Text>
        </Pressable>
      </View>
      {isExistEntries ? (
        entries.map((entry, index) => (
          <View key={`${section.key}-${index}`} style={vetPassportStyles.listCard}>
            <Input
              type="date"
              value={entry?.date ?? ""}
              onChangeText={handleFieldChange(index, "date")}
              placeholder="Дата"
              editable={!disabled}
            />
            <Input
              value={entry?.product ?? ""}
              onChangeText={handleFieldChange(index, "product")}
              placeholder={section.productPlaceholder}
              editable={!disabled}
            />
            <Input
              value={entry?.dose ?? ""}
              onChangeText={handleFieldChange(index, "dose")}
              placeholder={section.dosePlaceholder}
              editable={!disabled}
            />
            <Input
              value={entry?.notes ?? ""}
              onChangeText={handleFieldChange(index, "notes")}
              placeholder="Примечания / реакция"
              multiline
              editable={!disabled}
            />
            <Pressable
              style={vetPassportStyles.removeButton}
              onPress={() => handleRemove(index)}
              disabled={disabled}
            >
              <Text style={vetPassportStyles.removeButtonText}>Удалить</Text>
            </Pressable>
          </View>
        ))
      ) : null}
    </FormCard>
  );
}

export function AllergyCard() {
  const { healthInfo, disabled, setAllergyEntries } = useVetPassportForm();
  const entries = healthInfo.allergyEntries ?? [];
  const handleAdd = () => {
    if (disabled) return;
    setAllergyEntries([{}, ...(entries ?? [])]);
  };

  const handleFieldChange =
    (index: number, field: keyof AllergyEntry) => (value: string) => {
      if (disabled) return;
      const next = [...(entries ?? [])];
      next[index] = { ...(next[index] ?? {}), [field]: value };
      setAllergyEntries(next);
    };

  const handleRemove = (index: number) => {
    if (disabled) return;
    setAllergyEntries(entries.filter((_, i) => i !== index));
  };

  const isExistEntries = entries.length;
  const descriptionText = !isExistEntries ?
    'Нет записей — добавьте первую аллергию и реакцию.'
    : `Всего записей: ${entries.length}`;

  return (
    <FormCard>
      <FormCardTitle>Аллергии</FormCardTitle>
      <FormCardSubtitle>
        Добавьте триггер, реакцию и рекомендации
      </FormCardSubtitle>
      <View style={vetPassportStyles.addButtonContainer}>
        <Text style={vetPassportStyles.emptyNote}>
          {descriptionText}
        </Text>
        <Pressable style={vetPassportStyles.addButton} onPress={handleAdd} disabled={disabled}>
          <Text style={vetPassportStyles.addButtonText}>Добавить</Text>
        </Pressable>
      </View>
      {isExistEntries ? (
        entries.map((entry, index) => (
          <View key={`allergy-${index}`} style={vetPassportStyles.listCard}>
            <Input
              value={entry?.trigger ?? ""}
              onChangeText={handleFieldChange(index, "trigger")}
              placeholder="Триггер (препарат, продукт, укус)"
              editable={!disabled}
            />
            <Input
              value={entry?.reaction ?? ""}
              onChangeText={handleFieldChange(index, "reaction")}
              placeholder="Реакция (например: отек, зуд)"
              multiline
              editable={!disabled}
            />
            <Input
              value={entry?.notes ?? ""}
              onChangeText={handleFieldChange(index, "notes")}
              placeholder="Рекомендации / действия"
              multiline
              editable={!disabled}
            />
            <Pressable
              style={vetPassportStyles.removeButton}
              onPress={() => handleRemove(index)}
              disabled={disabled}
            >
              <Text style={vetPassportStyles.removeButtonText}>Удалить</Text>
            </Pressable>
          </View>
        ))
      ) : null}
    </FormCard>
  );
}

export function ContraindicationsCard() {
  const { healthInfo, disabled, setHealthNoteField } = useVetPassportForm();
  return (
    <FormCard>
      <FormCardTitle>Противопоказания</FormCardTitle>
      <FormCardSubtitle>
        Фиксируйте процедуры или препараты с ограничениями
      </FormCardSubtitle>
      <Input
        value={healthInfo.contraindicationNotes ?? ""}
        onChangeText={(text) => setHealthNoteField("contraindicationNotes", text)}
        placeholder="Например: избегать наркоза, ограничить нагрузки"
        multiline
        editable={!disabled}
      />
    </FormCard>
  );
}

export function VetPassportSection({
  isActive,
  healthInfo,
  selectedPetId,
  onVaccineEntriesChange,
  onOptionalVaccinesChange,
  onTreatmentChange,
  onAllergyChange,
  onHealthNoteChange,
}: VetPassportSectionProps) {
  const contextValue = useMemo(
    () => ({
      healthInfo,
      disabled: !selectedPetId,
      setVaccineEntries: onVaccineEntriesChange,
      setOptionalVaccines: onOptionalVaccinesChange,
      setTreatmentEntries: onTreatmentChange,
      setAllergyEntries: onAllergyChange,
      setHealthNoteField: onHealthNoteChange,
    }),
    [
      healthInfo,
      onAllergyChange,
      onHealthNoteChange,
      onOptionalVaccinesChange,
      onTreatmentChange,
      onVaccineEntriesChange,
      selectedPetId,
    ]
  );

  if (!isActive) return null;

  return (
    <VetPassportProvider value={contextValue}>
      <View style={vetPassportStyles.section}>
        <FormStack>
          <VaccineCard />
          <GeneralNotesCard />
          <OptionalVaccinesCard />
          {TREATMENT_SECTIONS.map((section) => (
            <TreatmentSectionCard key={section.key} section={section} />
          ))}
          <AllergyCard />
          <ContraindicationsCard />
        </FormStack>

        <Hint visible={!selectedPetId}>Добавьте питомца, чтобы сохранять данные о здоровье.</Hint>
      </View>
    </VetPassportProvider>
  );
}
