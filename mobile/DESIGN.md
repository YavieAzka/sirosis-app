---
name: CirrhoSmart AI Android
description: Hybrid AI Clinical Decision Support System for Hospitalized Liver Cirrhosis Care
colors:
  medical-maroon: "#7F1D1D"
  on-medical-maroon: "#FFFFFF"
  maroon-tint-container: "#FEE2E2"
  on-maroon-tint-container: "#450A0A"
  maroon-dark-accent: "#FCA5A5"
  on-maroon-dark-accent: "#450A0A"
  ward-slate-secondary: "#6B4C4E"
  canvas-light: "#F8FAFC"
  surface-elevated-light: "#FFFFFF"
  surface-container-light: "#F1F5F9"
  canvas-dark: "#111318"
  surface-elevated-dark: "#161920"
  surface-container-dark: "#1F232C"
  ink-primary-light: "#0F172A"
  ink-secondary-light: "#475569"
  ink-primary-dark: "#F1F5F9"
  ink-secondary-dark: "#CBD5E1"
  outline-light: "#64748B"
  outline-variant-light: "#CBD5E1"
  outline-variant-dark: "#334155"
  clinical-safe: "#047857"
  clinical-safe-container: "#ECFDF5"
  clinical-warning: "#B45309"
  clinical-warning-container: "#FFFBEB"
  clinical-danger: "#B91C1C"
  clinical-danger-container: "#FEF2F2"
  clinical-info: "#1D4ED8"
  clinical-info-container: "#EFF6FF"
typography:
  display:
    fontFamily: "sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.22
    letterSpacing: "0em"
  headline:
    fontFamily: "sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.33
    letterSpacing: "0em"
  title:
    fontFamily: "sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.27
    letterSpacing: "0em"
  body:
    fontFamily: "sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: "0.018em"
  label:
    fontFamily: "sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "0.033em"
rounded:
  none: "0px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xxs: "2px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.medical-maroon}"
    textColor: "{colors.on-medical-maroon}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
    height: "48px"
  button-tonal:
    backgroundColor: "{colors.maroon-tint-container}"
    textColor: "{colors.on-maroon-tint-container}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
    height: "48px"
  card-neutral:
    backgroundColor: "{colors.canvas-light}"
    rounded: "{rounded.lg}"
    padding: "16px"
  card-elevated:
    backgroundColor: "{colors.surface-elevated-light}"
    rounded: "{rounded.lg}"
    padding: "16px"
  input-clinical:
    backgroundColor: "{colors.surface-elevated-light}"
    textColor: "{colors.ink-primary-light}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
    height: "48px"
  nav-pill-active:
    backgroundColor: "{colors.maroon-tint-container}"
    textColor: "{colors.on-maroon-tint-container}"
    rounded: "{rounded.full}"
---

# Design System: CirrhoSmart AI Android

## Overview

**Creative North Star: "The Bedside Precision Instrument"**

CirrhoSmart AI Android translates hospital hepatology risk prediction and deterministic drug safety checks into a high-contrast Material Design 3 bedside utility. Every screen separates `Operate` mode (mortality prediction, length-of-stay stratification, and renal/hepatic dose evaluation) from `Read` mode (research methodology, 4-step user guide, and 44 cited references), prioritizing unambiguous numeric alignment, fast thumb reachability during ward rounds, and zero ambiguity under fluorescent ward glare or night-shift lighting.

The visual system rejects web card bloat, decorative progress rings, saturated full-card chrome, and Cupertino UI controls. Deep Medical Maroon anchors primary clinical submissions and active navigation pills, while calibrated Emerald, Amber, Crimson, and Blue semantic containers carry clinical triage meanings without shouting across neutral inputs.

**Key Characteristics:**
- Native Android Material Design 3 architecture built with custom React Native primitives and responsive Window Size Class tokens (`compact`, `medium`, `expanded`).
- First-class Light and Dark schemes maintaining WCAG AA (`>= 4.5:1`) contrast across every clinical status banner and input label.
- Strict `tabular-nums` alignment across all laboratory parameters, AUROC scores, SHAP divergence bars, UNOS MELD badges, and dosing bounds.
- Minimum `48 dp` touch targets separated by at least `8 dp` gaps on every interactive control.

