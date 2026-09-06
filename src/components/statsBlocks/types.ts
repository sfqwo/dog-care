import type { ReactElement, ReactNode } from "react";

export type StatsBlockProps = {
  label: string;
  value: ReactNode;
};

export type StatsBlocksProps = {
  children: ReactNode;
};

export type StatsBlockElement = ReactElement<StatsBlockProps>;
