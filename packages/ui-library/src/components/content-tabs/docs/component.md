A group of tabs that drives a content area shown wherever the consumer places it — not necessarily next to the tabs. `ContentTabs` manages only the active-tab state and supports both controlled (`activeTab`/`onTabChange`) and uncontrolled (`defaultActiveTab`) modes.

The component is composed of four sub-components:

- **`ContentTabs.TabList`** — wraps the tab buttons. Optionally renders a `Pagination` control below them via `paginationProps`.
- **`ContentTabs.TabButton`** — a single tab. Reads the active tab and the select callback from context, so `isSelected`/`onClick` never need to be wired manually.
- **`ContentTabs.Content`** — wraps all panels. Stacks them in the same grid cell so they can cross-fade without layout shifts.
- **`ContentTabs.Panel`** — the content area for one tab. Shows and fades in when its `tabId` matches the active tab in context; fades out and unmounts when it doesn't.
