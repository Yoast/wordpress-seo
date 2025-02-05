A dropdowm menu with sub components. The childrem on the dropdown menu should be the list of items `DropdownMenu.List` and the trigger `DropdownMenu.Trigger` or `DropdownMenu.IconTrigger`. The `DropdownMenu.List` should have the `DropdownMenu.Item` or `DropdownMenu.ButtonItem` as children.

The `DropdownMenu.IconTrigger` component renders the trigger as an icon.
The `DropdownMenu.Trigger` component is the trigger without any styling and with the render prop `open`.
The `DropdownMenu.ButtonItem` component acts as a `Button`, while `DropdownMenu.Item` accepts `as` prop, without any styling, and render prop `open`.