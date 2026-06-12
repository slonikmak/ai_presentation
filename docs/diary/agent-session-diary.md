# Дневник одной агентской сессии: ES-3772

Ниже черновик в формате "дневник сессии". Я пишу от первого лица агента, но оставляю человека как активного участника, потому что именно в таких сессиях хорошо видно, что агентская разработка не автономная магия, а итеративная связка "человек + инструменты + репозиторий + проверки".

## 1. Входная точка

Пользователь пришел с задачей:

> Загрузи issue `ES-3772`, изучи и предложи вариант реализации. Эта фича связана с `.tasks/es-2676-pdf-template-ability-to-increase-space-between-c`

Я начал не с кода. Сначала мне нужно было понять контекст: что за Jira issue, что уже известно по связанной задаче, и где в репозитории живет PDF export pipeline.

Я активировал скилл `jira-issue`, потому что пользователь дал ссылку на Jira. Это важный момент: я не стал вручную пересказывать URL или гадать по названию, а использовал уже существующий локальный рабочий процесс для загрузки issue. Параллельно я прочитал старые task-документы по `ES-2676`.

Из старой задачи быстро стало ясно: `ES-2676` была про spacing между номером главы и заголовком в теле PDF и running headers. Там уже был важный архитектурный вывод: номер и title нельзя оставлять одной строкой, их нужно разделять в DOM, чтобы CSS мог управлять spacing.

Но `ES-3772` оказалась другой поверхностью. Формулировка Jira говорила:

> Add the ability to control space between the heading chapter number and title in:
> `styles_toc.css`, `styles_tof.css`, `styles_tot.css`

То есть задача не про body headings, а про generated outline pages: Table of Contents, Table of Figures, Table of Tables.

[Саморефлексия: здесь хорошо сработала связка Jira + `.tasks`. Без старой задачи можно было бы начать менять не тот слой пайплайна.]

## 2. Исследование пайплайна

Я пошел смотреть код PDF export. Ключевой файл оказался:

`dev_setup/docker/processing-app/html_to_pdf_convert_with_weasyprint.py`

В нем есть генерация ToC/ToF/ToT через `generateOutlineStr(...)`. Эта функция берет `page.bookmarks` из WeasyPrint и подставляет один плоский `linkText` в HTML templates:

```text
%(indent)s%(linkText)s
```

Это и было ядро проблемы. Даже если Pandoc или body HTML где-то содержит отдельный `span.header-section-number`, ToC/ToF/ToT строятся позже, уже из bookmark labels. На этой стадии number/title снова превращались в одну строку.

Я прочитал шаблоны:

- `toc_template.html`
- `tof_template.html`
- `tot_template.html`

И соответствующие CSS:

- `styles_toc.css`
- `styles_tof.css`
- `styles_tot.css`

Везде был один текстовый placeholder. Значит template author физически не мог настроить spacing между номером и текстом отдельно, потому что в DOM не было двух элементов.

[Саморефлексия: это хороший пример, почему агенту нужно смотреть реальный runtime path, а не только "логически похожий" код. Старый фикс для `h1` уже существовал, но ToC генерировался другим путем.]

## 3. Проектирование через локальные документы

Пользователь сказал:

> Да, сделай локальные документы и реализуй

Я использовал скиллы `implementation-spec` и `implementation-plan`. В этом репозитории есть привычка фиксировать задачу в `.tasks`, поэтому я создал локальную папку:

`.tasks/es-3772-pdf-template-ability-to-increase-space-between-c-in-toc/`

Туда легли:

- `task.md`
- `implementation-spec.md`
- `implementation-plan.md`

В spec я зафиксировал главную архитектурную идею:

PDF ToX generation должен передавать в шаблоны не только `linkText`, а структурированные placeholders:

- `numberHtml`
- `titleHtml`

Для ToC split должен работать по heading number:

```text
1 Introduction
1.2 Context
```

Для ToF:

```text
Figure 1: Diagram caption
```

