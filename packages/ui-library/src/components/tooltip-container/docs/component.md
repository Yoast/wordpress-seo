Tooltips provide contextual information about an element when that owning element receives focus or is hovered over, but are otherwise not visible. They are displayed as small boxes containing a brief label or message. See the Tooltip elements.

However, to get a fully functioning experience, with regards to accessibility, the Tooltip needs more. The following are the requirements for the Tooltip:
* The Tooltip should be visible when the element that triggers the Tooltip is focused. And it should be hidden when the element is blurred.
* The Tooltip should be visible when the element that triggers the Tooltip is hovered over. And it should be hidden when the element is no longer hovered over.
* The Tooltip should be hidden when the user presses the `Escape` key, regardless of focus or hover.

That is what this **TooltipContainer**, the **TooltipTrigger** and the **TooltipWithContext** components are for.

The **TooltipContainer** is the parent component that wraps the TooltipTrigger and the Tooltip components. It manages the visibility of the Tooltip.
* It provides the `isVisible` boolean and `show` and `hide` functions.
* It adds a `keydown` event listener to hide the tooltip when the user presses `Escape`.
* It contains the styling to center and control the tooltip visibility.

The **TooltipTrigger** wraps the content that should trigger the Tooltip in a focusable element.
* It ensures that the tooltip is shown on focus and mouse enter.
* It adds the `aria-describedby` attribute to associate the tooltip with the trigger.
* It adds the `aria-disabled` attribute to indicate the trigger itself is not actually doing anything.
* It has styling for keyboard focus (`focus-visible`) and none for hover.

The **TooltipWithContext** wraps the Tooltip element.
* It gets the `isVisible` from the context.
* It hides the Tooltip via the `yst-hidden` className when `isVisible` is false.
* It forwards any props to the Tooltip element.

**Note**: The tooltip is the same element, so if you want to override styling like `display`. You should add a container inside.
