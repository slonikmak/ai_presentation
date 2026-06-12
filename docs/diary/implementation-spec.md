# ES-3772: PDF Template: ability to increase space between number and title in ToC/ToF/ToT (BE)

## Context

The PDF template already lets authors style visible chapter headings and running headers through separate `header-section-number` and `header-section-title` nodes. The new Jira task asks for the same practical outcome on the generated Table of Contents, Table of Figures, and Table of Tables pages: template authors must be able to control the gap between the numbering prefix and the remaining title text through `styles_toc.css`, `styles_tof.css`, and `styles_tot.css`.

The current PDF ToX pages do not preserve that split. They are generated after WeasyPrint renders the main document, using bookmark labels flattened into one `linkText` string. Because the title prefix and the title body are concatenated before the ToX HTML templates are filled, the CSS surface has no stable DOM node that can receive spacing or independent styling.

This task is therefore a PDF-outline rendering change, not a storage or REST-contract change. It is related to `.tasks/es-2676-pdf-template-ability-to-increase-space-between-c`, but it affects the ToC/ToF/ToT generation path instead of visible `h1` headings or running headers.

## Goals

- Preserve numbering and title text as separate styling targets in PDF ToC pages.
- Preserve figure/table prefixes and caption text as separate styling targets in PDF ToF and ToT pages.
- Add an additive DOM and CSS contract so template authors can widen the number/title gap without backend string rewrites per template.
- Keep the scope limited to PDF ToX generation and default PDF template assets.

## Non-Goals

- No changes to document body heading rendering or running headers beyond the already existing `ES-2676` behavior.
- No changes to PDF template upload, download, selection, or ZIP storage contracts.
- No changes to HTML export or DOCX export.
- No changes to Pandoc numbering generation or bookmark ownership.
- No database schema, entity, or Liquibase changes.

## Current State

- `dev_setup/docker/processing-app/html_to_pdf_convert_with_weasyprint.py` renders the main document and then creates ToC/ToF/ToT pages through `createToXDocument(...)`.
- `generateOutlineStr(...)` iterates over `page.bookmarks` and passes a single `linkText` value into the ToX HTML templates.
- The ToX templates in `services/application-service/src/main/resources/conversion/default_templates/pdf/custom/templates/` render that one flat value inside the clickable title block.
- The default stylesheets `styles_toc.css`, `styles_tof.css`, and `styles_tot.css` style the overall line and text block, but they do not receive separate DOM nodes for number/prefix versus title body.
- For document headings, `process_section_headers(...)` already normalizes `h1` nodes into `header-section-number` and `header-section-title`, but that structure is not reused by ToX generation because ToX is built later from WeasyPrint bookmarks, not from the original heading DOM.
- Figure and table titles become bookmark labels through `bookmark-label: attr(title)` on `.numbered-figure` and `.numbered-table`, so ToF/ToT entries also arrive as one flattened string such as `Figure 4: Caption text`.

## Target Solution

Keep the change inside the PDF ToX generation stage in `html_to_pdf_convert_with_weasyprint.py`. Instead of passing only one `linkText` placeholder to the templates, the backend should derive a stable split between prefix and title body before rendering the ToX HTML.

The split rules are:

- ToC entries: separate a leading section-number token such as `1`, `1.2`, or `2.4.1` from the remaining heading title.
- ToF entries: separate a leading `Figure <n>` or `Figure <n>:` prefix from the remaining caption text.
- ToT entries: separate a leading `Table <n>` or `Table <n>:` prefix from the remaining caption text.

The resulting HTML contract should expose separate spans for prefix and title body in all three ToX templates. The default CSS should then add spacing rules on the prefix element, preserving backward compatibility by keeping the existing outer selectors intact.

This approach keeps the feature aligned with the real PDF runtime path, avoids changing shared HTML markup processing, and provides a direct template-facing contract where the Jira request expects it.

## Contracts

### Runtime Contract

- PDF ToX generation must produce separate DOM nodes for prefix and title body when the bookmark text matches the supported split patterns.
- If a bookmark text does not match a supported split pattern, ToX generation must keep the entry exportable and render the full text as the title body without creating an invalid empty prefix node.
- The split must be applied only to the generated ToC/ToF/ToT outline pages, not to the body document content.

### Template Contract

- `toc_template.html` must expose separate prefix/title spans for ToC entries.
- `tof_template.html` must expose separate prefix/title spans for ToF entries.
- `tot_template.html` must expose separate prefix/title spans for ToT entries.
- The default `styles_toc.css`, `styles_tof.css`, and `styles_tot.css` must include additive selectors for the new prefix/title nodes so spacing can be controlled through CSS.

