A group of tabs that drives a content area shown wherever the consumer places it — not necessarily next to the tabs. `ContentTabs` manages only the active-tab state and supports both controlled (`activeTab`/`onTabChange`) and uncontrolled (`defaultActiveTab`) modes.

The component is composed of four sub-components:

- **`ContentTabs.TabList`** — wraps the tab buttons in a `<ul>`.
- **`ContentTabs.TabButton`** — a single tab. Reads the active tab and the select callback from context, so `isSelected`/`onClick` never need to be wired manually.
- **`ContentTabs.Content`** — wraps all panels and takes up the remaining space next to the tab list.
- **`ContentTabs.Panel`** — the content area for one tab. Renders only when its `tabId` matches the active tab in context, and returns `null` otherwise.
