# Design System Documentation: The Precision Engine

## 1. Overview & Creative North Star
**The Creative North Star: "The Digital Foreman"**

Automotive management is often cluttered, greasy, and chaotic. This design system rejects that chaos by adopting the persona of "The Digital Foreman"—an experience that is authoritative yet invisible, efficient yet premium. We are moving beyond the "template" look of standard SaaS by utilizing **intentional asymmetry** and **tonal depth**. 

The system breaks the rigid grid by allowing primary action areas to "float" on layered surfaces, using generous white space to signify professional calm. We prioritize a high-contrast typography scale to ensure that in a fast-paced shop environment, the most critical data (vehicle status, technician availability) commands immediate attention.

---

## 2. Colors & Surface Logic

Our palette moves away from flat UI into a multi-dimensional workspace. We use a sophisticated hierarchy of blues and purples to ground the experience, accented by high-visibility functional colors.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section content. Boundaries must be defined solely through background color shifts or subtle tonal transitions. For example, a `surface-container-low` section should sit on a `surface` background to create a natural break.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of frosted glass.
- **Base Level:** `surface` (#f8f9ff) - The workshop floor.
- **Sectioning:** `surface-container-low` (#eff4ff) - Grouping related diagnostic tools.
- **Interactive Cards:** `surface-container-lowest` (#ffffff) - The "active" paperwork.

### The "Glass & Signature" Rule
To elevate the brand beyond a standard "out-of-the-box" feel:
- **Glassmorphism:** Use semi-transparent `surface-container` colors with a `backdrop-blur: 12px` for floating navigation bars or modal overlays.
- **Signature Gradients:** For primary CTAs (e.g., "Check-in Vehicle"), use a subtle linear gradient from `primary` (#3250d3) to `primary-container` (#4f6bed) at 135 degrees. This adds "visual soul" and depth.

---

## 3. Typography: Editorial Authority

We use **Inter** to maintain a technical, high-performance feel. The hierarchy is designed to be "scannable" from a distance (e.g., a tablet on a tool trolley).

*   **Display (lg/md):** Reserved for high-level shop performance metrics. Bold, tight tracking (-0.02em).
*   **Headline (sm/md):** Used for Page Titles. These should feel like an editorial magazine header—authoritative and clean.
*   **Title (sm/md):** Used for Card headers. 600 weight is mandatory to distinguish from data.
*   **Body (md/lg):** 400 weight. Use `on-surface-variant` (#444654) for secondary info to reduce visual noise.
*   **Labels (sm/md):** Always 600 weight, uppercase with 0.05em letter spacing for a "technical blueprint" aesthetic.

---

## 4. Elevation & Depth: Tonal Layering

Traditional shadows are messy; we use **Tonal Layering** to define importance.

*   **The Layering Principle:** Depth is achieved by stacking. Place a `surface-container-lowest` card on a `surface-container-low` background. This creates a soft, natural lift without the "dirty" look of grey shadows.
*   **Ambient Shadows:** For high-priority floating elements (Modals/Popovers), use an extra-diffused shadow: `0px 20px 40px rgba(11, 28, 48, 0.06)`. Note the use of the `on-surface` color (#0b1c30) for the shadow tint rather than pure black.
*   **The "Ghost Border" Fallback:** If accessibility requires a boundary, use the `outline-variant` (#c5c5d7) at **15% opacity**. Never use a 100% opaque border.

---

## 5. Components: The Toolset

### Buttons
- **Primary:** Gradient-filled (Primary to Primary-Container), 6px border radius.
- **Secondary:** Surface-tinted with no border. 
- **Tertiary:** Pure text with `on-primary-fixed-variant` color (#0d35bb).

### Input Fields
- **Style:** 4px border radius. Use `surface-container-highest` (#d3e4fe) for the background with a "Ghost Border" bottom-edge only.
- **States:** On focus, transition the background to `surface-bright` (#f8f9ff) and increase the bottom border to 2px using the `primary` token.

### Cards & Lists
- **Rule:** Forbid the use of divider lines.
- **Spacing:** Use the Spacing Scale `4` (1rem) or `6` (1.5rem) to create separation.
- **List Items:** Use a hover state transition to `surface-container-low` to indicate interactivity.

### Specific Automotive Components
- **The "Bay Status" Pill:** Pill-shaped tags using `tertiary-container` (#00893c) for "Available" and `error-container` (#ffdad6) for "Full."
- **Technician Avatar Stacks:** Overlapping circles with a 2px "Ghost Border" (at 100% opacity) to separate the images.

---

## 6. Do's and Don'ts

### Do
- **Do** use `9999px` (Full) roundedness for status badges to contrast against the `8px` (DEFAULT) card corners.
- **Do** lean into white space. If an interface feels "empty," it means it's working—automotive data is heavy; give it room to breathe.
- **Do** use `secondary` (#8337be) for "Logic" or "Automation" features (like automated SMS reminders) to distinguish them from manual actions.

### Don't
- **Don't** use pure black (#000000) for text. Use `on-surface` (#0b1c30) for better readability under shop lights.
- **Don't** use standard "Drop Shadows" on cards. Use the Tonal Layering method described in Section 4.
- **Don't** use icons without labels for complex diagnostic actions. Clarity over minimalism.