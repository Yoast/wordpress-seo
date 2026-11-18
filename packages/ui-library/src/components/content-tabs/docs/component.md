A group of tabs that drives a content area shown wherever the consumer places it. `ContentTabs` manages only the active-tab state, and supports both controlled (`activeTab`/`onTabChange`) and uncontrolled (`defaultActiveTab`) modes.

The component is composed of four sub-components:

- **`ContentTabs.TabList`** — a plain `<ul>` wrapper for the tab buttons; carries no other behaviour.
- **`ContentTabs.TabButton`** — a single tab. Requires an `id` that matches the `tabId` of its corresponding `ContentTabs.Panel`. Reads the active tab and the select callback from context, so `isSelected`/`onClick` never need to be wired manually.
- **`ContentTabs.Content`** — wraps all panels and takes up the remaining space next to the tab list.
- **`ContentTabs.Panel`** — the content area for one tab. Requires a `tabId` that matches the `id` of its corresponding `ContentTabs.TabButton`. Renders only when the active tab in context matches, and returns `null` otherwise.
