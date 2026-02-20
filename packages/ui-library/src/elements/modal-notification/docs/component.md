A modal notification component that traps focus, handles Escape key dismissal, and manages focus restoration. Unlike the regular `Toast` element (which is non-modal), the `ModalNotification` is a dialog that requires user attention and must always provide a visible closing mechanism.

Use `ModalNotification` when you need an interactive notification popup that requires user attention and focus trapping. Use the regular `Toast` for non-modal status notifications that don't require explicit user interaction.

The Title subcomponent of the `ModalNotification` allows rendering the title as different HTML elements (e.g., `h1`, `h2`, `p`, etc.) by passing an optional `as` prop. By default, it renders as an `h2` element, but you can specify any valid HTML element to suit your needs.

**Important:** This component renders via a portal as a direct child of the `document.body`, outside the React component tree's DOM hierarchy. This means it will not inherit styles from parent containers. The component applies the `yst-root` class to ensure proper styling within the portal, and the `ModalNotification.Panel` reuses the `yst-toast` class from the `Toast` element's stylesheet (`elements/toast/style.css`). In Storybook, you will notice it renders outside the story's container because the portal uses fixed positioning to place the notification relative to the viewport.
