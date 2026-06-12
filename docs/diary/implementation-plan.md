# ES-3772 Implementation Plan

## Strategy

Deliver the feature in three stages: first lock the desired runtime behavior in Python unit tests, then extend the PDF ToX generation path to emit separate prefix/title nodes, and finally expose the new contract through the default ToX templates and CSS. This order keeps the change scoped to the real PDF runtime path described in `implementation-spec.md` and minimizes the risk of changing unrelated export behavior.

Commit grouping should follow the same order: tests, runtime split logic, template/CSS contract.

## Stages

### Stage 1: Lock the ToX split contract with regression tests

**Goal**

Define executable coverage for the bookmark prefix/title split rules from `implementation-spec.md -> Contracts` and `implementation-spec.md -> Test Contract`.

**Affected modules and new packages**

- Modify: `dev_setup/docker/processing-app/tests/test_html_to_pdf_convert_with_weasyprint.py`

**New classes/interfaces**

- No new production classes.
- Add new Python `unittest.TestCase` coverage for ToX split behavior.

**Implementation steps**

1. Import the real ToX helper module already loaded by the test file.
2. Add unit tests for the raw split helper behavior:
   - ToC `1 Introduction` -> prefix `1`, title `Introduction`
   - ToF `Figure 4: Message flow` -> prefix `Figure 4:`, title `Message flow`
   - ToT `Table 7 Message fields` -> prefix `Table 7`, title `Message fields`
   - unsupported `Appendix` -> no prefix, title `Appendix`
3. Add a generated-outline assertion that exercises `generateOutlineStr(...)` or the extracted helper path and verifies separate prefix/title spans exist in the resulting HTML for supported split cases.

**Test plan**

- Run the Python unit test file directly.
- Confirm the new tests fail before implementation because the split helper or output placeholders do not yet exist.

**Definition of Done**

- Tests express the required split rules and fail for the expected missing-behavior reason.

### Stage 2: Implement structured ToX prefix/title generation

**Goal**

Extend PDF outline generation so ToC/ToF/ToT entries expose a stable prefix/title split according to `implementation-spec.md -> Target Solution` and `Business Logic`.

**Affected modules and new packages**

- Modify: `dev_setup/docker/processing-app/html_to_pdf_convert_with_weasyprint.py`

**New classes/interfaces**

- No new files.
- Add small helper functions in the existing Python module for ToX label splitting and HTML escaping.

**Implementation steps**

1. Add a helper that receives bookmark title plus `anchorIdPrefix` and returns `prefix` and `title` according to ToC/ToF/ToT rules.
2. Keep unsupported values and malformed prefix-only values unsplit so no entry loses content.
3. Update `generateOutlineStr(...)` to pass both legacy-safe title text and new structured placeholders into the HTML templates.
4. Ensure all dynamic text injected into template placeholders is escaped consistently for HTML safety.

**Test plan**

- Re-run the Python unit tests from Stage 1.
- Add or keep assertions around generated HTML to verify supported split cases now render separate nodes.

**Definition of Done**

- ToX outline generation emits structured prefix/title placeholders and the Stage 1 tests pass.

### Stage 3: Expose the template contract in default ToX assets

**Goal**

Make the new runtime structure configurable by default-template CSS according to `implementation-spec.md -> Template Contract`.

**Affected modules and new packages**

- Modify: `services/application-service/src/main/resources/conversion/default_templates/pdf/custom/templates/toc_template.html`
- Modify: `services/application-service/src/main/resources/conversion/default_templates/pdf/custom/templates/tof_template.html`
- Modify: `services/application-service/src/main/resources/conversion/default_templates/pdf/custom/templates/tot_template.html`
- Modify: `services/application-service/src/main/resources/conversion/default_templates/pdf/custom/styles_toc.css`
- Modify: `services/application-service/src/main/resources/conversion/default_templates/pdf/custom/styles_tof.css`
- Modify: `services/application-service/src/main/resources/conversion/default_templates/pdf/custom/styles_tot.css`

**New classes/interfaces**

- No new classes.

**Implementation steps**

1. Update each ToX template so the clickable text block contains separate prefix/title spans inside the existing `.text-inner` wrapper.
2. Preserve existing outer wrappers, indentation placeholder, and page-number markup to avoid layout regressions.
3. Add additive CSS selectors for the new prefix elements with right-margin spacing and keep title elements inline.
4. Avoid removing or renaming existing selectors that current templates may still depend on.

**Test plan**

- Re-run the Python unit tests to ensure the updated template placeholders still match the generated HTML contract.
- Manually inspect the final template files for consistent class naming across ToC/ToF/ToT.

**Definition of Done**

- Default ToX templates render separate prefix/title nodes and CSS exposes spacing control without changing outer layout structure.

## Risks and Mitigation

- Risk: ToF/ToT bookmark labels may vary between `Figure 1 Caption` and `Figure 1: Caption`.
  - Mitigation: support both formats in the split helper and keep unmatched labels unsplit.
- Risk: injecting new placeholders into old templates could break export if escaping or placeholder naming is inconsistent.
  - Mitigation: keep placeholder generation centralized in one helper path and cover resulting HTML in Python tests.
- Risk: CSS changes may unintentionally shift existing ToX line wrapping.
  - Mitigation: keep existing wrappers untouched and add only inline prefix/title selectors with minimal spacing rules.

## Milestones

- Milestone 1: Python regression tests fail on missing ToX split behavior.
- Milestone 2: Python regression tests pass after `html_to_pdf_convert_with_weasyprint.py` emits structured prefix/title placeholders.
- Milestone 3: Default ToX templates and CSS expose the new styling contract and all targeted tests still pass.