## Colors

Restrained clinical neutrals form the structural stage so Deep Medical Maroon stays reserved for primary actions and semantic medical alerts stand out with immediate clarity.

### Primary
- **Medical Maroon** (`colors.medical-maroon` in Light; `colors.maroon-dark-accent` in Dark): Used exclusively for primary submission CTAs, active filter chips, active reading headers, and hero anchors in the Research About view.
- **Maroon Tint Container** (`colors.maroon-tint-container`): Carries active navigation rail/bottom-bar indicator pills, tonal buttons, highlighted AASLD/EASL core citations, and active Auto-CTP badges paired with dark maroon ink (`colors.on-maroon-tint-container`).

### Secondary
- **Ward Slate Secondary** (`colors.ward-slate-secondary`): Muted rose-slate secondary accent supporting calm metadata states without competing with primary medical actions.

### Neutral
- **Crisp Clinical Canvas & Tonal Surfaces** (`colors.canvas-light`, `colors.surface-elevated-light`, `colors.surface-container-light` in Light; `colors.canvas-dark`, `colors.surface-elevated-dark`, `colors.surface-container-dark` in Dark): Separate scrollable screens from structured cards and read-only auto-calculated input states (`surfaceContainer`).
- **Clinical Ink & Hairline Outlines** (`colors.ink-primary-light`, `colors.ink-secondary-light`, `colors.outline-variant-light` in Light; `colors.ink-primary-dark`, `colors.ink-secondary-dark`, `colors.outline-variant-dark` in Dark): Preserve sharp legibility for laboratory units, validation guidance, and hairline container boundaries.

### Semantic Clinical Bands
- **Safe / Appropriate** (`colors.clinical-safe` & `colors.clinical-safe-container`): Low-risk mortality strata (`< 0.4`), `Use` drug recommendations, negative SHAP protective contributors, concordant expert agreement, and DB save confirmation alerts.
- **Monitor / Caution** (`colors.clinical-warning` & `colors.clinical-warning-container`): Prolonged-stay risk (`>= 0.5`), `Reduce / Monitor` drug recommendations, `PERINGATAN - Wajib Review Klinis` banner, and cohort key-observation notices.
- **High Risk / Avoid** (`colors.clinical-danger` & `colors.clinical-danger-container`): High mortality probability (`>= 0.4`), `Avoid` contraindicated drugs, positive risk-elevating SHAP bars, and red-flag drug warnings.
- **Clinical Informational** (`colors.clinical-info` & `colors.clinical-info-container`): Low-risk length-of-stay strata (`< 0.5`), diuretic group explanation, and offline calculator availability notices.

**The Semantic Color Discipline Rule.** Never spend emerald, amber, or red hues as decorative card chrome—clinical color bands are strictly bound to risk stratification, drug safety classification, or inline error/success feedback.

## Typography

**Display Font:** Roboto / platform `sans-serif` (system UI stack with dynamic Android `sp` scaling).
**Body Font:** Roboto / platform `sans-serif`.
**Label/Mono Font:** Platform `monospace` enforcing `fontVariant: ['tabular-nums']` (`numericDisplay`, `numericTitle`, `numericBody`, `numericLabel`).

**Character:** Clinical workhorse hierarchy pairing high-clarity Material 3 sans-serif labels with aligned monospaced tabular figures so decimals and percentages scan vertically without horizontal jitter.

### Hierarchy
- **Display** (`700`, `57dp / 45dp / 36dp` matching `displayLarge/Medium/Small`): Large numerical hero anchors only when showcasing primary benchmark probability outputs.
- **Headline** (`700`, `32dp / 28dp / 24dp`, line-height `40dp / 36dp / 32dp`): Screen hero headings (`CirrhoSmart AI`, module card headers).
- **Title** (`700` at `22dp` `titleLarge`; `600` at `16dp / 14dp` `titleMedium/Small`): Top App Bar module headers, result sheet titles, and section headings.
- **Body** (`400`, `16dp / 14dp / 12dp`, line-height `24dp / 20dp / 16dp`): Clinical instructions, SHAP explanations, rationales, and reference prose (capped to `<= 780dp` reading measure on tablets).
- **Label** (`600`, `14dp / 12dp / 11dp`, line-height `20dp / 16dp / 16dp`): Form field labels, navigation destinations, filter chips, and status pills.

