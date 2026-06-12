# ES-3772 Testing Report

## Purpose

This report is for the testing team. It explains what changed in PDF export for ToC/ToF/ToT, which scenarios must be checked, and what result is now expected.

## Feature Summary

The PDF export pipeline now preserves number/prefix and title text as separate runtime fragments for:

- Table of Contents
- Table of Figures
- Table of Tables

This allows template authors to control the spacing between the numbering prefix and the remaining title text through CSS.

The change also includes a backward-compatibility fallback for old user templates that do not define the new CSS selectors. In those templates, the number and title must still remain visibly separated and must not collapse into one glued string such as `1Introduction` or `Figure 1Caption`.

## What Changed Functionally

### Positive behavior

If the PDF template defines the new ToC/ToF/ToT selectors, the gap between number/prefix and title can now be increased through CSS.

Examples:

- ToC: `1` and `Introduction`
- ToF: `Figure 1:` and `Authentication sequence diagram`
- ToT: `Table 1:` and `Message field mapping`

### Regression-safe behavior

If the PDF template does not define the new selectors, export must still produce a readable separator between number/prefix and title.

Examples of correct fallback output:

- `1 Introduction`
- `2.1 Context and purpose`
- `Figure 1: Diagram caption`
- `Table 1: Table caption`

Examples of incorrect output:

- `1Introduction`
- `2.1Context and purpose`
- `Figure 1:Diagram caption`
- `Table 1:Table caption`

## Test Inputs

Use a document that contains all three surfaces:

- at least two top-level chapter headings for ToC
- at least one table with caption for ToT
- at least one figure or PlantUML diagram with caption for ToF

The task folder already contains a suitable fixture draft:

- `.tasks/es-3772-pdf-template-ability-to-increase-space-between-c-in-toc/export-debug-minimal-document.md`

The final test document should use only the actual content under `Recommended Markdown`, without explanatory sections if a clean ToC is preferred.

## Template Variants To Test

### Variant 1: Positive ToC spacing case

Template:

- `.tasks/es-3772-pdf-template-ability-to-increase-space-between-c-in-toc/template`

Important property:

- `styles_toc.css` sets a visibly larger `margin-right` for `.toc-section-number`

Expected effect:

- ToC chapter number and chapter title have a clearly increased gap
- ToF and ToT remain functional

### Variant 2: Positive ToF spacing case

Template:

- `.tasks/es-3772-pdf-template-ability-to-increase-space-between-c-in-toc/template`

Important property:

- `styles_tof.css` sets a visibly larger `margin-right` for `.tof-item-number`

Expected effect:

- ToF figure prefix and figure caption text have a clearly increased gap

### Variant 3: Regression case without ToF properties

Template:

- `.tasks/es-3772-pdf-template-ability-to-increase-space-between-c-in-toc/template-regression-no-tof-properties`

Important difference:

- `styles_tof.css` does not contain the new `.tof-item-number` and `.tof-item-title` selectors

Expected effect:

- ToF still shows a visible separator between figure prefix and title
- The text must not collapse into a glued string
- The gap may be smaller than in the styled positive case, but readability must be preserved

## Recommended Test Procedure

1. Export the same document with the positive template.
2. Check ToC, ToF, and ToT in the produced PDF.
3. Confirm that the intended larger gap is visible where the template defines it.
4. Export the same document with the regression template that removes the new ToF properties.
5. Confirm that ToF still keeps prefix and title separated even without the new selectors.
6. If needed, capture an export-debug snapshot and verify the generated workspace contains the expected template files and styles.

## Expected Results By Surface

### Table of Contents

- With the styled template, chapter numbers and titles have an intentionally larger gap.
- Without relying on CSS, number and title must still remain separated.
- Numbered subheadings such as `1.1` and `2.1` must also remain separated from their titles.

### Table of Figures

- With the styled template, `Figure N` and the caption text have an intentionally larger gap.
- With the regression template, the gap may fall back to the minimum readable separator, but the text must not merge.

### Table of Tables

- `Table N` and the caption text must remain separated.
- The behavior should match the same runtime contract used for ToC/ToF.

## Export-Debug Snapshot Checks

If a snapshot is captured, verify:

- `workspace/templates/toc_template.html` uses `%(numberHtml)s%(titleHtml)s`
- `workspace/templates/tof_template.html` uses `%(numberHtml)s%(titleHtml)s`
- `workspace/templates/tot_template.html` uses `%(numberHtml)s%(titleHtml)s`
- `workspace/styles_toc.css`, `styles_tof.css`, and `styles_tot.css` match the template variant used for the test

## Final Acceptance

The feature should be considered verified when:

- styled templates visibly increase the gap where expected
- old-style templates without the new properties still keep number/prefix and title text separated
- no surface shows merged strings like `1Introduction` or `Figure 1Caption`
