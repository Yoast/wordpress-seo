Click the tab to open the panel. `ContentTabs` is controlled here (`activeTab`/`onTabChange`) so the story can toggle the panel.
`ContentTabs.TabButton` doesn't need `isSelected`/`onClick` passed at all — it reads both from context.
