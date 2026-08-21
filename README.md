# ProjectX UI

Een volledig eigen React component library, gebouwd op het **ProjectX UI-design**.
Werkt zoals shadcn/ui — dezelfde compositie, dezelfde copy-paste-aanpak — maar **zonder één regel
code van shadcn, Radix, Headless UI, cva of clsx**. Alles staat in `packages/ui/src`.

```
68 componenten · 2 thema's · 3 dichtheden · 0 UI-dependencies
```

---

## Snel starten

```bash
npm install
npm run dev        # documentatiesite op http://localhost:3000
```

| Commando | Wat het doet |
| --- | --- |
| `npm run dev` | Start de documentatiesite (Next.js 15) |
| `npm run build` | Genereert de registry en bouwt de site |
| `npm run registry` | Regenereert `registry/`, de props-tabellen en de demo-index |
| `npm run typecheck` | TypeScript-check op de library |

---

## Structuur

```
projectx-ui/
├─ packages/
│  ├─ ui/                 De library
│  │  └─ src/
│  │     ├─ components/   68 componenten (.tsx + .css per component)
│  │     ├─ lib/          cn, variants, Slot, Portal, hooks, positionering, datums
│  │     ├─ icons/        eigen icon set (één path per glyph)
│  │     └─ styles/       tokens.css + base.css + index.css
│  └─ cli/                npx projectx-ui  (init / add / list)
├─ apps/
│  └─ docs/               De documentatiesite met live previews
├─ registry/              Gegenereerd: bron per component voor de CLI
└─ scripts/
   └─ build-registry.mjs  Genereert registry, props-tabellen en demo-index
```

---

## In een ander project gebruiken

```bash
npx projectx-ui init                   # tokens, base-CSS en hulpfuncties
npx projectx-ui add button card dialog # componenten kopiëren (+ afhankelijkheden)
npx projectx-ui add --all              # alles in één keer
npx projectx-ui list                   # overzicht
```

De CLI schrijft naar `components/ui/` (instelbaar in `projectx-ui.json`), herschrijft de imports naar
één platte map en houdt `components/ui/ui.css` bij met de juiste `@import`-regels. Importeer dat ene
bestand in je globale stylesheet en je bent klaar.

---

## Design tokens

**Alle kleuren komen uit `packages/ui/src/styles/tokens.css`** — exact overgenomen uit het
ProjectX UI-design. Componenten schrijven nooit een hex-waarde; ze gebruiken uitsluitend variabelen:

```css
--accent: #0d9488;   --surface: #ffffff;   --text: #0f1729;
--green: #16a34a;    --amber: #d97706;     --red: #dc2626;
--r-sm: 8px;         --sh-md: 0 4px 12px rgba(16,23,41,.07);
```

Eén token aanpassen herkleurt de hele library, in licht én donker.
Donkere modus staat in hetzelfde bestand onder `[data-theme="dark"]`.

---

## Eigen primitieven (geen dependencies)

| Bestand | Vervangt | Wat het doet |
| --- | --- | --- |
| `lib/cn.ts` | clsx / classnames | Klassen samenvoegen |
| `lib/variants.ts` | cva | Varianten → klassen |
| `lib/slot.tsx` | @radix-ui/react-slot | `asChild`-patroon |
| `lib/anchor.ts` | Floating UI / Popper | Positionering met flip + clamp |
| `lib/portal.tsx` | Radix Portal | Renderen in `document.body` |
| `lib/hooks.ts` | Radix-hooks | Controlled state, focus-trap, escape, scroll-lock, outside-click |
| `lib/date.ts` | date-fns / dayjs | Weken, maanden, ISO-weeknummers, tijd parsen en formatteren (Intl, nl-BE) |
| `lib/schedule.ts` | — | Gedeeld agendamodel: resources, events, overlap-packing, groeperen |
| `lib/use-voice.ts` | react-speech-recognition | Spraakherkenning van de browser, met nette terugval |
| `lib/image.ts` | react-easy-crop / browser-image-compression | Foto vierkant bijsnijden en verkleinen op canvas |
| `icons/` | lucide / feather | Eigen icon set, 24×24, stroke-based |

---

## Componenten

**Basis** — Button, Badge, Chip, Avatar, Card, Separator, Kbd, Skeleton, Spinner, CopyButton, Icon
**Formulieren** — Input, Textarea, Field, Label, Checkbox, RadioGroup, Switch, Select, Combobox, Slider, OtpInput, FileDrop, Composer, VoiceButton, AvatarUpload, SwatchPicker
**Overlays** — Dialog, Drawer, Popover, DropdownMenu, Tooltip, Command, Toast, ModalProvider (imperatief)
**Navigatie** — Tabs, Accordion, Breadcrumb, Pagination, Segmented, Stepper, Toolbar, Sidebar
**Datum & planning** — Calendar, DatePicker, DateRangePicker, TimeField, TimeRangeField, PeriodNav
**Agendaweergaven** — WeekSchedule (tijdraster), ResourceColumns, Swimlanes, TimeSlotList — één datamodel
**Data** — Table, ListRow, TaskItem, Stat, DataPill, Charts (bar / line / donut / sparkline), Progress
**Feedback** — Alert, EmptyState, PulseDot, ConfettiBurst
**Layout** — AppShell, Workspace, SectionHeader, EntityHeader, AuthLayout, Theme (+ DensityToggle)

Elk component: TypeScript, controlled + uncontrolled, ARIA-rollen, toetsenbordnavigatie,
zichtbare focus, licht + donker.

---

## Conventies

- Elke CSS-klasse begint met `pxui-` — botst nooit met bestaande styling.
- Eén `.tsx` + één `.css` per component, altijd samen gekopieerd.
- Sub-componenten volgen de compositie die je van shadcn kent:
  `Dialog / DialogTrigger / DialogContent / DialogHeader / DialogTitle / DialogFooter`.
- Props-tabellen in de docs worden **uit de TypeScript-bron gegenereerd** en kunnen dus niet verouderen.
- Tailwind v4 draait enkel als CSS-engine (reset + utilities voor je eigen markup) en is niet verplicht.
- Drag & drop (WeekSchedule) is eigen pointer-code: geen dnd-kit, geen react-beautiful-dnd.
- `Sidebar` heeft een `tone="inverted"` variant: een donkere rail waarvan alle kleuren met `color-mix`
  uit de bestaande tokens komen, dus ook die blijft binnen het ProjectX UI-palet.
- `Workspace` stapelt op basis van zijn eigen breedte (container query), niet op vensterbreedte.
- De vier agendaweergaven delen `ScheduleResource` en `ScheduleEvent` uit `lib/schedule.ts`, dus wisselen
  van weergave kost geen omzetting van je data.
- Dichtheid zit in één token: `--density`. Elke hoogte en padding is `calc(Npx * var(--density))`, dus
  `DensityToggle` (compact / normaal / ruim) schaalt de hele library zonder een component aan te raken.
- Spraak (`VoiceButton`, `Composer`) draait op de Web Speech API van de browser. Ondersteunt die het niet,
  dan verdwijnt de knop of wordt ze grijs — je krijgt nooit een dood knopje.
- Nieuwe componenten dragen `isNew: true` in `apps/docs/content/catalog.ts`; dat toont het "nieuw"-label
  in de navigatie, op de pagina en in het blok "Nieuw in deze versie".