Для ToT:

```text
Table 1: Mapping caption
```

План был простой: сначала тесты, потом runtime helper, потом шаблоны и CSS.

[Саморефлексия: documentation-first здесь не бюрократия. Это помогло удержать границы задачи: не менять API, не менять storage, не трогать HTML/DOCX export.]

## 4. Реализация и первый зеленый тест

Перед production-кодом я добавил Python unit tests в существующий test-файл для processing script.

Тесты проверяли:

- `1.2 Introduction and Scope` split на `1.2` и `Introduction and Scope`
- `Figure 4: Message flow` split на `Figure 4:` и `Message flow`
- `Table 7 Message fields` split на `Table 7` и `Message fields`
- unsupported value остается без split
- generated outline HTML содержит отдельные spans

Сначала тесты упали ожидаемо: helper `split_outline_title` еще не существовал.

Потом я добавил реализацию:

- `split_outline_title(...)`
- `split_caption_outline_title(...)`
- `build_outline_number_html(...)`
- `build_outline_title_html(...)`
- class-name helpers для ToC/ToF/ToT

После этого тесты прошли.

Дальше я обновил templates:

```text
%(indent)s%(numberHtml)s%(titleHtml)s
```

И CSS добавил selectors вроде:

```css
.book-toc-item-title .toc-section-number {
    display: inline;
    margin-right: 0.45em;
}

.book-toc-item-title .toc-section-title {
    display: inline;
}
```

То же самое для ToF и ToT.

[Саморефлексия: тут можно было бы иметь генератор "template contract test", который автоматически проверяет, что все default templates используют новые placeholders.]

## 5. Первый ручной export и задача для QA

Мы решили проверить через `export-debug-snapshot`. Для этого я использовал скилл `export-debug-wsl`.

Я синхронизировал processing scripts в WSL:

```text
/conversion_utils/html_markup_processing.py
/conversion_utils/html_to_pdf_convert_with_weasyprint.py
```

Потом подготовил минимальный markdown-документ для проверки всех трех поверхностей:

- несколько `#` и `##` headings для ToC
- таблица с caption для ToT
- PlantUML или image с caption для ToF

Я также сделал шаблон в `.tasks/.../template`, где для первого кейса ToC gap был увеличен:

```css
.toc-section-number {
    margin-right: 1.2em;
}
```

Пользователь прогнал export и сказал:

> первый экспорт прошел

Потом:

> pdf выглядит хорошо. проверь последний снапшот

Я проверил snapshot. В workspace действительно были:

- `styles_toc.css` с `margin-right: 1.2em`
- `toc_template.html` с `%(numberHtml)s%(titleHtml)s`

Первый positive case был подтвержден.

[Саморефлексия: export-debug snapshot - очень сильная техника. Он позволяет проверить не только "PDF выглядит хорошо", но и что именно попало в runtime workspace.]

## 6. Backward compatibility: первая пойманная регрессия

Пользователь заметил важную вещь:

> сейчас в toc если не задать стили то номер сливается с текстом. Это ломает старые шаблоны пользователей.

Это был правильный product-level риск. Новая DOM-структура сама по себе не гарантировала spacing, если старый пользовательский CSS не знает про новые selectors.

Я добавил fallback: если split произошел, title fragment должен начинаться с separator. Сначала я поставил обычный пробел:

```html
<span class="toc-section-title"> Introduction</span>
```

Тесты прошли, но позже реальный PDF показал, что этого недостаточно. HTML/CSS rendering может схлопнуть обычный пробел.

Тогда я заменил fallback на `&nbsp;`:

```html
<span class="toc-section-title">&nbsp;Introduction</span>
```

И обновил тесты.

[Саморефлексия: тут важный урок для агентской разработки: unit test может подтвердить строку, но browser/PDF renderer может вести себя иначе. Для layout-регрессий нужен runtime/snapshot feedback.]

## 7. Второй кейс и regression template

