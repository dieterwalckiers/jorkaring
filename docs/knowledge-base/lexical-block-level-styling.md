# Block-level styling in rich text (Lexical NodeState)

How the **block-style** editor feature lets editors tint, border, pad, and recolor
individual paragraphs/headings inside any `richText` field.

## The gotcha that shaped the design

In Lexical **0.35** (what Payload 3.76 ships), element nodes do **not** serialize
`element.setStyle(...)` to JSON. `ParagraphNode.exportJSON` = `super` (the base
`ElementNode`, which omits style) + `textFormat`/`textStyle`; `HeadingNode.exportJSON`
= `super` + `tag`. So setting a style on a block renders live in the editor but
**silently vanishes on save**. (TextNodes are the exception — they do serialize
`style`, which is how the inline `text-color` feature works.)

The supported way to attach custom, auto-serializing data to a block is the
**NodeState API** (`createState` / `$setState` / `$getState`). This is the same
mechanism Payload's own built-in `textState` feature uses (it targets text nodes;
ours targets top-level block elements).

## Where the data lives

NodeState serializes under the `$` key on the node (`NODE_STATE_KEY`). A styled
paragraph looks like:

```json
{ "type": "paragraph", "version": 1, "children": [...],
  "$": { "blockBg": "theme1", "blockBorder": "theme4", "blockPad": "medium", "blockText": "white" } }
```

- **No DB migration needed** — rich text content is JSONB; nothing in the Postgres
  schema/enums changes.
- **No server-side registration needed for persistence.** Payload does not strip
  unknown node state — unregistered `$` keys land in Lexical's `unknownState` and are
  preserved on export. (Verified by grep: no `NODE_STATE_KEY`/`unknownState`/
  `validateNodeState` stripping in `@payloadcms/richtext-lexical/dist`.)

## Two ways to apply it

1. **Per block** — the styling dropdowns act on `getTopLevelElement()` of each block in
   the selection. Good for tinting a single paragraph/heading. Looks bad across a group
   (each block gets its own box with gaps).
2. **As a group box** — the **BlockGroup** wrapper node (`blockgroup`) wraps the
   selected blocks into one container, and the same dropdowns then style the *wrapper*
   (because `getTopLevelElement()` of a block inside the group returns the group). This
   is the one-clean-box result.

## The pieces

- `payload/src/features/block-style/state.ts` — the `createState` configs
  (`blockBg`, `blockBorder`, `blockPad`, `blockMargin`, `blockLink`), each parsing to
  `string | null`. (Block-level text color was dropped — the inline `text-color`
  feature already covers it.)
- `payload/src/features/block-style/node.ts` — `BlockGroupNode extends ElementNode`,
  a block-level container. `importJSON`/`exportJSON` go through `updateFromJSON` +
  `super.exportJSON()` so the `$` NodeState (and children) round-trip. Registered both
  server-side (`feature.server.ts` → `nodes: [{ node }]`) and client-side
  (`feature.client.tsx` → `nodes: [BlockGroupNode]`) — server registration is what
  lets the node survive save-time validation.
- `payload/src/features/block-style/feature.client.tsx` — six toolbar dropdowns
  (Box / Fill / Border / Padding / Margin / Link). Margin is the outer gap (vs padding's
  inset); Link prompts for a URL (`window.prompt`) and stores it in `blockLink`.
  `getSelectedBlocks()` collects the distinct
  `getTopLevelElement()`s; `wrapInBox`/`removeBox` reparent blocks into/out of a
  `BlockGroupNode`. A `BlockGroupStylePlugin` (mutation listener, à la Payload's
  `textState`) reflects the box styling onto the editor DOM using real theme hex values
  fetched from Site Settings, so it previews live in the admin. Get the editor in a
  plugin via Payload's `useEditorConfigContext()` — the raw
  `@lexical/react/.../LexicalComposerContext` is not a resolvable direct dependency.
- Registered in `payload/src/payload.config.ts` alongside `TextColorFeature()`.
- `web/app/components/RichTextRenderer.vue` — `getBlockClasses(node)` reads `node.$`
  and emits `block-bg-*`, `block-border-*`, `block-pad-*`, `block-margin-*`.
  `maybeWrapBlockLink()` wraps the block/box in an `<a class="block-link">` when
  `blockLink` is set. Applied in the `paragraph`, `heading`, and `blockgroup` cases
  (the last renders a `<div class="block-group …">`).
- `web/app/assets/css/main.css` — the `block-bg-*` / `block-border-*` / `block-pad-*` /
  `block-margin-*` classes, `.block-group`, and `.block-link`. `block-margin-*` uses
  `!important` to win over the per-element default margins (`mb-4`, `.block-group`,
  `.editorial-heading`). `.block-link` is a neutral block-level anchor with a quiet
  `brightness(1.05)` hover (ease-out-cubic; disabled under reduced motion).