### Compatibility Contract

- Existing templates that do not override the new selectors must still export successfully.
- Existing outer selectors such as `.book-toc-item-title`, `.book-tof-item-title`, `.book-tot-item-title`, `.text`, and `.text-inner` must remain intact.
- Existing page-number placement and outline nesting must remain unchanged.

### Validation Contract

- Prefix/title spacing must be controlled by DOM structure and CSS, not by hard-coded literal spaces inserted into one text string.
- Bookmark texts that do not contain a recognized prefix must remain readable and must not lose text content.
- ToF/ToT splitting must handle both values with and without a colon after the figure/table number.

## Business Logic

- For each bookmark line, the backend determines which ToX surface is being rendered based on the `anchorIdPrefix` argument already used by `generateOutlineStr(...)`.
- For ToC generation, a leading dotted numeric token is treated as the numbering prefix only when it appears at the start of the bookmark title and is followed by whitespace plus non-empty title text.
- For ToF generation, a leading `Figure <number>` token is treated as the prefix. The optional trailing colon belongs to the prefix.
- For ToT generation, a leading `Table <number>` token is treated as the prefix. The optional trailing colon belongs to the prefix.
- If the title contains no body text after the prefix, the backend must keep the whole string as title text instead of emitting a prefix-only entry.
- Indentation by heading level remains unchanged and continues to be rendered before the entry content in the ToX templates.
- Page numbers, anchors, and bookmark filtering behavior remain unchanged.

## Invariants

- `page.bookmarks` remains the source for ToC/ToF/ToT entries in PDF export.
- Figure/table bookmark labels remain derived from existing caption/title generation logic.
- No changes to API modules, controllers, services, entities, or repositories are required.
- Main document heading numbering and running-header generation behavior stays unchanged.

## API Changes

No API changes.

## Data/Storage and DB Migrations

No data model changes and no DB migrations. The feature changes only runtime ToX HTML generation and default template assets inside the existing PDF template bundle.

## Runtime Integration

- `dev_setup/docker/processing-app/html_to_pdf_convert_with_weasyprint.py`
  - extend `generateOutlineStr(...)` to pass structured prefix/title placeholders into ToX templates;
  - add a helper that splits bookmark labels according to ToC/ToF/ToT rules;
  - keep outline generation compatible with existing indentation, anchor, and page-number logic.
- `services/application-service/src/main/resources/conversion/default_templates/pdf/custom/templates/toc_template.html`
  - render separate prefix/title spans for ToC entries.
- `services/application-service/src/main/resources/conversion/default_templates/pdf/custom/templates/tof_template.html`
  - render separate prefix/title spans for ToF entries.
- `services/application-service/src/main/resources/conversion/default_templates/pdf/custom/templates/tot_template.html`
  - render separate prefix/title spans for ToT entries.
- `services/application-service/src/main/resources/conversion/default_templates/pdf/custom/styles_toc.css`
  - add selectors for ToC prefix/title spacing.
- `services/application-service/src/main/resources/conversion/default_templates/pdf/custom/styles_tof.css`
  - add selectors for ToF prefix/title spacing.
- `services/application-service/src/main/resources/conversion/default_templates/pdf/custom/styles_tot.css`
  - add selectors for ToT prefix/title spacing.

## Test Contract

- Unit coverage in `dev_setup/docker/processing-app/tests/test_html_to_pdf_convert_with_weasyprint.py` must verify prefix/title splitting for:
  - numbered ToC entries;
  - `Figure N` ToF entries with and without a colon;
  - `Table N` ToT entries with and without a colon;
  - titles that should remain unsplit.
- Unit coverage must verify generated outline HTML contains separate prefix/title nodes and does not fall back to a single concatenated text placeholder when a supported split exists.
- Regression coverage must verify unsupported strings still produce a valid entry without dropped text.
- No new Java integration tests are required for this task if the Python-unit coverage directly exercises the real ToX HTML generation helper used by export.

## Decisions / Open Questions

- Decision: implement the split in `html_to_pdf_convert_with_weasyprint.py`, not in `html_markup_processing.py`, because ToX pages are generated from WeasyPrint bookmarks after the main document render.
- Decision: keep the new contract additive by introducing dedicated ToX prefix/title spans while preserving the existing surrounding template structure.
- Decision: keep the split rules narrow and deterministic for ToC, ToF, and ToT only; do not attempt a generic NLP-like parser for arbitrary bookmark titles.
- Open question: none for the current scope. If product later wants independent styling for deeper semantic fragments inside captions, that should be a separate feature.