Пользователь попросил проверить второй кейс. Сначала я неправильно понял и усилил ToF positive case:

```css
.tof-item-number {
    margin-right: 1.2em;
}
```

Пользователь уточнил:

> Но я имел ввиду проверить регрессию если свойств нет

Это поменяло задачу. Нужно было не увеличить spacing, а симулировать старый пользовательский шаблон, где новых selectors вообще нет.

Я сделал отдельный regression-template:

`template-regression-no-tof-properties`

В нем удалил из `styles_tof.css` новые selectors:

- `.tof-item-number`
- `.tof-item-title`

И оставил runtime fallback как единственный механизм разделения.

[Саморефлексия: здесь можно было бы иметь отдельный skill "make regression template", который создает копию template bundle и удаляет заданные selectors для backward compatibility проверки.]

## 8. Вторая пойманная регрессия: WeasyPrint bookmark без пробела

Пользователь прислал screenshot:

> Снова плохо. Выглядит так: `1Minimal Export-Debug Document For ES-3772`

На первый взгляд это выглядело так, будто `&nbsp;` fallback не сработал. Я проверил snapshot:

- `styles_toc.css` был правильный
- `toc_template.html` был правильный
- `/conversion_utils/html_to_pdf_convert_with_weasyprint.py` уже содержал `&nbsp;`

Значит проблема была глубже.

Я сделал replay snapshot pipeline в WSL и вывел фактический generated ToC HTML. Там обнаружилось:

```html
<span class='toc-section-title'>1Minimal Export-Debug Document For ES-3772</span>
```

То есть split вообще не сработал для top-level headings.

Причина: WeasyPrint bookmark для `h1` отдавал не:

```text
1 Minimal Export-Debug Document
```

а:

```text
1Minimal Export-Debug Document
```

А мой parser ждал пробел после номера. Для `h2` он работал, потому что там было `1.1 Recommended Markdown`, а для `h1` нет.

Я добавил тест:

```text
2Introduction and Scope
```

И изменил ToC split так, чтобы он поддерживал обе формы:

- `1 Introduction`
- `1Introduction`
- `1.2 Introduction`

После этого тесты снова прошли, скрипт был залит в WSL, пользователь сделал новый export и сказал:

> готово. выглядит хорошо

[Саморефлексия: это самый важный момент кейса. Агент не должен "доказывать", что код правильный, если PDF показывает обратное. Нужно дойти до фактического HTML, который попал в renderer.]

## 9. Отчет для QA

Пользователь попросил:

> Мне нужен отчет для команды тестирования о том что и как проверить, какой теперь эффект ожидается

Я создал `testing-report.md` в task folder. В нем описал:

- что изменилось функционально
- positive behavior
- regression-safe behavior
- какие template variants проверить
- какие outputs считаются правильными
- какие outputs считаются регрессией

Потом пользователь попросил короткий Jira comment без ссылок на локальные файлы. Я подготовил текст для Jira.

Основные acceptance criteria:

- styled templates visibly increase spacing
- old templates without new properties still produce readable output
- no ToC/ToF/ToT entry merges number/prefix with title text

[Саморефлексия: генерация QA-коммента из task-local testing report - хороший кандидат на автоматизацию. Можно сделать skill, который берет `implementation-spec`, `testing-report`, git diff и выдает Jira-ready comment.]

## 10. Commit и push

В конце пользователь сказал:

> Теперь коммит с коротким сообщением, начинающимся с `[task-id]` и пуш

Я проверил `git status`. В рабочем дереве были посторонние изменения:

- `DictionaryStorageTest.kt`
- `agents-workflow/`

Я не стал их трогать. В commit попали только файлы, относящиеся к ES-3772:

- Python processing script
- Python regression tests
- default PDF ToC/ToF/ToT templates
- default PDF ToC/ToF/ToT CSS

Commit:

```text
[ES-3772] Fix PDF ToX spacing
```

Hash:

```text
6b8b91806
```

