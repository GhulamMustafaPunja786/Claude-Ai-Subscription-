# Theme authoring guide

Use this guide when editing this theme. It describes the technical contracts for
layouts, templates, sections, blocks, snippets, settings, styles, and components.
Read every file involved in a change, and verify examples and APIs against current
theme source and platform behavior. Paths in this guide are relative to the theme root.

## Settings-driven styling

Before styling work, inspect the matching theme source for settings-backed tokens,
shared classes and render helpers, styling ownership, and composition patterns.
Verify names and behavior directly in that source. Honor active merchant settings
and preserve merchant-configurable choices.

## Theme map

Keep this architecture when editing the theme. Make changes through the existing
layouts, templates, sections, blocks, snippets, settings, and components.

- `layout/`: document shells that own global markup, shared styles and scripts,
  section groups, and `content_for_header` / `content_for_layout` placement.
- `templates/`: page composition, usually JSON with specialized Liquid exceptions.
  Keep IDs stable because saved merchant configuration depends on them.
- `sections/`: merchant-addable page regions and required page sections. They can
  compose static and dynamic theme blocks.
- `blocks/`: standalone Liquid files for nestable theme components, with their own
  settings and selection rules. Underscore-prefixed blocks are internal building
  blocks. Extend existing blocks when they already own the required responsibility.
- `snippets/`: reusable Liquid fragments called with `render`. Pass caller-local
  variables explicitly because render scope isolates them. Shopify global objects
  remain available, and existing snippet contracts may use them directly. Snippets
  have no merchant schemas.
- `assets/`: shared CSS, JavaScript, and icons. Keep this directory flat.
- `config/`: global theme setting definitions and saved setting data.
- `locales/`: runtime storefront translations and schema translations.
- `schemas/`: schema authoring source when included in the package. Generated schema
  output remains embedded in the matching Liquid files.

Search for an existing section, block, snippet, setting group, style utility, or
component before adding one. Extend the contract that already owns the behavior.

## Merchant settings

Treat settings as public customization APIs. Add them for choices a merchant should
control.

- Use theme settings for shop-wide choices. Use section or block settings for content
  or presentation controlled in that context.
- Keep structural implementation details in code so the available controls produce
  valid combinations.
- Use resource pickers for merchant-selected products, collections, pages, media,
  menus, and links.
- Prefer focused controls, useful defaults, and conditional `visible_if` settings.
- Preserve setting IDs, types, option values, block IDs, and meanings so saved data
  continues to apply.
- Follow nearby schema and platform constraints for new IDs. Existing kebab-case
  logical-spacing IDs are intentional; other settings commonly use snake case.
- Omit `settings` when a component exposes no settings.

Make presets useful starting compositions. Keep preset block keys, `block_order`,
static markers, and nested settings aligned with the rendered tree.

## Liquid composition

Use Liquid for initial rendering. Add JavaScript for behavior beyond semantic HTML
and CSS.

- Use sections for page-level merchant composition, blocks for nestable selectable
  pieces, and snippets for reuse.
- Call snippets with `{% render %}`. Pass every caller-local dependency the snippet
  uses, and read Shopify global objects directly when that is part of the snippet
  contract.
- Use `{% liquid %}` for multiline logic and `#` comments inside that tag.
- Use object dot notation and supported Shopify objects, tags, and filters found in
  current source or platform documentation.
- Render optional content only when it has a value so the output stays meaningful and
  accessible.
- Escape plain merchant strings in HTML and attributes. Preserve allowed markup in
  intentional rich text.
- Include `{{ block.shopify_attributes }}` on the wrapper that represents the
  selectable block.
- Keep generated IDs unique and stable. Append section or block identity when
  multiple instances can appear.
- When editing product forms, preserve variant IDs, availability, quantity rules,
  accelerated checkout behavior, and checkout submit semantics.

### Dynamic and static theme blocks

A dynamic block area renders merchant-managed children in their saved order:

```liquid
{% content_for 'blocks' %}
```

List accepted block types in the containing schema. `@theme` accepts theme blocks,
and `@app` accepts app blocks. Render the dynamic area once per file. Capture it once
when conditional branches use the same output.

A static block places a typed block at a fixed structural location:

```liquid
{% content_for 'block', type: 'group', id: 'static-header' %}
```

- Static describes placement and identity. A static block may still have settings and
  nested blocks.
- Keep its `type` and `id` stable. Align matching preset entries and `static: true`
  metadata when present.
- Use a static block for a required structural component. Use dynamic blocks where
  merchants control child presence and order.
- Pass contextual objects with established `closest.*` arguments when a block needs
  its surrounding product, collection, article, or other resource.

### Documentation contracts

