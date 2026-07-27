# Decisions log

Confirmed by Kevin on 27 July 2026, in response to the open items in `BRIEF.md` §11.
This is the working source of truth for anything the brief flagged as a blocker.
Update it, don't leave decisions buried in chat.

## 1. Accent mark — Nòa-Elle (grave)

Chosen because it matches the master logo file and both Mother's Day poster headers.
Every page title, heading, filename, and meta tag in the build uses the grave form.
**Still needs a direct one-line confirmation from Inge before the site ships for real** —
this was Kevin's working call, not hers.

## 2. Logo — recreate in-house, don't wait on Inge

We only have `assets/raw/brand/logo-master.jpeg` (1280×1280, flat JPEG, off-white background).
Rather than blocking on Inge producing a designer source file, we're rebuilding the N/E
monogram + lily line art as a clean SVG/transparent asset ourselves, good enough for the
dark bark background. If Inge later supplies a real vector file, swap it in — the rebuild
is a stand-in, not a replacement for getting the original.

## 3. Rights-flagged photos — excluded

`IMG_7991-names-couple.jpeg` (mirror sign reads "ANLI and LOUIS 08.02.25") and
`IMG_7993-bedeker-branding.jpeg` (competitor "Bedeker" neon sign) are excluded from the
build entirely. They stay archived in `assets/raw/do-not-publish/` for reference. The
gallery is built from the other 11 confirmed-clean photos only.

## 4. Page scope — all four pages confirmed

Home, Gallery, Order, Weddings & Events — as proposed in brief §9.

## 5. Menu — Version B (Elle/Nòa house names)

Using the house-named tiers (Elle — The Clasique, R450; Nòa — The Signature, R650) rather
than the generic Petite/Classic/Statement/Bespoke version, per the brief's own
recommendation in §7. **Still Mother's Day pricing** — the Order page will carry these
prices with the understanding that Inge needs to confirm her year-round list separately.

## 6. Contact — WhatsApp only, no enquiry form

No form anywhere on the site. Every path to contact is the WhatsApp number
(082 842 2682, Inge Culbert). This avoids the POPIA obligation a form would trigger and
matches how she already takes orders. Email address and trading hours are still open —
the footer will carry only what's confirmed (WhatsApp, delivery areas) until she supplies
the rest.

## Still open — not decided, just deferred

- **What "28°" is** (brief item 2). Building as if she has no public premises: no address,
  no map, no trading hours on the site. If it turns out to be a real shop, the hero and
  footer need rework.
- **Wednesday-only delivery** (brief item 8): whether it's a permanent rule or a Mother's
  Day-only thing. The Order page will avoid promising a specific delivery day until this
  is confirmed — language stays close to "get in touch for delivery timing."
- **Real hero photo** (brief item 4): nothing supplied so far is camera-original quality.
  The hero ships with the best available screenshot-quality photo, clearly flagged in this
  repo as a placeholder, pending a real file from Inge.