Push ушел в:

```text
origin/development
```

[Саморефлексия: dirty worktree - нормальное состояние реальной разработки. Агент должен уметь коммитить только свой scope, не "убирая" чужие изменения.]

## 11. QA issue после push: старый `%(linkText)s`

После push работа не закончилась. Пользователь вернулся с новым QA-сценарием:

> Я загрузил кастомный шаблон с qa `.tasks/es-3772-pdf-template-ability-to-increase-space-between-c-in-toc/PDF-Template-NASDAQ-20260430 - SGX Iris-ST (1)` и сделал экспорт. Результат: текст toc снова слит `1Minimal Export-Debug Document For ES-3772`.

На этот раз проблема была не в default template и не в `numberHtml/titleHtml`. Я снова пошел через `systematic-debugging` и `export-debug-wsl`: сначала проверил свежий snapshot, потом сам QA template.

Ключевая находка была в `toc_template.html` кастомного NASDAQ-шаблона:

```text
%(indent)s%(linkText)s
```

Это был старый template contract. Он вообще не использовал новые placeholders:

```text
%(numberHtml)s%(titleHtml)s
```

Значит наш предыдущий fallback внутри `titleHtml` не мог помочь: старый шаблон обходил новый DOM-контракт полностью и продолжал получать legacy `linkText`.

Я добавил регрессионный тест ровно на этот сценарий:

```text
template = "<li><a href='%(refAddr)s'>%(linkText)s</a></li>"
bookmark = "1Introduction"
expected = "1&nbsp;Introduction"
```

Тест сначала упал:

```text
AssertionError: '>1&nbsp;Introduction</a>' not found in "<li><a href='#intro'>1Introduction</a></li>"
```

Это было хорошее падение: оно точно воспроизводило QA issue.

После этого я изменил `generateOutlineStr(...)`: legacy `linkText` теперь тоже строится через тот же split, что и новый structured output. Для старых шаблонов это означает:

```html
1&nbsp;Minimal Export-Debug Document For ES-3772
```

А для новых шаблонов по-прежнему доступны отдельные:

```text
numberHtml
titleHtml
```

Я прогнал Python tests:

```text
Ran 9 tests ... OK
```

Потом синхронизировал исправленный processing script в WSL `/conversion_utils` и сделал replay последнего QA snapshot. Replay показал фактический HTML:

```html
1&nbsp;Minimal Export-Debug Document For ES-3772
```

После ручного экспорта пользователь подтвердил:

> вроде ок

Я сделал второй scoped commit:

```text
[ES-3772] Preserve legacy ToC spacing
```

Hash:

```text
d4c77cb57
```

И запушил его в `origin/development`.

[Саморефлексия: первая версия backward compatibility покрывала "старый CSS с новым template", но не "старый template с legacy placeholder". Это полезное различие: совместимость нужно проверять не только на уровне CSS-свойств, но и на уровне template placeholders.]

## 12. Что эта сессия показывает про агентскую разработку

Это был не линейный сценарий "получил задачу - написал код - готово".

Было несколько циклов:

1. Jira и старая task-документация помогли быстро определить домен.
2. Код показал, что настоящая точка изменения не там, где похожая старая задача.
3. Implementation spec и plan зафиксировали границы.
4. Unit tests поймали базовую логику split.
5. Export-debug snapshot проверил реальный runtime.
6. Пользовательская визуальная проверка поймала backward compatibility проблему.
7. Replay snapshot в WSL показал фактический generated HTML.
8. Второй фикс учел особенность WeasyPrint bookmark labels.
9. QA report и Jira comment превратили техническую работу в проверяемый процесс.
10. Первый commit был scoped, с учетом грязного рабочего дерева.
11. QA template после push показал еще один compatibility gap: старый `%(linkText)s`.
12. Новый regression test закрепил старый template contract, а второй commit закрыл этот сценарий.

