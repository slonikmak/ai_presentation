# Export-Debug WSL Replay For ES-3772

## Capture checklist

1. Export the minimal document from `.tasks/es-3772-pdf-template-ability-to-increase-space-between-c-in-toc/export-debug-minimal-document.md` to PDF.
2. Use a PDF template where ToC, ToF, and ToT are enabled.
3. Make the spacing change obvious in:
   - `styles_toc.css`
   - `styles_tof.css`
   - `styles_tot.css`
4. Keep `S_BOX_EXPORT_DEBUG_SNAPSHOT_ENABLED=true` in the processing app environment so the snapshot is saved.

## Snapshot files to inspect first

- `export-debug-snapshots/<latest>/command.sh`
- `export-debug-snapshots/<latest>/manifest.properties`
- `export-debug-snapshots/<latest>/workspace/input.md`
- `export-debug-snapshots/<latest>/workspace/styles_toc.css`
- `export-debug-snapshots/<latest>/workspace/styles_tof.css`
- `export-debug-snapshots/<latest>/workspace/styles_tot.css`

## WSL preparation

Processing utilities are expected in `/conversion_utils`.

They were synced with:

`powershell -NoProfile -ExecutionPolicy Bypass -File dev_setup/docker/processing-app/sync-processing-utils-to-wsl.ps1`

## Recommended replay order

1. Generate `main.html` from `workspace/input.md` with the snapshot `command.sh`.
2. Run `/conversion_utils/html_markup_processing.py` on `main.html`.
3. Run `/conversion_utils/html_to_pdf_convert_with_weasyprint.py` only after the HTML stages look correct.

## What to check for this task

- In the final generated ToC HTML, chapter entries should render separate number/title spans.
- In the final generated ToF HTML, figure entries should render separate prefix/title spans.
- In the final generated ToT HTML, table entries should render separate prefix/title spans.
- Spacing should come from CSS margins, not from literal hard-coded spaces in one text node.