Use `{% doc %}` in snippets and blocks to describe what they render, their typed
parameters, and a realistic example. Document explicit call arguments. Settings read
directly from `block.settings` are part of the block contract rather than snippet
parameters.

For sections, use a contract comment:

```liquid
{% comment %}
  Section contract.
  Describes the region and its responsibility.
  @example
  <!-- Describe how the section is configured or reached -->
{% endcomment %}
```

Keep comments short and explain non-obvious intent or coupling.

## Schema ownership

Sections and theme blocks use JSON between `{% schema %}` and `{% endschema %}` for
settings, presets, accepted blocks, names, and placement rules. Keep rendering-only
files schema-free when they have no schema metadata to declare. Choose the authoring
file from the sources included in the package.

- When a Liquid file has an import marker and matching source under `schemas/`, edit
  the schema source and run the documented schema generation workflow. The embedded
  JSON is generated output.
- In a runnable theme package without matching schema source, edit the embedded JSON.
- Edit `config/settings_schema.json` directly. It is the static global-settings
  schema and sits outside section and block schema generation.
- Follow contributor instructions supplied with a source checkout for its generation
  workflow.
- Keep schema JSON valid. Use literal `t:` references for schema names, labels,
  options, headers, information, placeholders, and preset names.
- Use fields supported for the relevant section, block, preset, or setting type.
- Keep `visible_if` expressions aligned with the IDs and values they reference.
- Recheck presets whenever a setting, accepted block type, or nested composition
  changes.

## Storefront copy, translations, and merchant content

Keep interface language separate from shop-authored content.

- Put runtime interface text in `locales/en.default.json` and apply the `t` filter.
  This includes button states, status, validation, empty states, and accessible
  labels.
- Put schema labels and help text in `locales/en.default.schema.json` and reference
  them with schema `t:` keys.
- Put shop-specific copy, media, and links in settings, blocks, resources, or
  metafields when merchants own that content.
- Treat translation defaults that seed editable settings as merchant content, with
  the setting as the source of truth.
- Keep interpolation at the translation call site and preserve shared contracts.
- Use rich-text keys for intentional translated markup, and keep shared plain-text
  keys plain.

## CSS architecture