Главный вывод: агентская разработка сильна не потому, что агент "сам все сделал", а потому что он может удерживать много контекста одновременно: Jira, локальные docs, code path, тесты, WSL tooling, export snapshots, пользовательскую обратную связь и git hygiene.

Но качество появилось только там, где были проверки. Визуальная обратная связь пользователя была такой же важной частью системы, как unit tests и snapshot replay.

## 13. Внешняя рефлексия: взгляд второго агента

Этот раздел написан другим агентом, который не участвовал в сессии, а читал ее артефакты снаружи. Саморефлексия внутри сессии видит тактические улучшения; некоторые системные вещи видны только при взгляде со стороны. Все наблюдения ниже — про улучшение связки "человек + агент", и каждое сформулировано так, чтобы его можно было превратить в скилл или инструкцию.

### У двух регрессий общий корень

"Старый CSS без новых селекторов" и "старый шаблон с `%(linkText)s`" — один класс ошибки: compatibility contract в спеке был сформулирован абстрактно ("existing templates must still export successfully"), но проверка шла на синтетических шаблонах, которые агент сделал сам. Обе регрессии — варианты легаси, которых не было в проверочном наборе.

Улучшение процесса: к задаче, затрагивающей пользовательские шаблоны, прикреплять реальные шаблоны, на которых проходила проверка, — как артефакт в task folder. Тогда regression-проверка идет не по придуманным агентом вариантам, а по фактическим. QA-инцидент после push был бы пойман локально.

Кандидат в инструкцию: перед push template-facing изменения прогнать проверку на реальных шаблонах, приложенных к задаче.

### Фикстуры, придуманные агентом, кодируют допущения агента

Парсер ждал пробел после номера, потому что тестовые примеры (`1 Introduction`, `1.2 Context`) агент написал сам. WeasyPrint отдавал `1Minimal` — это вскрылось только через replay.

Кандидат в инструкцию: перед написанием parsing/split-тестов снять реальные runtime-данные (в этом случае — фактические bookmark labels из одного снапшота) и строить тесты от них, а не от воображаемых примеров.

### Финальный фикс нарушил собственный spec, и spec не обновили

В Validation Contract написано: "spacing must be controlled by DOM structure and CSS, not by hard-coded literal spaces". Итоговый fallback — ровно hard-coded `&nbsp;` в строке. Решение правильное, реальность заставила — но spec теперь врет следующему читателю. Documentation-first работает, только если документы догоняют отклонения.

Кандидат в инструкцию: если реализация отклонилась от контракта в spec — обновить spec в том же цикле, что и код.

### Саморефлексии не должны умирать в квадратных скобках

Агент сгенерировал десять наблюдений и несколько идей скиллов — но они остались текстом внутри дневника. Цикл "сессия -> рефлексия -> новый скилл -> следующая сессия дешевле" замыкается, только если есть шаг превращения рефлексий в скиллы или инструкции.

Улучшение процесса: после сессии собирать блоки саморефлексии и явно решать по каждому — становится скиллом, становится инструкцией или отбрасывается. Хорошо, если агент сам предлагает такие улучшения по итогам рефлексии.

### Успех не задокументирован так же, как провал

В артефактах есть скриншот сломанного ToC, но нет эталонного скриншота правильного результата. QA получил описание словами ("clearly increased gap"). Финальное "вроде ок" от человека — самое слабое подтверждение во всей сессии, контрастирующее со строгостью остальных проверок.

Кандидат в инструкцию: при визуальных проверках сохранять в task folder не только провальные, но и эталонные снимки — отчет для QA тогда становится сравнением с эталоном.

### Вывод второго уровня

Агент внутри сессии видит, где не хватило скилла. Снаружи видно другое: где проверочный набор был синтетическим, где документы разошлись с кодом, куда деваются сами рефлексии. Поэтому рефлексия над сессией — тоже часть процесса "человек + агент": она дешевая, делается другим агентом по готовым артефактам и возвращает улучшения в скиллы и инструкции.
