A group of tabs and content area. `ContentTabs` manages only the active-tab state and supports both controlled (`activeTab`/`onTabChange`) and uncontrolled (`defaultActiveTab`) modes.

The component is composed of four sub-components:

- **`ContentTabs.TabList`** — wraps the tab buttons in a `<ul>`.
- **`ContentTabs.TabButton`** — a single tab. Requires an `id` that matches the `tabId` of its corresponding `ContentTabs.Panel`. Reads the active tab and the select callback from context, so `isSelected`/`onClick` never need to be wired manually.
- **`ContentTabs.Content`** — wraps all panels and takes up the remaining space next to the tab list.
- **`ContentTabs.Panel`** — the content area for one tab. Requires a `tabId` that matches the `id` of its corresponding `ContentTabs.TabButton`. Renders only when the active tab in context matches, and returns `null` otherwise.
