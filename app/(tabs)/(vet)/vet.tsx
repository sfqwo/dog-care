import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";

import { Tabs } from "@dog-care/tabs";
import {
  SwipeableCardsList,
  SwipeableCardsListHeader,
} from "@/src/components";
import { MedicalDocumentsSection } from "@/src/components/vetScreen/medicalDocumentsSection";
import { MedicationSection } from "@/src/components/vetScreen/medicationSection";
import { SECTION_TAB_ITEMS } from "@/src/components/vetScreen/vet.constants";
import { VetHeader } from "@/src/components/vetScreen/vetHeader";
import { VetPassportSection } from "@/src/components/vetScreen/vetPasportSection";
import { VetRecordsSection } from "@/src/components/vetScreen/vetRecordsSection";
import { pageGradient, vetStyles } from "@/src/components/vetScreen/vet.styles";
import type { VetSectionTab } from "@/src/components/vetScreen/vet.types";
import { WeightSection } from "@/src/components/vetScreen/weightSection";
import { WellnessSection } from "@/src/components/vetScreen/wellnessSection";
import { useCareRecordsContext, useProfileContext, useVetStorage } from "@/src/hooks";

export default function VetScreen() {
  const { section } = useLocalSearchParams<{ section?: string }>();
  const { profile, selectedPetId } = useProfileContext();
  const [activeSectionTab, setActiveSectionTab] = useState<VetSectionTab>("passport");
  const {
    records,
    healthInfo,
    addRecord,
    removeRecord,
    setVaccineEntries,
    setOptionalVaccines,
    setTreatmentEntries,
    setAllergyEntries,
    setHealthNoteField,
  } = useVetStorage(selectedPetId);
  const {
    getWeightEntries,
    addWeightEntry,
    updateWeightEntry,
    removeWeightEntry,
  } = useCareRecordsContext();
  const hasPets = profile.pets.length > 0;
  const isPassportTab = activeSectionTab === "passport";
  const isRecordsTab = activeSectionTab === "records";
  const isWeightTab = activeSectionTab === "weight";
  const isMedicationTab = activeSectionTab === "medications";
  const isWellnessTab = activeSectionTab === "wellness";
  const isDocumentsTab = activeSectionTab === "documents";
  const weightEntries = getWeightEntries(selectedPetId);

  useEffect(() => {
    if (section === "medications") setActiveSectionTab("medications");
  }, [section]);

  return (
    <LinearGradient colors={pageGradient} style={vetStyles.screenGradient}>
      <SafeAreaView style={vetStyles.safeArea}>
        <SwipeableCardsList>
          <SwipeableCardsListHeader>
            <VetHeader records={records} hasPets={hasPets} healthInfo={healthInfo} />

            <View style={vetStyles.sectionTabsBlock}>
              <Tabs
                items={SECTION_TAB_ITEMS}
                selectedId={activeSectionTab}
                onSelect={(id) => setActiveSectionTab(id as VetSectionTab)}
              />

              <VetPassportSection
                isActive={isPassportTab}
                healthInfo={healthInfo}
                selectedPetId={selectedPetId}
                onVaccineEntriesChange={setVaccineEntries}
                onOptionalVaccinesChange={setOptionalVaccines}
                onTreatmentChange={setTreatmentEntries}
                onAllergyChange={setAllergyEntries}
                onHealthNoteChange={setHealthNoteField}
              />

              <VetRecordsSection
                isActive={isRecordsTab}
                hasPets={hasPets}
                records={records}
                selectedPetId={selectedPetId}
                onAddRecord={addRecord}
                onRemoveRecord={removeRecord}
              />

              <WeightSection
                isActive={isWeightTab}
                hasPets={hasPets}
                entries={weightEntries}
                selectedPetId={selectedPetId}
                onAddEntry={addWeightEntry}
                onUpdateEntry={updateWeightEntry}
                onRemoveEntry={removeWeightEntry}
              />

              <MedicationSection
                isActive={isMedicationTab}
                hasPets={hasPets}
                selectedPetId={selectedPetId}
              />

              <WellnessSection
                isActive={isWellnessTab}
                hasPets={hasPets}
                selectedPetId={selectedPetId}
              />

              <MedicalDocumentsSection
                isActive={isDocumentsTab}
                hasPets={hasPets}
                selectedPetId={selectedPetId}
              />
            </View>
          </SwipeableCardsListHeader>
        </SwipeableCardsList>
      </SafeAreaView>
    </LinearGradient>
  );
}
