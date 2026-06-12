# Minimal Export-Debug Document For ES-3772

Use this document to capture a PDF export-debug snapshot that exercises all three affected surfaces:

- ToC spacing for numbered headings
- ToF spacing for figure captions
- ToT spacing for table captions

Prefer an uploaded local image or a PlantUML diagram instead of a remote URL if you want the replay to stay independent from network availability.

## Recommended Markdown

```md
# Introduction and overview with a deliberately long chapter heading

This paragraph exists only to make the chapter visible in the main body and the Table of Contents.

## Context and purpose with a deliberately long subheading

This subheading helps confirm that normal outline nesting still works after the ToC split.

| Column | Value |
| --- | --- |
| Alpha | One |
| Beta | Two |

Table: Message field mapping with a deliberately long table caption for spacing verification {#tbl:message-field-mapping}

$$plantuml
@startuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response
@enduml
$$

::Authentication sequence diagram with a deliberately long figure caption for spacing verification {#fig:auth-sequence}

# Second chapter with another deliberately long heading

This second top-level heading makes the ToC check clearer because it produces at least two chapter entries.
```

## Why this fixture is enough

- It creates at least two top-level chapter entries for ToC.
- It creates one numbered table entry for ToT.
- It creates one numbered figure entry for ToF.
- The headings and captions are intentionally long, so spacing and line-wrap behavior are easy to see.

## What to verify in the captured workspace

- `workspace/styles_toc.css` contains the template CSS you exported with.
- `workspace/styles_tof.css` contains the template CSS you exported with.
- `workspace/styles_tot.css` contains the template CSS you exported with.
- `workspace/templates/toc_template.html` uses separate number/title placeholders.
- `workspace/templates/tof_template.html` uses separate number/title placeholders.
- `workspace/templates/tot_template.html` uses separate number/title placeholders.
