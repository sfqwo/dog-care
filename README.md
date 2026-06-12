# Dog Care

Dog Care — мобильное приложение на Expo Router, которое помогает вести журналы прогулок, кормлений и визитов к ветеринару. Все экраны собраны из переиспользуемых компонентов (HeroCard, StatsBlocks, TimeRecorder, SwipeableCardsList), поэтому интерфейсы выглядят единообразно, а данные владельца и питомцев редактируются через модалки с собственными инпутами и селектами.

## Что внутри

- **Walks / Feeding / Vet** — независимые вкладки с карточкой‑героем, статистикой, формой добавления событий и свайповым списком карточек. Вет‑вкладка дополнена сегментами «Ветпаспорт» и «Визиты» с отдельными формами.
- **Профиль** — хранение владельца и неограниченного числа питомцев, редактирование через модальные формы с масками ввода, селектами пород/городов и кастомным тумблером пола.
- **Локальные пакеты**  
  - `@dog-care/core` — shared/utils: форматирование дат, веса, обработка вет данных.  
  - `@dog-care/domain` — единый источник типов домена и бизнес-логики ухода: напоминания, план дня, ветпаспорт.  
  - `@dog-care/ui/input`, `@dog-care/select`, `@dog-care/tabs` — дизайн-система с инпутами, селектами и вкладками.
- **Hooks** — отдельные файлы для карточек/статистики/вет-хранилища (`src/hooks/useVetStorage`, `useWalkStats`, `useDogBreeds` и т.д.).
- **Storage** — JSON‑слой на AsyncStorage с ключами в `src/storage/keys`.

## Требования

- Node.js 18+
- npm 9+ (можно pnpm/yarn)
- Expo CLI (`npx expo ...`)

## Старт

```bash
npm install
npx expo start
```

Expo Dev Tools предложит запустить iOS Simulator, Android Emulator или web‑версию.

## Основные скрипты

| Команда             | Назначение                           |
| ------------------- | ------------------------------------ |
| `npm start`         | Expo Dev Tools                       |
| `npm run ios`       | Expo → iOS Simulator                 |
| `npm run android`   | Expo → Android Emulator              |
| `npm run web`       | Expo Web                             |
| `npm run lint`      | `expo lint`                          |
| `npm run typecheck` | `tsc --noEmit` (используется и для `npm test`) |

## Структура

```
app/                         # Экранные маршруты Expo Router (tab stack)
├─ (tabs)/(walks|feeding|vet) # Ключевые вкладки приложения
├─ (tabs)/(profile)          # Профиль владельца и питомцев
packages/
├─ core/                     # shared + utils (форматирование, константы)
├─ domain/                   # Доменные типы и бизнес-логика ухода
├─ ui/                       # Переиспользуемые UI-блоки
src/
├─ components/               # HeroCard, GenderToggle, модалки, списки и т.д.
├─ hooks/                    # Логика (useVetStorage, useWalkStats...)
├─ presentation/             # UI-конфигурация и presentation mappings
├─ storage/                  # JSON-хранилище и ключи
```
