import { DropdownMenu } from "@yoast/ui-library";

/**
 * A single Select-menu item: an optional icon followed by the label.
 *
 * @param {Object} props      The props.
 * @param {Object} props.item The item ({ key, label, ariaLabel, icon, onClick }).
 *
 * @returns {JSX.Element} The menu item.
 */
export const SelectMenuItem = ( { item } ) => (
	<DropdownMenu.ButtonItem
		className="yst-flex yst-items-center yst-gap-2 yst-justify-start yst-px-4 yst-py-2 yst-font-normal yst-text-start yst-text-slate-800 hover:!yst-bg-slate-50 focus:!yst-bg-slate-50"
		onClick={ item.onClick }
		aria-label={ item.ariaLabel }
	>
		{ item.icon }
		{ item.label }
	</DropdownMenu.ButtonItem>
);