**The Tabular Precision Rule.** Every predicted probability, MELD score, eGFR value, MAP calculation, INR readout, cohort statistic, and dosing bound MUST use one of the four `numeric*` typography roles (`fontVariant: ['tabular-nums']`).

## Layout

Screen chrome follows Android Window Size Class breakpoints (`< 600 dp` Compact Phone, `600–839 dp` Medium Tablet, `>= 840 dp` Expanded Tablet) using an `8dp` base rhythm (`xxs: 2dp`, `xs: 4dp`, `sm: 8dp`, `md: 12dp`, `lg: 16dp`, `xl: 24dp`, `xxl: 32dp`).

- **Compact Phones (`< 600 dp`):** Persistent Material 3 Bottom Navigation Bar (4 destinations: `Mortalitas`, `Lama Rawat`, `Dosis`, `Info`), single-column scrollable form (`ResponsiveWorkspace`), primary outputs surfaced via dismissible `ResultSheetModal`, and `InfoHub` sub-pages pushed onto root Expo Router Stack with native Predictive Back gesture support.
- **Ward Tablets (`>= 600 dp`, portrait & landscape):** Persistent `88dp` Material 3 Navigation Rail on the left edge + side-by-side two-pane `ResponsiveWorkspace` allowing laboratory entry in the primary pane while inspecting live SHAP bars, dosing cards, or Research Methodology side-by-side in the secondary pane. Multi-column comparison views (`MODEL_METRICS_TABLE`) switch from compact cards (`< 600 dp`) to 5-column aligned table rows on wide widths.
- **Edge-to-Edge & IME Insets:** `useSafeAreaInsets()` pads top app bars, bottom bars, and modal bottom sheets cleanly around notches and system gesture bars, paired with `KeyboardAvoidingView` (`softwareKeyboardLayoutMode: "resize"`) so bottom laboratory fields and save tokens never disappear beneath the soft keyboard.

**The Measured Separation Rule.** Related inputs inside a `ClinicalCard` group at `12dp–16dp` gaps, while distinct clinical sections and headings maintain greater breathing room above (`24dp`) than below (`4dp–8dp`).

## Elevation & Depth

Surfaces communicate depth through Material Design 3 **tonal surface layering** paired with crisp `1dp` structural borders (`outlineVariant`) rather than heavy drop shadows. Background canvas (`level -1` canvas `#F8FAFC` / `#111318`) steps cleanly up to elevated card panels (`level 0` `#FFFFFF` / `#161920`), grouped neutral cards (`level 1` `#F8FAFC` / `#1A1D25`), read-only computed slots (`level 2` `#F1F5F9` / `#1F232C`), and pressed states (`level 3` `#E2E8F0` / `#292E39`).

**The Flat-Tonal Discipline Rule.** Convey hierarchy via luminance contrast between canvas and surface containers plus hairline `1dp` borders—never invent decorative box shadows or thick left-edge accent stripes (`border-left > 1dp`).

## Shapes

Corner geometry scales proportionally with container hierarchy (`RADII`):
- Small informational badges and inline chips use `8dp` (`RADII.sm`).
- Interactive controls—buttons, inputs, segmented tracks, switches, checkboxes, and select triggers—use `12dp` (`RADII.md`).
- Grouped section containers (`ClinicalCard`, cohort tables, team cards) use `16dp` (`RADII.lg`).
- Modal bottom sheets (`MaterialSelectSheet`, `ResultSheetModal`) and hero banners round top corners generously to `24dp` (`RADII.xl`).
- Navigation indicator pills, filter chips, team avatars, and compact toggle chips use pill geometry (`RADII.full`).

## Components

### Buttons
Consistent Material 3 filled (`primary`), tonal (`primaryContainer`), outlined (`surface` + `outline`), and text actions with minimum `48dp` height, `12dp` (`RADII.md`) radius, `16dp` horizontal padding, and centered loading `ActivityIndicator`.

