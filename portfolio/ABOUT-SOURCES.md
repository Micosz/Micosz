# About me: academic source and editing notes

The About me page extends the portfolio's existing dark/lavender design and paper sections. It turns the academic record into a semester narrative; the narratives and topic groups are editorial summaries, not official course descriptions or prerequisite claims.

## Record

Source: **ทรานสคริปที่แสดงผลการศึกษา.pdf**, an unofficial registrar-results printout dated **20 October 2026, 13:51**. Read through the connected Google Drive file and visually checked against all three locally rendered pages on 31 October 2026. The original PDF, student ID and portrait are not included in the website package.

- Programme: Computer Science (Applied Computer Science), Faculty of Science and Technology, Thammasat University, Rangsit.
- Academic years 2567–2569 are displayed as 2024–2026. These are academic-year labels, not invented semester start/end dates.
- 38 course registrations, including one withdrawal and seven registrations awaiting results.
- 28 graded completions (84 credits), two ACC entries (6 accepted credits), 90 earned credits in total.
- Latest cumulative GPA: 3.61, calculated from 303 grade points / 84 graded credits.
- The latest semester has no final GPA. Its printed 0.00 is represented as **pending**, not as a scored zero. Cumulative GPA is carried forward.

| Academic term | Semester GPA | Cumulative GPA | Earned credits, cumulative | Graded credits, cumulative |
| --- | ---: | ---: | ---: | ---: |
| 1/2567 | 3.57 | 3.57 | 21 | 21 |
| 2/2567 | 3.80 | 3.67 | 39 | 36 |
| S/2567 | 2.50 | 3.58 | 42 | 39 |
| 1/2568 | 3.50 | 3.55 | 66 | 60 |
| 2/2568 | 3.71 | 3.59 | 87 | 81 |
| S/2568 | 4.00 | 3.61 | 90 | 84 |
| 1/2569 | Pending | 3.61 (carried) | 90 | 84 |

Every course name, grade and credit value was transcribed from the record. All semester GPA, cumulative GPA and credit totals were independently recomputed and matched the printed values. MA211 appears twice because it was withdrawn in 2/2567 and completed in S/2567. ACC and W do not contribute grade points. Missing grades stay null.

## Project connections

Related-project links reuse the existing Work catalogue and its evidence in `WORK-SOURCES.md`. CS261 → TU Events, CS232 → LC3 Navigator, CS251 → Khao Mai Rak Zoo and CS361 → CSTU Hub are the four featured connections. Additional course notes connect CS240, CS262, CS373 and CS374 to the relevant data, testing, search and language workbenches. A related link does not claim a project grade, individual ownership or production readiness.

## Editing

Open **Edit portfolio → การเรียน / About me** to change the introduction, programme, source date, semester stories, reported GPA/credit totals and individual courses. You can add a semester or a course; a blank course result is pending. Keep each semester's reported cumulative totals aligned with a new transcript when adding results.

Browser drafts save locally. Export `content.js` and replace the website's file to keep or publish those edits. The academic data lives under `window.PORTFOLIO.education`; other sections remain in the same content file. Topic groups and related-project IDs are editable too.

Course grades start hidden and can be shown with either synchronized checkbox. This is a display choice, not an access-control feature: the academic data is in the website source.
