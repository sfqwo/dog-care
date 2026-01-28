import type { ReactNode } from "react";

export type FormStackProps = {
  children: ReactNode;
};

export type FormCardProps = {
  children: ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
};

export type FormCardTitleProps = {
  children: ReactNode;
};

export type FormCardSubtitleProps = {
  children: ReactNode;
};