### Chips
Horizontal scrollable category filters and methodology section tabs rendered with `48dp` minimum touch height, pill radius (`RADII.full`), `8dp` separation (`MIN_GAP_DP`), active solid maroon fill, and inactive outlined surface.

### Cards / Containers
`ClinicalCard` provides `neutral`, `elevated`, `safe`, `warning`, `danger`, and `info` tones with `16dp` (`RADII.lg`) corners, `1dp` border, `16dp` internal padding, and `12dp` vertical item spacing. Avoid nesting bordered cards inside cards; use subtle hairline horizontal dividers inside structured panels (`Cohort`, `Concordance`, `References`, `Team`).

### Inputs / Fields
`ClinicalNumberInput` features top `labelMedium`, crisp outlined container (`48dp+` hit area tapping anywhere on container), tabular-numeric `decimal-pad` entry supporting Indonesian comma decimals (`,` -> `.`), right unit label (`mg/dL`, `mEq/L`, `U/L`, `mL/min`, `mmHg`, `detik`, `yrs`), distinct filled read-only styling when auto-calculated, and `accessibilityLiveRegion="polite"` inline error banner. `MaterialSelectSheet` replaces HTML `<select>` with a thumb-friendly bottom sheet containing `>= 48dp` radio options.

### Navigation
`AdaptiveNavigationScaffold` switches structurally at `600dp` between compact Bottom Navigation Bar and expanded Navigation Rail (`width: 88dp`), pairing a consistent Top App Bar (`ID/EN` chip + Light/Dark toggle `>= 48dp`). Standalone reading flows (`/about`, `/guide`, `/methodology`) use `ReaderHeader` with an accessible `>= 48dp` `ArrowLeft` back button honoring Android's native Back gesture (`predictiveBackGestureEnabled: true`).

### Signature Clinical Calculators & Safety Components
- **`CtpCalculator`:** Synchronizes 5 clinical scores automatically to `komp_eh` when `Auto` is active on Mortality and LoS screens.
- **`GfrCalculatorCard`:** Operates in `standalone` mode (Mortality/Dosis) or `linked` mode (reading Creatinine and Age directly from LoS main inputs).
- **`InrInputCard` & `MapInputCard`:** Allow direct lab entry or local offline derivation (`PT/Control/ISI` and `SBP/DBP`).
- **`SaveToDatabaseSection`:** Guards `/api/database/save` behind manual `SAVE_TOKEN` input with visibility toggle, preserving all clinical values and tokens on `401` errors without clearing fields.

## Do's and Don'ts

### Do:
- **Do** enforce minimum `48×48 dp` hit targets (`TOUCH_TARGET.MIN_SIZE_DP`) and `>= 8 dp` spacing (`TOUCH_TARGET.MIN_GAP_DP`) on every touchable element.
- **Do** test and maintain both Light (`#F8FAFC`) and Dark (`#111318`) color schemes with WCAG AA contrast (`>= 4.5:1`) using `colors.*` semantic tokens exclusively.
- **Do** normalize comma decimals via `parseLocaleNumber()` before client validation and API payload serialization, and apply UNOS `1.0` floor / `4.0 mg/dL` creatinine cap on `hitungMeldUnos()`.
- **Do** support Android system `Reduce Motion` (`MOTION.REDUCED_MS = 0`) across animated modals and transitions while keeping active motion crisp (`150–250ms`).
- **Do** preserve keyboard & portrait/landscape responsiveness (`softwareKeyboardLayoutMode: "resize"`, `"orientation": "default"`).

### Don't:
- **Don't** hardcode raw hex color strings inside component TSX files or bypass `ThemeProvider` tokens.
- **Don't** render wide horizontal data tables with multi-column clipping on phones (`< 600 dp`)—switch cleanly to stacked key-value strips on compact screens.
- **Don't** clear user inputs, close modals, or emit generic pop-up `alert()` calls on validation errors or `401` authorization failures—render inline `InlineAlert` feedback in place.
- **Don't** mix Cupertino UI widgets, browser `<select>` metaphors, emojis, or decorative eyebrows/kickers above headings into Material 3 surfaces.
- **Don't** perform local mock predictions or override server dosing rules; display server responses faithfully with explicit mandatory clinical review disclaimers.
