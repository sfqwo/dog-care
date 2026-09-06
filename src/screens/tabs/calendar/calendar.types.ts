import type { CareCalendarEvent } from "@dog-care/domain";

export type CalendarEventItemProps = {
  event: CareCalendarEvent;
  onOpen: (event: CareCalendarEvent) => void;
  onComplete: (event: CareCalendarEvent) => void;
  onRemove: (event: CareCalendarEvent) => void;
};

export type CalendarDayButtonProps = {
  dayNumber: string;
  weekDay: string;
  isSelected: boolean;
  isToday: boolean;
  onPress: () => void;
};
