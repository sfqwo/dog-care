import type {
  SectionTabMeta,
  TreatmentSection,
  VaccineSection,
  VetHealthInfo,
  VetSectionTabIcon,
} from "./vet.types";

export const VACCINE_SECTIONS: VaccineSection[] = [
  {
    key: "core",
    title: "Комплекс DHPPi",
    description: "Чумка, аденовирус, парвовирус, парагрипп",
    keywords: [/dhpp?/i, /чумк/i, /парво/i, /комплекс/i],
    clinicPlaceholder: "Клиника / серия DHPPi",
  },
  {
    key: "rabies",
    title: "Бешенство",
    description: "Ежегодная вакцинация от бешенства",
    keywords: [/бешенств/i, /rabies/i],
    clinicPlaceholder: "Клиника / серия бешенства",
  },
  {
    key: "lepto",
    title: "Лептоспироз",
    description: "Лептоспироз (по показаниям)",
    keywords: [/лепто/i, /lepto/i],
    clinicPlaceholder: "Клиника / серия лептоспироза",
  },
];

export const TREATMENT_SECTIONS: TreatmentSection[] = [
  {
    key: "deworming",
    title: "Дегельминтизация",
    description: "Дата, препарат, доза и реакция",
    productPlaceholder: "Препарат (например Drontal)",
    dosePlaceholder: "Доза / вес",
  },
  {
    key: "ectoparasites",
    title: "Обработка от паразитов",
    description: "Блохи, клещи, комплексные средства",
    productPlaceholder: "Средство (например Bravecto)",
    dosePlaceholder: "Форма / доза",
  },
];

export const EMPTY_HEALTH: VetHealthInfo = {
  vaccines: {},
  optionalVaccines: [],
  deworming: [],
  ectoparasites: [],
  allergyEntries: [],
  contraindicationNotes: undefined,
  healthNotes: undefined,
};

export const SECTION_TABS: SectionTabMeta[] = [
  {
    key: "passport",
    title: "Ветпаспорт",
    subtitle: "Вакцины, анамнез и обработки",
    icon: "book-open-page-variant" as VetSectionTabIcon,
  },
  {
    key: "records",
    title: "Визиты",
    subtitle: "История приёмов и задачи",
    icon: "calendar-check-outline" as VetSectionTabIcon,
  },
];

export const SECTION_TAB_ITEMS = SECTION_TABS.map((tab) => ({
  id: tab.key,
  title: tab.title,
  subtitle: tab.subtitle,
  icon: tab.icon as VetSectionTabIcon,
}));
