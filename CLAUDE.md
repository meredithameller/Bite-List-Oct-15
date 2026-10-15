# Design Tokens

```css
:root {
  /* ── Colors ─────────────────────────────── */
  --color-primary: #174AB2;        /* Figma var "Icon Blue": links, active nav, logo */
  --color-danger: #FF142D;         /* Figma var "Lab Icon": not-optimal values, lab icon */
  --color-border: #B3B3B1;         /* Figma var "Gray": card borders, inactive nav labels */
  --color-text: #19284C;           /* navy: card titles, values, body text */
  --color-text-heading: #444444;   /* section headings, date label */
  --color-text-muted: #B3B3B1;     /* inactive nav labels */
  --color-bg: #ECECEC;             /* screen background, selected toggle */
  --color-surface: #FFFFFF;        /* cards, nav bars, toggle container */
  --color-range-start: #4FFED6;    /* range bar gradient, top */
  --color-range-end: #4FD6FE;      /* range bar gradient, bottom */
  --gradient-range: linear-gradient(to bottom, #4FFED6, #4FD6FE);

  /* ── Font families ──────────────────────── */
  --font-body: 'Lato', sans-serif;
  --font-brand: 'Permanent Marker', cursive;   /* logo only */

  /* ── Font weights ───────────────────────── */
  --font-weight-regular: 400;
  --font-weight-bold: 700;

  /* ── Font sizes ─────────────────────────── */
  --font-size-xs: 10px;    /* bottom nav labels (uppercase) */
  --font-size-sm: 12px;    /* "NOT OPTIMAL" tag */
  --font-size-md: 14px;    /* range min/max, "Luteal phase" */
  --font-size-base: 16px;  /* details, links, buttons, lab values */
  --font-size-lg: 18px;    /* section headings, card titles */
  --font-size-brand: 28px; /* "Optimizer" logo */

  /* ── Line heights ───────────────────────── */
  --line-height-body: normal;  /* used everywhere except nav labels */
  --line-height-tight: 1;      /* 100%: bottom nav labels */

  /* ── Letter spacing ─────────────────────── */
  --letter-spacing-none: 0;

  /* ── Border radius ──────────────────────── */
  --radius-md: 10px;       /* cards, toggle, buttons, range bar */

  /* ── Border ─────────────────────────────── */
  --border-width: 1px;

  /* ── Spacing ────────────────────────────── */
  --space-xs: 5px;    /* gap between cards in lists, toggle padding */
  --space-sm: 10px;   /* gap between lab cards */
  --space-md: 15px;   /* screen side margin, card inner left padding, button x-padding */
  --space-lg: 20px;   /* gap between sections */

  /* ── Layout / component sizes ───────────── */
  --screen-width: 375px;
  --content-width: 345px;
  --nav-top-height: 86px;
  --nav-bottom-height: 83px;
  --card-height: 81px;         /* appointment, medication, supplement */
  --card-height-lab: 150px;    /* lab result */
  --toggle-height: 39px;
  --icon-size: 20px;
  --avatar-size: 35px;
}
```
