# Lightcurve Brand Guidelines

## Company Overview

**Company Name**: Lightcurve
**Industry**: Fiber Internet Services
**Brand Essence**: Modern, trustworthy, innovative connectivity

---

## Color Palette

### Primary Colors

#### Navy (Primary Brand Color)
The foundation of the Lightcurve brand. Used for headers, primary text, and key UI elements.

| Property | Value |
|----------|-------|
| **Name** | Navy |
| **HEX** | `#0E0A49` |
| **RGB** | 14 / 10 / 73 |
| **CMYK** | 81 / 86 / 0 / 71 |
| **PMS** | 275 C |

**Usage**:
- Primary backgrounds
- Header text
- Navigation elements
- Primary buttons
- Brand emphasis

```css
--color-navy: #0E0A49;
```

---

#### White (Background & Contrast)
Clean, professional backdrop that ensures readability and modern aesthetics.

| Property | Value |
|----------|-------|
| **Name** | White |
| **HEX** | `#FFFFFF` |
| **RGB** | 255 / 255 / 255 |
| **CMYK** | 0 / 0 / 0 / 0 |

**Usage**:
- Page backgrounds
- Card backgrounds
- Text on dark backgrounds
- Clean space

```css
--color-white: #FFFFFF;
```

---

#### Charcoal (Secondary Text)
Rich, deep gray for body text and secondary elements.

| Property | Value |
|----------|-------|
| **Name** | Charcoal |
| **HEX** | `#1D1D1D` |
| **RGB** | 29 / 29 / 29 |
| **CMYK** | 0 / 0 / 0 / 89 |

**Usage**:
- Body text
- Secondary headings
- Icons
- Borders

```css
--color-charcoal: #1D1D1D;
```

---

### Accent Colors

#### Wave (Primary Accent)
Vibrant teal that represents connectivity, technology, and the flow of data.

| Property | Value |
|----------|-------|
| **Name** | Wave |
| **HEX** | `#00A2AD` |
| **RGB** | 0 / 162 / 173 |
| **CMYK** | 79 / 15 / 32 / 0 |
| **PMS** | 7466 C |

**Usage**:
- Call-to-action buttons
- Links and interactive elements
- Progress indicators (active/in-progress)
- Highlights and accents
- Success states

```css
--color-wave: #00A2AD;
```

---

#### Violetta (Secondary Accent)
Bold magenta that adds energy and draws attention to important elements.

| Property | Value |
|----------|-------|
| **Name** | Violetta |
| **HEX** | `#BD137A` |
| **RGB** | 189 / 19 / 122 |
| **CMYK** | 0 / 90 / 35 / 26 |
| **PMS** | 233 C |

**Usage**:
- Special promotions
- Alerts and notifications
- Hover states
- Emphasis elements
- Badges and tags

```css
--color-violetta: #BD137A;
```

---

## Color Usage Guidelines

### Hierarchy

```
Primary Background:    Navy (#0E0A49) or White (#FFFFFF)
Primary Text:          Charcoal (#1D1D1D) on light / White (#FFFFFF) on dark
Accent/CTA:            Wave (#00A2AD)
Highlight/Special:     Violetta (#BD137A)
```

### Color Combinations

| Background | Text | Accent | Use Case |
|------------|------|--------|----------|
| White | Charcoal | Wave | Standard pages |
| Navy | White | Wave | Hero sections, headers |
| White | Navy | Violetta | Special promotions |
| Navy | White | Violetta | Featured content |

### Accessibility

All color combinations must meet WCAG 2.1 AA standards:

| Combination | Contrast Ratio | Pass |
|-------------|----------------|------|
| Charcoal on White | 16.15:1 | ✓ AAA |
| Navy on White | 14.89:1 | ✓ AAA |
| White on Navy | 14.89:1 | ✓ AAA |
| White on Wave | 3.58:1 | ✓ AA (large text) |
| White on Violetta | 5.12:1 | ✓ AA |

---

## Extended Palette

### Navy Scale
For UI depth and subtle variations:

| Name | HEX | Usage |
|------|-----|-------|
| Navy 50 | `#E8E7EF` | Subtle backgrounds |
| Navy 100 | `#C5C3D8` | Borders, dividers |
| Navy 200 | `#9E9BBE` | Disabled states |
| Navy 300 | `#7773A4` | Secondary elements |
| Navy 400 | `#595491` | Hover states |
| Navy 500 | `#3B357D` | Active states |
| Navy 600 | `#352F71` | Default buttons |
| Navy 700 | `#2D2762` | Headers |
| Navy 800 | `#251F53` | Deep backgrounds |
| Navy 900 | `#0E0A49` | **Primary Navy** |
| Navy 950 | `#080630` | Darkest shade |

### Wave Scale
For progress states and CTAs:

| Name | HEX | Usage |
|------|-----|-------|
| Wave 50 | `#E6F7F8` | Light backgrounds |
| Wave 100 | `#B3E8EB` | Subtle accents |
| Wave 200 | `#80D9DE` | Light borders |
| Wave 300 | `#4DCAD1` | Secondary accents |
| Wave 400 | `#26BEC7` | Hover states |
| Wave 500 | `#00A2AD` | **Primary Wave** |
| Wave 600 | `#00929C` | Active states |
| Wave 700 | `#007F88` | Pressed states |
| Wave 800 | `#006C74` | Dark accents |
| Wave 900 | `#004D52` | Deepest shade |

