import ChevronDownIcon from "@heroicons/react/solid/ChevronDownIcon";
import { Slot } from "@wordpress/components";
import { useMemo } from "@wordpress/element";
import { applyFilters } from "@wordpress/hooks";
import { __, sprintf } from "@wordpress/i18n";
import { Button, Checkbox, DropdownMenu, useSvgAria } from "@yoast/ui-library";
import { BULK_ACTIONS_SLOT, SELECT_MENU_ITEMS_FILTER } from "../constants";

/**
 * The "Select" menu.
 *
 * @param {Object}   props               The props.
 * @param {Function} props.onSelectAll   Selects every row.
 * @param {Function} props.onDeselectAll Clears the selection.
 * @param {number}   props.selectedCount The number of selected rows.
 * @param {number}   props.totalCount    The total number of rows.
 *
 * @returns {JSX.Element} The select menu.
 */
const SelectMenu = ( { onSelectAll, onDeselectAll, selectedCount, totalCount } ) => {
	const svgAriaProps = useSvgAria();
	const defaultItems = useMemo( () => [
		{ key: "select-all", label: __( "Select all", "wordpress-seo" ), onClick: onSelectAll },
		{ key: "deselect-all", label: __( "Deselect all", "wordpress-seo" ), onClick: onDeselectAll },
	], [ onSelectAll, onDeselectAll ] );

	const items = applyFilters( SELECT_MENU_ITEMS_FILTER, defaultItems, { selectedCount, totalCount } );

	return (
		<DropdownMenu as="div" className="yst-relative">
			<DropdownMenu.Trigger as={ Button } variant="primary" size="small" className="yst-gap-1.5">
				{ __( "Select", "wordpress-seo" ) }
				<ChevronDownIcon className="yst-h-4 yst-w-4 yst--me-1" { ...svgAriaProps } />
			</DropdownMenu.Trigger>
			<DropdownMenu.List className="yst-absolute yst-z-10 yst-start-0 yst-top-full yst-mt-1 yst-w-56">
				{ items.map( ( item ) => (
					<DropdownMenu.ButtonItem
						key={ item.key }
						className="yst-flex yst-justify-start yst-px-4 yst-py-2 yst-font-normal yst-text-slate-800"
						onClick={ item.onClick }
					>
						{ item.label }
					</DropdownMenu.ButtonItem>
				) ) }
			</DropdownMenu.List>
		</DropdownMenu>
	);
};

/**
 * The first toolbar row: the multiselection checkbox, the Select menu and the selected-count.
 *
 * @param {Object}   props               The props.
 * @param {string}   [props.idSuffix]    A suffix that keeps the checkbox id unique across the two tab tables.
 * @param {boolean}  props.isAllSelected Whether every row is selected.
 * @param {Function} props.onToggleAll   Toggles between selecting every row and none.
 * @param {Function} props.onSelectAll   Selects every row.
 * @param {Function} props.onDeselectAll Clears the selection.
 * @param {number}   props.selectedCount      The number of selected rows.
 * @param {number}   props.totalCount         The total number of rows.
 * @param {string}   [props.contentTypeLabel] The active content type label, used in the selected-count copy.
 *
 * @returns {JSX.Element} The selection toolbar.
 */
export const SelectionToolbar = ( { idSuffix = "", isAllSelected, onToggleAll, onSelectAll, onDeselectAll, selectedCount, totalCount, contentTypeLabel } ) => {
	const noun = contentTypeLabel ? contentTypeLabel.toLowerCase() : __( "items", "wordpress-seo" );

	return (
		<div className="yst-flex yst-items-center yst-gap-4">
			<Checkbox
				id={ `bulk-editor-select-all${ idSuffix }` }
				name={ `bulk-editor-select-all${ idSuffix }` }
				value="all"
				aria-label={ __( "Select all", "wordpress-seo" ) }
				checked={ isAllSelected }
				onChange={ onToggleAll }
			/>
			<SelectMenu
				onSelectAll={ onSelectAll }
				onDeselectAll={ onDeselectAll }
				selectedCount={ selectedCount }
				totalCount={ totalCount }
			/>
			{ selectedCount > 0 && (
				<span className="yst-font-medium yst-text-slate-800">
					{ sprintf(
						/* translators: %1$d expands to the number of selected items, %2$d to the total, %3$s to the content type (e.g. pages). */
						__( "%1$d of %2$d %3$s selected", "wordpress-seo" ),
						selectedCount,
						totalCount,
						noun
					) }
				</span>
			) }
		</div>
	);
};

/**
 * The AI generate buttons in Free. These are upsell affordances.
 *
 * @returns {JSX.Element} The AI generate buttons.
 */
const FreeBulkActions = () => (
	<>
		<Button variant="ai-secondary" size="small" className="yst-bg-white">
			{ __( "Generate SEO titles", "wordpress-seo" ) }
		</Button>
		<Button variant="ai-secondary" size="small" className="yst-bg-white">
			{ __( "Generate meta descriptions", "wordpress-seo" ) }
		</Button>
	</>
);

/**
 * The AI generate buttons toolbar row, shown when rows are selected. In Premium the buttons fill the
 * {@link BULK_ACTIONS_SLOT} slot.
 *
 * @param {Object}  props           The props.
 * @param {boolean} props.isPremium Whether Premium is active.
 *
 * @returns {JSX.Element} The bulk actions row content.
 */
export const BulkActions = ( { isPremium } ) => (
	<div className="yst-flex yst-items-center yst-gap-3 yst-border-y yst-border-slate-200 yst-bg-slate-100 yst-px-4 yst-py-3">
		{ isPremium ? <Slot name={ BULK_ACTIONS_SLOT } /> : <FreeBulkActions /> }
	</div>
);
