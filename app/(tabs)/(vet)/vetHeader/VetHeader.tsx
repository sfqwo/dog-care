import { useMemo } from "react";
import { Text, View } from "react-native";

import { getAllergySummary, getVaccineSummary } from "@dog-care/core/shared";
import {
  HeroCard,
  HeroCardBadge,
  HeroCardSubtitle,
  HeroCardTitle,
  PetTabs,
  StatsBlock,
  StatsBlocks,
} from "@/src/components";
import { useVetStats } from "@/src/hooks";
import { VACCINE_SECTIONS } from "../vet.constants";
import type { VetHeaderProps } from "./types";
import { vetHeaderStyles } from "./styles";

export function VetHeader({ records, hasPets, healthInfo }: VetHeaderProps) {
  const stats = useVetStats(records);

  const vaccineSummaries = useMemo(
    () =>
      VACCINE_SECTIONS.map((section) => ({
        section,
        data: getVaccineSummary(section, records, healthInfo),
      })),
    [records, healthInfo]
  );

  const allergyInfo = useMemo(
    () => getAllergySummary(records, healthInfo),
    [records, healthInfo]
  );

  const heroBadgeText = hasPets
    ? records.length
      ? "Здоровье под контролем"
      : "Запланируйте прием"
    : "Добавьте питомца";
  const heroSubtitle = hasPets
    ? records.length
      ? `Последний визит: ${stats.lastVisitText}`
      : "Добавьте первую запись"
    : "Перейдите в профиль и заведите питомца.";

  return (
    <View style={{ gap: 18 }}>
      <HeroCard>
        <HeroCardTitle text="Вет-журнал" />
        <HeroCardSubtitle text={heroSubtitle} />
        <HeroCardBadge text={heroBadgeText} />
      </HeroCard>

      <PetTabs />

      <StatsBlocks>
        <StatsBlock label="Записей" value={records.length} />
        <StatsBlock label="Клиник" value={stats.clinicCount} />
        <StatsBlock label="Прошлый визит" value={stats.lastVisitText} />
      </StatsBlocks>

      <View style={vetHeaderStyles.grid}>
        {vaccineSummaries.map(({ section, data }) => (
          <View key={section.key} style={vetHeaderStyles.card}>
            <Text style={vetHeaderStyles.label}>{section.title}</Text>
            <Text style={vetHeaderStyles.value}>{data.label}</Text>
            <Text style={vetHeaderStyles.hint}>{data.subtitle}</Text>
          </View>
        ))}
        <View style={vetHeaderStyles.card}>
          <Text style={vetHeaderStyles.label}>Аллергии</Text>
          <Text style={vetHeaderStyles.value}>{allergyInfo.label}</Text>
          <Text style={vetHeaderStyles.hint}>{allergyInfo.subtitle}</Text>
        </View>
      </View>
    </View>
  );
}
