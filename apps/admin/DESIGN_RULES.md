# Cuoio Cane Atelier - Design System Rules

**Status**: ACTIVE
**Version**: 1.0 (Clean Slate)

This document governs the usage of the Cuoio Cane Design System. Strict adherence is required to maintain the "Atelier" aesthetic and structural integrity.

---

## 🚫 The Cardinal Sins (Strictly Forbidden)

1.  **NO Magic Values**: Never use arbitrary pixels (e.g., `w-[350px]`, `p-[17px]`). Use strict tokens (`w-full`, `max-w-sm`, `p-4`) or defined variables.
2.  **NO Structural Animations**: Use `framer-motion` ONLY for micro-interactions (hover, click). Never animate layout width/height or page transitions.
3.  **NO Ad-Hoc Colors**: Never use `bg-black` or `text-gray-500`. ALWAYS use semantic tokens: `bg-background`, `text-secondary`, `border-border`.
4.  **NO Layout Shift**: Do not use collapsible sidebars or dynamic height elements that push content unexpectedly.

---

## 🧱 Component Usage

### 1. Containers (`<Container />`)
- **Use for**: Wrapping page content.
- **Rule**: Always specify `size` (`sm` to `xl`).
- **Forbidden**: Nesting containers unnecessarily.

### 2. Cards (`<Card />`)
- **Use for**: Any content grouping on the page.
- **Rule**: Use `variant="hoverable"` only for interactive lists.
- **Forbidden**: Overriding padding unless `noPadding={true}` is explicitly needed for full-bleed tables.

### 3. Buttons (`<Button />`)
- **Primary**: Coffee Gradient. Use **ONCE** per major view (CTAs).
- **Secondary**: Bordered. Use for standard actions (Cancel, Back).
- **Ghost**: Use for tertiary actions (filters, icons).
- **Rule**: All buttons must be `uppercase tracking-wide`.

### 4. Inputs (`<Input />`)
- **Rule**: Always `h-11`. No exceptions.
- **Rule**: Always pair with `<Label />`.

---

## 🎨 Token Reference

| Type | Token | Value | usage |
| :--- | :--- | :--- | :--- |
| **Background** | `bg-background` | `#09090b` | App background only |
| **Surface** | `bg-surface` | `#121212` | Cards, Sidebar, Modals |
| **Border** | `border-border` | `#27272a` | Structural dividers |
| **Accent** | `text-copper` | `#d4b483` | Highlights, Active States |
| **Primary** | `bg-coffee` | `#3E2723` | Main CTAs |

---

## 🛠 Extension Protocol

If you need a new component:
1.  Check if it can be composed of existing bricks.
2.  If not, build it in `components/ui/` with **zero** external dependencies (except `lucide-react` / `radix-ui`).
3.  Ensure it uses `globals.css` variables.
