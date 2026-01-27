import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { Tabs } from "@dog-care/tabs";
import {
  SwipeableCardsList,
  SwipeableCardsListHeader,
} from "@/src/components";
import { useProfileContext, useVetStorage } from "@/src/hooks";
import { pageGradient, vetStyles } from "./vet.styles";
import type { VetSectionTab } from "./vet.types";
import { SECTION_TAB_ITEMS } from "./vet.constants";
import { VetHeader } from "./vetHeader";
import { VetPassportSection } from "./vetPasportSection";
import { VetRecordsSection } from "./vetRecordsSection";

export default function VetScreen() {
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
  const hasPets = profile.pets.length > 0;
  const isPassportTab = activeSectionTab === "passport";
  const isRecordsTab = activeSectionTab === "records";

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
            </View>
          </SwipeableCardsListHeader>
        </SwipeableCardsList>
      </SafeAreaView>
    </LinearGradient>
  );
}
