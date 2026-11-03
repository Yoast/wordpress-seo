Pass `accordionBreakpoint` (a width in pixels) to turn the tabs into an accordion when the `ContentTabs` element is narrower than that given width, for example on a tablet or phone. It measures the element itself rather than the viewport, so it responds to the room it actually gets. The active tab's panel then opens right below its tab button, wherever `ContentTabs.Content` is placed, and the button carries `aria-expanded` and `aria-controls`. Clicking on the open tab again collapses it; the active tab stays the same.

A collapsed panel is only hidden by default, so state inside it (a page in a table, unsaved input) survives a collapse. Pass `keepMounted={ false }` to unmount it instead. Crossing the breakpoint moves the panel between the two layouts, which remounts it.

This story shows the accordion at any screen size. Drag the bottom-right corner of the container to resize it, or change `accordionBreakpoint` in the controls, to see it switch between the two layouts.