### Violetta Scale
For highlights and special elements:

| Name | HEX | Usage |
|------|-----|-------|
| Violetta 50 | `#FBE8F2` | Light backgrounds |
| Violetta 100 | `#F4C6DE` | Subtle accents |
| Violetta 200 | `#EDA0C8` | Light borders |
| Violetta 300 | `#E57AB2` | Secondary accents |
| Violetta 400 | `#DF5DA1` | Hover states |
| Violetta 500 | `#BD137A` | **Primary Violetta** |
| Violetta 600 | `#AA116E` | Active states |
| Violetta 700 | `#930F5F` | Pressed states |
| Violetta 800 | `#7C0D50` | Dark accents |
| Violetta 900 | `#550938` | Deepest shade |

---

## Typography

### Font Family
**Primary**: Inter (or system fonts as fallback)
**Monospace**: JetBrains Mono (for tracking codes)

```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale

| Name | Size | Weight | Usage |
|------|------|--------|-------|
| Display | 3rem (48px) | 700 | Hero headlines |
| H1 | 2.25rem (36px) | 700 | Page titles |
| H2 | 1.875rem (30px) | 600 | Section headers |
| H3 | 1.5rem (24px) | 600 | Card titles |
| H4 | 1.25rem (20px) | 600 | Subsections |
| Body Large | 1.125rem (18px) | 400 | Lead paragraphs |
| Body | 1rem (16px) | 400 | Default text |
| Body Small | 0.875rem (14px) | 400 | Captions |
| Caption | 0.75rem (12px) | 500 | Labels, metadata |

---

## Logo Usage

### Primary Logo
- Full "Lightcurve" wordmark
- Used in headers and primary brand placements
- Minimum clear space: Height of "L" character

### Logo Colors
| Context | Logo Color | Background |
|---------|------------|------------|
| Light backgrounds | Navy (#0E0A49) | White |
| Dark backgrounds | White (#FFFFFF) | Navy |
| Special | Wave (#00A2AD) | White or Navy |

### Logo Don'ts
- Don't stretch or distort
- Don't change colors outside brand palette
- Don't add effects (shadows, gradients)
- Don't place on busy backgrounds

---

## UI Component Styling

### Buttons

**Primary Button**
```css
background: #00A2AD; /* Wave */
color: #FFFFFF;
hover: #00929C; /* Wave 600 */
```

**Secondary Button**
```css
background: transparent;
border: 2px solid #0E0A49; /* Navy */
color: #0E0A49;
hover-background: #E8E7EF; /* Navy 50 */
```

**Accent Button**
```css
background: #BD137A; /* Violetta */
color: #FFFFFF;
hover: #AA116E; /* Violetta 600 */
```

### Cards
```css
background: #FFFFFF;
border: 1px solid #E8E7EF; /* Navy 50 */
border-radius: 8px;
box-shadow: 0 1px 3px rgba(14, 10, 73, 0.1);
```

### Progress Tracker States

| State | Color | Description |
|-------|-------|-------------|
| Pending | `#9E9BBE` (Navy 200) | Not yet started |
| In Progress | `#00A2AD` (Wave) | Currently active |
| Completed | `#00A2AD` (Wave) | Successfully done |
| Blocked | `#BD137A` (Violetta) | Requires attention |

---

## Application Examples

### Header Bar
- Background: Navy (#0E0A49)
- Logo: White
- Navigation: White text, Wave hover

### Hero Section
- Background: Gradient from Navy to Navy 800
- Headline: White
- CTA Button: Wave background, White text

### Stage Indicator (Active)
- Circle: Wave (#00A2AD) with glow effect
- Connector (complete): Wave
- Connector (pending): Navy 100

### Form Inputs
- Border: Navy 100
- Focus border: Wave
- Label: Charcoal
- Error: Violetta

---

## File Exports

### CSS Variables
```css
:root {
  /* Primary */
  --lc-navy: #0E0A49;
  --lc-white: #FFFFFF;
  --lc-charcoal: #1D1D1D;

  /* Accent */
  --lc-wave: #00A2AD;
  --lc-violetta: #BD137A;

  /* Navy Scale */
  --lc-navy-50: #E8E7EF;
  --lc-navy-100: #C5C3D8;
  --lc-navy-200: #9E9BBE;
  --lc-navy-300: #7773A4;
  --lc-navy-400: #595491;
  --lc-navy-500: #3B357D;
  --lc-navy-600: #352F71;
  --lc-navy-700: #2D2762;
  --lc-navy-800: #251F53;
  --lc-navy-900: #0E0A49;
  --lc-navy-950: #080630;
}
```

### Tailwind Config
```javascript
colors: {
  navy: {
    50: '#E8E7EF',
    100: '#C5C3D8',
    200: '#9E9BBE',
    // ... full scale
    900: '#0E0A49',
  },
  wave: {
    500: '#00A2AD',
    // ... full scale
  },
  violetta: {
    500: '#BD137A',
    // ... full scale
  },
  charcoal: '#1D1D1D',
}
```

---

*Lightcurve Brand Guidelines v1.0*
*Last Updated: February 2026*
