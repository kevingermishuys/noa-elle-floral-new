# Asset inventory

Tracks what's actually in hand, against the needs in `BRIEF.md` §5 and §11.
Update this table as new files arrive — don't rely on chat history for provenance.
Kevin confirmed on 27 July 2026 that this batch is everything currently available.

## Wedding photos — white-and-green (assets/raw/weddings-white-green/)

| File | Subject | Verdict |
|---|---|---|
| IMG_7988.jpeg | Festoon-lit long table, dusk | Screenshot (EXIF), 1178×1173. Gallery-tile only. |
| IMG_7989.jpeg | Lisianthus/rose centerpiece, daylight | Screenshot (EXIF), 1178×1167. Gallery-tile only. |
| IMG_7990.jpeg | Floral arch, festoon bulbs | Screenshot (EXIF), 1178×1172. Gallery-tile only. |
| IMG_7992.jpeg | Centerpiece, string-light bokeh | Screenshot (EXIF), 1178×1171. Gallery-tile only. |
| IMG_7994.jpeg | Long table, dusk, black-and-white filter | Screenshot (EXIF), 1178×1173. Gallery-tile only; B&W filter limits use to mood/texture, not the signature-stems feature (can't read colour of blooms). |

## Wedding photos — warm dried/earthy (assets/raw/events-warm-dried/)

| File | Subject | Verdict |
|---|---|---|
| IMG_7995.jpeg | Pampas + orange/peach florals, table setting, bright window light | Screenshot (EXIF), 1178×1177. Gallery-tile only. |
| IMG_7996.jpeg | Close-up: dried pampas, peach roses, rust carnation | Screenshot (EXIF), 1178×1175. Gallery-tile only. |
| IMG_7997.jpeg | Table setting, burnt-orange runner, table numbers 8/9 | Screenshot (EXIF), 1178×1172. Gallery-tile only. |
| IMG_7998.jpeg | Pampas + olive branch, hexagonal arch detail, blue sky | Screenshot (EXIF), 1178×1163. Gallery-tile only. |

## Everyday bouquets (assets/raw/everyday-bouquets/)

| File | Subject | Verdict |
|---|---|---|
| IMG_7999.jpeg | Macro: king protea + garden rose | Screenshot (EXIF), 1178×1156. Gallery-tile only. Strong protea shot — good candidate to lean on per brief §5. |
| IMG_8001.jpeg | Mixed bouquet: protea, dahlia, lisianthus, carnation, kraft wrap edge | Screenshot (EXIF), 1178×1164. Gallery-tile only. |

## Do not publish (assets/raw/do-not-publish/)

| File | Issue |
|---|---|
| IMG_7991-names-couple.jpeg | Mirror welcome sign reads "ANLI and LOUIS 08.02.25" — names a real couple. Confirmed instance of the rights issue flagged in brief §5/§8. Do not use without their explicit consent. |
| IMG_7993-bedeker-branding.jpeg | Neon sign reads "Bedeker" over the hexagonal arch — third-party vendor branding in frame. Confirmed instance of the rights issue flagged in brief §5/§8. Do not use without that vendor's permission (or a crop that fully removes the sign, if the rest of the frame is worth salvaging). |

## Brand (assets/raw/brand/)

| File | Verdict |
|---|---|
| logo-master.jpeg | 1280×1280, off-white background, black line art. Still a flat JPEG, not vector or transparent PNG — blocker #5 unresolved. At 1280px it's workable as a source to trace/rebuild as SVG or to key out the background (it's a flat near-white field, so isolating the mark is feasible), but that's a rebuild, not the original vector file. Recommend still asking Inge for the designer's source file if one exists. |

## Reference posters (assets/reference/posters/) — copy/content source, not for direct site use

- `she-says-she-doesnt.jpeg` — voice reference, confirms the teasing register in brief §4.
- `delivery-areas.jpeg` — confirms free-delivery estates and Uber-rate wording already in brief §1.
- `mothers-day-menu-v1.jpeg` — "Version A": One Perfect Stem R80 · Petite R450 · Classic R750 · Statement R1,200 · Bespoke from R2,000.
- `mothers-day-menu-v2.jpeg` — "Version B": One Perfect Stem R80 · Elle (The Clasique) R450 · Nòa (The Signature) R650, both include a pink ceramic pot "for mothersday", vouchers/pre-order/Wednesday delivery note, WhatsApp order line.

## Blocker #1 — accent mark, now confirmed inconsistent even within a single document

Checked every supplied asset that spells the name out:

- **Grave (ò) — "Nòa-Elle":** logo-master.jpeg (wordmark), both Mother's Day menu headers/titles, one menu line item ("NÒA (The signature)").
- **Acute (ó) — "Nóa-Elle":** she-says-she-doesnt.jpeg, delivery-areas.jpeg, and the italic body copy on *both* Mother's Day menus ("All NÓA-ELLE floral arrangements...").

Both menu posters use the grave accent in their own header and the acute accent in their own body copy — so this isn't one wrong asset, it's mixed within the same document, most likely autocorrect drift when typing on a phone versus the accent set carefully in the graphic-design files (logo, poster titles).

**Working default:** proceeding with **Nòa-Elle (grave)**, since it's what's set in the master logo file — the one asset that functions as the actual brand mark — and it's also what both menu headers use. Every heading, title, and filename in the build will use the grave form until Inge confirms otherwise. This is still worth a direct one-line confirmation from her before the hero ships (brief §11, item 1) — flagging here rather than blocking the rest of the build on it.

## Still open after this batch

- **Blocker #4 (high-res originals):** not resolved. Every wedding/bouquet photo received — 12 files across two batches — carries the same `EXIF description=Screenshot`, ~1170–1180px signature. None is a camera original. Fine for gallery tiles under the speed plan's `srcset`, not enough for a full-bleed hero.
- **Blocker #5 (logo vector):** not resolved. logo-master.jpeg is a good-resolution flat JPEG, workable as a source for a redraw, but not itself vector or transparent.
- **Blocker #1 (accent mark):** proceeding on the grave default above; needs Inge's actual confirmation before final ship.
