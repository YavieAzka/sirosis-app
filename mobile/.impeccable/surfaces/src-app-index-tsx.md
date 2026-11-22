# Surface Brief: CirrhoSmart AI Android Shell & Primary Clinical Workspace

- **Scope:** Android application shell (`mobile/src/app/(tabs)/*`) and Material Design 3 token system (`mobile/src/theme/*`) covering phone (`< 600 dp`) and ward tablet (`>= 600 dp`) layouts across Light and Dark appearances.
- **Mode:** `Operate` for the three clinical calculator workspaces (`Mortalitas`, `Lama Rawat`, `Dosis`); `Read` for `Info & Riset`.
- **Audience & Context:** Hospital clinical pharmacists and attending physicians (DPJP) evaluating hospitalized cirrhosis patients during bedside rounds (daylight ward lighting and night-shift low light).
- **Constraints:** Material Design 3 conformance (`android.md`), `48×48 dp` minimum touch targets (`8 dp` gap), `sp` font scaling (`1.3x` safe), edge-to-edge WindowInsets, System/Predictive Back compliance, `tabular-nums` on clinical numerics, *Reduce Motion* support, zero hallucination / server-only inference.

## Direction contract

- **THESIS:** A precision Material Design 3 clinical instrument—treating hepatology risk stratification and drug safety like an unambiguous ward bedside diagnostic tool rather than a ported web card stack or decorative health dashboard.
- **OWN-WORLD:** Deep Medical Maroon (`#7F1D1D` light / `#FCA5A5` dark) carried solely on primary actions, active navigation pills, and brand identity anchors, resting on crisp high-contrast tonal neutral surfaces (`#F8FAFC`/`#FFFFFF` light; `#111318`/`#161920` dark), paired with calibrated clinical semantic bands (Emerald Safe, Amber Monitor/Reduce, Crimson Avoid/High-Risk, Blue LoS-Low) and strict `tabular-nums` alignment.
- **STORY:** Clinicians open directly into their active task, switch effortlessly between Mortality, Length of Stay, Dosing, and Evidence via thumb-reachable navigation (phone) or persistent Navigation Rail + dual-pane layout (ward tablet), trust every boundary through high-contrast native controls, and verify safety warnings at a glance.
- **FIRST VIEWPORT:** Compact Top App Bar (`CirrhoSmart AI` + module context + light/dark toggle >= 48dp), immediate workspace body with edge-to-edge safe insets (single-column scroll on `< 600 dp`; two-pane input/output split on `>= 600 dp`), anchored by a 4-destination Material 3 Navigation Bar (`Mortalitas`, `Lama Rawat`, `Dosis`, `Info & Riset`) or left Navigation Rail on tablets.
- **FORM:** Native Android Material Design 3 Operate Workbench — Candidate 4 of the grounded clinical list (seed key `7eb44c87`), raised with `ikeda-datamatics` tabular-numeric precision & strict `prefers-reduced-motion` discipline and `wayfinding-cartography-signage-terminal-yellow-wayfinding` single-glance decision-junction clarity.
- **FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
