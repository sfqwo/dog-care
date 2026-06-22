import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  buildDailyTrend,
  calculateTrendChange,
  formatLocalDate,
  startOfLocalDay,
} from "@dog-care/core/utils";
import type {
  CareTrendContextValue,
  CareTrendProps,
  CareTrendRange,
  CareTrendSeriesProps,
} from "./types";
import { careTrendStyles } from "./styles";
import {
  findLatestDataIndex,
  formatTrendBoundaryDate,
  formatTrendPercent,
  getTrendAxisIndexes,
  getTrendBarHeight,
} from "./utils";

const CareTrendContext = createContext<CareTrendContextValue | null>(null);

export function CareTrend({ title, children }: CareTrendProps) {
  const [range, setRange] = useState<CareTrendRange>(7);
  return (
    <CareTrendContext.Provider value={{ range }}>
      <View style={careTrendStyles.card}>
        <View style={careTrendStyles.header}>
          <Text style={careTrendStyles.title}>{title}</Text>
          <View style={careTrendStyles.rangeControl} accessibilityRole="tablist">
            <RangeButton label="Неделя" range={7} selected={range === 7} onPress={setRange} />
            <RangeButton label="Месяц" range={30} selected={range === 30} onPress={setRange} />
          </View>
        </View>
        {children}
      </View>
    </CareTrendContext.Provider>
  );
}

export function CareTrendSeries({
  points,
  aggregation,
  comparison = "halves",
  thresholdPercent = 15,
  formatValue,
  emptyText = "Добавьте несколько записей, чтобы увидеть динамику.",
}: CareTrendSeriesProps) {
  const { range } = useCareTrendContext();
  const today = startOfLocalDay(Date.now());
  const dailyPoints = useMemo(
    () => buildDailyTrend(points, range, aggregation, today),
    [aggregation, points, range, today]
  );
  const latestDataIndex = findLatestDataIndex(dailyPoints);
  const [selectedIndex, setSelectedIndex] = useState(latestDataIndex);
  const hasData = latestDataIndex >= 0;
  const selectedPoint = dailyPoints[selectedIndex] ?? dailyPoints[dailyPoints.length - 1];
  const change = useMemo(
    () => calculateTrendChange(dailyPoints, comparison, thresholdPercent),
    [comparison, dailyPoints, thresholdPercent]
  );

  useEffect(() => {
    setSelectedIndex(findLatestDataIndex(dailyPoints));
  }, [dailyPoints]);

  if (!hasData) {
    return (
      <View style={careTrendStyles.empty}>
        <Text style={careTrendStyles.emptyText}>{emptyText}</Text>
      </View>
    );
  }

  const values = dailyPoints.flatMap((point) => point.value === null ? [] : [point.value]);
  const min = Math.min(...values);
  const max = Math.max(...values);

  return (
    <>
      <View style={careTrendStyles.selectedSummary}>
        <Text style={careTrendStyles.selectedDate}>
          {selectedPoint ? formatLocalDate(selectedPoint.at, { day: "numeric", month: "long" }) : ""}
        </Text>
        <Text style={careTrendStyles.selectedValue}>
          {selectedPoint?.hasData && selectedPoint.value !== null
            ? formatValue(selectedPoint.value)
            : "Нет данных"}
        </Text>
      </View>

      <PeriodBounds points={dailyPoints} />

      <View style={careTrendStyles.chart}>
        <View style={careTrendStyles.chartBaseline} />
        {dailyPoints.map((point, index) => (
          <Pressable
            key={point.at}
            style={[
              careTrendStyles.slot,
              range === 30 && index > 0 && index % 7 === 0 && careTrendStyles.weekBoundary,
            ]}
            onPress={() => setSelectedIndex(index)}
          >
            <View style={careTrendStyles.barTrack}>
              <View
                style={[
                  careTrendStyles.bar,
                  !point.hasData && careTrendStyles.barEmpty,
                  index === selectedIndex && careTrendStyles.barSelected,
                  { height: getTrendBarHeight(point.value, min, max) },
                ]}
              />
            </View>
          </Pressable>
        ))}
      </View>

      <TrendAxis points={dailyPoints} range={range} selectedIndex={selectedIndex} />

      <TrendInsight change={change} />
    </>
  );
}

function PeriodBounds({ points }: { points: { at: number }[] }) {
  const first = points[0]?.at;
  const last = points[points.length - 1]?.at;
  if (!first || !last) return null;

  return (
    <View style={careTrendStyles.periodBounds}>
      <Text style={careTrendStyles.periodBoundText}>{formatTrendBoundaryDate(first, last)}</Text>
      <View style={careTrendStyles.periodLine}>
        <View style={careTrendStyles.periodDot} />
        <View style={careTrendStyles.periodRule} />
        <View style={careTrendStyles.periodDot} />
      </View>
      <Text style={careTrendStyles.periodBoundText}>{formatTrendBoundaryDate(last, first)}</Text>
    </View>
  );
}

function TrendAxis({
  points,
  range,
  selectedIndex,
}: {
  points: { at: number }[];
  range: CareTrendRange;
  selectedIndex: number;
}) {
  const indexes = getTrendAxisIndexes(range, points.length);
  return (
    <View style={careTrendStyles.axis}>
      {indexes.map((index) => (
        <Text
          key={points[index].at}
          style={[
            careTrendStyles.axisLabel,
            index === selectedIndex && careTrendStyles.axisLabelSelected,
          ]}
        >
          {formatLocalDate(points[index].at, { day: "2-digit", month: "2-digit" })}
        </Text>
      ))}
    </View>
  );
}

function RangeButton({
  label,
  range,
  selected,
  onPress,
}: {
  label: string;
  range: CareTrendRange;
  selected: boolean;
  onPress: (range: CareTrendRange) => void;
}) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      style={[careTrendStyles.rangeButton, selected && careTrendStyles.rangeButtonActive]}
      onPress={() => onPress(range)}
    >
      <Text style={[careTrendStyles.rangeText, selected && careTrendStyles.rangeTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function TrendInsight({ change }: { change: ReturnType<typeof calculateTrendChange> }) {
  if (!change) {
    return (
      <View style={careTrendStyles.insight}>
        <MaterialCommunityIcons name="chart-line" size={18} style={careTrendStyles.insightIcon} />
        <Text style={careTrendStyles.insightText}>Недостаточно данных для сравнения периодов</Text>
      </View>
    );
  }

  const directionText = change.direction === "up"
    ? "увеличение"
    : change.direction === "down"
      ? "снижение"
      : "без изменений";
  const prefix = change.significant ? "Заметное" : "Незначительное";
  const icon = change.direction === "up"
    ? "trending-up"
    : change.direction === "down"
      ? "trending-down"
      : "minus";

  return (
    <View style={[careTrendStyles.insight, change.significant && careTrendStyles.insightSignificant]}>
      <MaterialCommunityIcons name={icon} size={18} style={careTrendStyles.insightIcon} />
      <Text style={careTrendStyles.insightText}>
        {prefix} {directionText}: {formatTrendPercent(change.percent)}
      </Text>
    </View>
  );
}

function useCareTrendContext() {
  const context = useContext(CareTrendContext);
  if (!context) throw new Error("CareTrendSeries must be used inside CareTrend.");
  return context;
}

export type { CareTrendProps, CareTrendSeriesProps } from "./types";
