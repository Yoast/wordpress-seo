import { SelectMenuItem } from "./select-menu-item";
import { useMemo } from "@wordpress/element";
import { applyFilters } from "@wordpress/hooks";
import { SELECT_MENU_ITEMS_FILTER } from "../constants";
import { __ } from "@wordpress/i18n";
import { DropdownMenu, Button, useSvgAria } from "@yoast/ui-library";
import ChevronDownIcon from "@heroicons/react/outline/ChevronDownIcon";

/**
 * The "Select" menu.
 *
 * @param {Object}   props                  The props.
 * @param {Function} props.onSelectAll      Selects every row.
 * @param {Function} props.onDeselectAll    Clears the selection.
 * @param {number}   props.selectedCount    The number of selected rows.
 * @param {number}   props.totalCount       The total number of rows.
 * @param {Object[]} [props.smartSelectItems] The select improvement items.
 * @param {string}   props.id               Id prefix for the menu; the trigger button's id is `${id}-button`.
 *
 * @returns {JSX.Element} The select menu.
 */
export const SelectMenu = ( { onSelectAll, onDeselectAll, selectedCount, totalCount, smartSelectItems = [], id } ) => {
	const svgAriaProps = useSvgAria();
	const defaultItems = useMemo( () => [
		{ key: "select-all", label: __( "Select all", "wordpress-seo" ), onClick: onSelectAll },
		{ key: "deselect-all", label: __( "Deselect all", "wordpress-seo" ), onClick: onDeselectAll },
	], [ onSelectAll, onDeselectAll ] );

	const items = applyFilters( SELECT_MENU_ITEMS_FILTER, defaultItems, { selectedCount, totalCount } );

	return (
		<DropdownMenu as="div" className="yst-relative" id={ id }>
			<DropdownMenu.Trigger as={ Button } variant="primary" size="small" className="yst-gap-1.5" id={ `${id}-button` }>
				{ __( "Select", "wordpress-seo" ) }
				<ChevronDownIcon className="yst-h-4 yst-w-4" { ...svgAriaProps } />
			</DropdownMenu.Trigger>
			{ /* 169px is the narrowest width at which the longest label ("Social descriptions") stays on one line */ }
			<DropdownMenu.List className="yst-absolute yst-z-10 yst-start-0 yst-top-full yst-mt-1 yst-w-[169px]">
				{ items.map( ( item ) => <SelectMenuItem key={ item.key } item={ item } /> ) }
				{ smartSelectItems.length > 0 && (
					<div role="separator" className="yst-my-1 yst-border-t yst-border-slate-200" />
				) }
				{ smartSelectItems.map( ( item ) => <SelectMenuItem key={ item.key } item={ item } /> ) }
			</DropdownMenu.List>
		</DropdownMenu>
	);
};
