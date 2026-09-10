Click the tab to open the panel; click again to close it. `ContentTabs` is controlled here (`activeTab`/`onTabChange`) so the parent can toggle visibility by passing `null` as the active tab.

`ContentTabs.TabButton` reads both `isSelected` and the select callback from context — no manual wiring needed. `ContentTabs.Panel` shows itself when its `tabId` matches the active tab, and returns `null` otherwise.