Use the theme's existing component CSS and token system. Preserve existing stylesheet
loading paths and verify delivery in rendered pages and section responses; Liquid
stylesheet-tag support and backend delivery are separate contracts. Where Shopify's
[stylesheet subsetting](https://shopify.dev/docs/storefronts/themes/best-practices/performance/stylesheet-subsetting)
is active, it includes `{% stylesheet %}` content from Liquid files actually rendered
on the page. Selection happens at file granularity; selectors follow the normal CSS
cascade. Style ownership therefore controls CSS availability in that delivery path.

- Put static feature and component rules in the owning section, block, or snippet's
  single `{% stylesheet %}` tag.
- Give shared component CSS a reusable style-owner snippet, and render it from each
  necessary consumer or through the renderer they share.
- Keep genuinely global foundations, resets, and utilities in `base.css` and existing
  global assets. Asset stylesheets are loaded explicitly and are outside subsetting.
- Pass dynamic instance values through inline custom properties or Liquid-aware
  `{% style %}` blocks scoped to the owning section, block, or component.
- Follow settings-driven styling patterns in the matching theme source.
- Apply general BEM principles with low-specificity class selectors and shallow
  nesting. Resolve cascade through component scope and source order.
- Use custom properties defined by the theme for colors, spacing, typography, radii,
  and motion.
- Namespace component variables, use logical properties, and verify both LTR and RTL.
- Protect layouts with `min-width: 0`, constrained media, and merchant-text wrapping.
- Use container-aware and intrinsic layouts that respond to their rendered context.
- Animate `transform` and `opacity` where possible. Use the existing motion tokens,
  provide reduced-motion behavior, and keep layout stable.
- Match selector intent and property ordering in adjacent source.

### Color values and active context

Use complete color tokens directly, for example `color: var(--color-foreground)`,
to preserve the configured color's alpha. Follow the active color context and inherited
values so merchant-selected colors remain effective.
For explicit alpha, use `rgb(var(--color-foreground-rgb) / var(--opacity-70))`;
`--opacity-70` is defined in `snippets/theme-styles-variables.liquid`. This applies the
chosen opacity to RGB channels. Verify companions exist and keep complete-color/RGB
pairs aligned when overriding them; check direct-color and alpha-based consumers together.
Read `snippets/color-palette.liquid` for settings-backed colors. For scoped overrides,
reuse `snippets/contrast-override.liquid` with a unique `section_id` and matching
`color-custom-<id>` class. Preserve its brightness-aware opacities and muted/disabled
states; follow its `content` or `ui` preset contract and verify actual contrast.

### Shared CSS owners and render participation

Keep shared feature rules in their Liquid owners. Render those owners to include their
CSS, and preserve owner renders when reusing markup. Preserve these dependencies:

- `snippets/product-card.liquid` renders `product-card-styles`; grid layout belongs to
  `snippets/product-grid.liquid`. Its empty branch renders `product-card-styles` and
  `product-card-gallery-zoom-details-styles` for later results.
- `blocks/add-to-cart.liquid` and `snippets/quick-add.liquid` render
  `add-to-cart-button-styles`; `sections/product-information.liquid` renders it in
  the enabled sticky add-to-cart path. Preserve this owner render when reusing button markup.
- Preserve `variant-picker-styles` in Quick Add's choose-options path and
  `quantity-selector-styles` in quantity, card, and recommendation consumers.
- `snippets/quick-add-modal.liquid` renders `product-media-container-styles` and
  `product-media-gallery-content-styles` before content arrives. Keep
  `deferred-media-video-styles` and `deferred-media-product-model-styles` with the
  video, product-media, and Quick Add consumers that render them.

Keep intentional early owner renders when fragment extraction or hydration bypasses
normal composition. Verify empty-to-populated grids, first-open Quick Add, and media.

## JavaScript and the Component framework

Start with native links, buttons, forms, `details`, and `dialog`. Use `Component` from
`@theme/component` for this theme's feature components that own refs, declarative events,
or interactive state. Preserve deliberate `HTMLElement` and
`DeclarativeShadowElement` cases where their current ownership remains appropriate.

Implement behavior with this theme's existing framework, Shopify platform APIs, and
native browser APIs. Keep the runtime dependency set unchanged.

### Lifecycle

When overriding framework lifecycle methods:

- Call `super.connectedCallback()` before using refs or framework listeners.
- Call `super.updatedCallback()` before reading refs or reinitializing DOM-dependent
  state after section-rendered DOM changes. The base callback refreshes refs.
  Equal subtrees can skip this callback; check render completion separately.
- Call `super.disconnectedCallback()` when disconnecting.
- Clean up every subclass resource: event listeners, timers, observers, animation
  frames, media-query listeners, and in-flight requests. The base class cleans up its
  own observer.
- Use `AbortController` for reliable listener and request cancellation.
- Make reconnects and section re-renders idempotent so listeners stay singular and
  references point to current nodes.

### Refs and events

- Declare ref types with JSDoc. Use `ref="name"` for one element and `ref="name[]"`
  for arrays.
- Treat merchant-dependent and conditional refs as optional and check them before
  use. Add `requiredRefs` when fixed internal markup is essential to the component.
- Use established `on:event` attributes such as `on:click="/handleClick"` for
  framework-routed handlers. Keep handlers public and document event signatures.
- Communicate downward through documented public methods. Communicate upward through
  bubbling events. Keep components independent of parent tag names.
- Use installed `@shopify/events` event classes and `StandardEvents` names for cart
  and product selection. Where an event supplies `event.promise`, await settlement
  and handle rejection before using its result. Read definitions, producers, and
  consumers together; other feature events retain their `@theme/events` contracts.
- Validate event targets and queried elements before using type-specific APIs.
- Use `async` / `await`, early returns, `for...of`, and `URL` /
  `URLSearchParams`.

## Accessibility

Apply accessibility requirements to every component and settings combination.

- Start with semantic HTML and native keyboard behavior. Use ARIA only for additional
  names, relationships, states, or announcements needed beyond native semantics.
- Give every control a name. Keep labels, relationships, states, and errors in sync.
- Preserve visible focus, logical tab order, Escape behavior, modal containment, and
  focus restoration after close or DOM replacement.
- Keep visual order, DOM reading order, and keyboard order aligned.
- Give each independently updated status one scoped live-region owner. Route each
  update through that owner so announcements remain singular.
- Give informative images useful alt text and decorative images empty alt text. Mark
  decorative SVG icons `aria-hidden="true"`.
- Maintain text, control, and focus contrast for merchant-selectable colors.
- Verify zoom, wrapping, reduced motion, touch targets, and RTL layouts.
- Keep navigation, forms, product selection, and purchase paths usable while
  JavaScript loads and when enhancement is unavailable.

## Performance

Plan loading around when markup appears, when the browser discovers each resource,
and when the page first needs it.

- Render static presentation with Liquid and keep client-side work focused on
  interaction.
- Render images with intrinsic `width` and `height`, and provide responsive `widths`
  and `sizes` that match each image's rendered layout. For other media, reserve space
  with intrinsic dimensions or an equivalent aspect ratio.
- Lazy-load below-fold and secondary media. Use eager loading, preload, and high
  fetch priority for verified critical media based on section position and visible
  layout. Recheck those decisions whenever composition changes.
- Load component CSS and feature modules where their matching markup or settings can
  activate them. Load shared global resources once.
- For empty grids, Quick Add, and other deferred markup, ensure required CSS is
  available before showing content. Preserve existing loading paths.
- Full-section insertion can retain nested response CSS naturally. For fragment or
  hydration updates, ensure the response stylesheet reaches the live DOM when needed.
  Opt-in injection defaults to `false` and uses the first `style[data-section-stylesheet]`
  in the response: update the live section's style text or prepend it; absent styles are a no-op.
  Use `morphSection(sectionId, html, { mode: 'hydration', injectStylesheet: true })`
  or `sectionRenderer.renderSection(sectionId, { mode: 'hydration', injectStylesheet: true })`.
  The deferred `hydrate` helper does not opt in; preserve early style-owner renders
  or use an explicit update with injection when it needs missing response CSS.
- Cancel stale requests and keep older responses from replacing newer user intent.
- Preserve section-rendering and hydration contracts. Update the smallest practical
  DOM region.
- Test realistic long text, missing media, large collections, sold-out products, and
  slow-network states because they expose layout and runtime costs.

### Section rendering and hydration

Use `sectionRenderer` and `morphSection` from `@theme/section-renderer`. Pass unprefixed
section IDs; live DOM and response HTML need the matching `shopify-section-<id>` wrapper.
`renderSection` returns HTML and propagates fetch failures. Older implementations
may not await the morph; 4.2.0 awaits the selected morph and propagates its failures.
Await render calls and direct `morphSection` calls, and handle rejections, including
missing-wrapper failures. Verify the intended live DOM and component readiness
separately, especially after skipped or superseded renders. Coordinate competing
requests before direct morphs, which have no renderer stale-update guard.
Superseding a render aborts its controller; fetch receives its `AbortSignal`, and a
superseded call can resolve through a newer render's promise. Check current user intent.

Import `{ hydrate }` from `@theme/section-hydration` and call `hydrate(sectionId)` for
non-critical work. It accepts either ID form, waits for DOM readiness, then schedules
idle work with a `setTimeout` fallback. It skips missing or already hydrated sections
and sets `data-hydrated="true"` after rendering with caching disabled. Its promise
covers scheduling, not completion or worker failures; coordinate dependent work explicitly.
The helper selects `mode: 'hydration'`. Give targets stable, unique, nonempty
`data-hydration-key` values matching exactly in initial and fetched markup. Unmatched
targets are not independently inserted or deleted, but matched targets' attributes and
descendants can change. Choose boundaries that preserve intended state, focus, and refs;
use full mode for structural changes outside matched targets.
Use `sectionRenderer.renderSection(sectionId, { cache: false, mode: 'hydration' })`
or `await morphSection(sectionId, html, { mode: 'hydration' })`; the default mode is `'full'`.

### Module resolution, fetching, and execution

Treat module resolution, early fetching, and execution as separate loading decisions:

- An import-map entry in `snippets/scripts.liquid` makes a stable `@theme/*` specifier
  resolve to an asset URL.
- `modulepreload` fetches a module early.
- A `<script type="module">` or an import reached by an executing module graph runs
  the module and registers its custom elements.

When adding a feature module:

1. Reuse an existing mapped module when it owns the needed behavior.
2. Add an import-map entry when another module imports the asset through `@theme/*`.
3. Connect the feature to an executing module path on every page that renders its
   markup.
4. Gate that path with the relevant markup or setting and execute it once.
5. Keep asset imports and script placement consistent with
   `snippets/scripts.liquid`.

## Verification

Run all applicable checks available for the package, resolve valid findings, and
accurately report unavailable checks.

- Read changed Liquid, schema, locale, CSS, and JavaScript together. Verify that IDs,
  settings, refs, selectors, events, and loading paths agree.
- Run Theme Check with the package's compatible installation and configuration.
  Resolve valid findings in the context of the platform features used by the theme.
- When schema source owns generated output, run its documented generator and verify
  that source and embedded JSON agree.
- Preview affected templates on a development theme when store access and a preview
  tool are available. Check desktop, narrow viewports, settings and section updates,
  empty and populated settings, and a non-default locale or RTL mode when relevant.
- For interactions, verify keyboard and pointer paths, focus movement, live feedback,
  reduced motion, delayed module loading, request failure, and repeated section
  rendering.
- Report unavailable generation, checking, preview, authentication, or representative
  shop data, with the exact command or inspection a maintainer should perform next.
