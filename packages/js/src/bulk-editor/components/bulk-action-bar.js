import { Slot } from "@wordpress/components";
import { useMemo } from "@wordpress/element";
import { applyFilters } from "@wordpress/hooks";
import { __, _n, sprintf } from "@wordpress/i18n";
import { Button, Checkbox, DropdownMenu, GradientSparklesIcon } from "@yoast/ui-library";
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
	const defaultItems = useMemo( () => [
		{ key: "select-all", label: __( "Select all", "wordpress-seo" ), onClick: onSelectAll },
		{ key: "deselect-all", label: __( "Deselect all", "wordpress-seo" ), onClick: onDeselectAll },
	], [ onSelectAll, onDeselectAll ] );

	const items = applyFilters( SELECT_MENU_ITEMS_FILTER, defaultItems, { selectedCount, totalCount } );

	return (
		<DropdownMenu>
			<DropdownMenu.Trigger as={ Button } variant="primary" size="small">
				{ __( "Select", "wordpress-seo" ) }
			</DropdownMenu.Trigger>
			<DropdownMenu.List className="yst-w-56">
				{ items.map( ( item ) => (
					<DropdownMenu.ButtonItem
						key={ item.key }
						className="yst-flex yst-justify-start yst-px-4 yst-py-2 yst-font-normal"
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
 * @param {number}   props.selectedCount The number of selected rows.
 * @param {number}   props.totalCount    The total number of rows.
 *
 * @returns {JSX.Element} The selection toolbar.
 */
export const SelectionToolbar = ( { idSuffix = "", isAllSelected, onToggleAll, onSelectAll, onDeselectAll, selectedCount, totalCount } ) => (
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
		<span className="yst-font-medium yst-text-slate-600">
			{ sprintf(
				/* translators: %1$d expands to the number of selected items, %2$d to the total number of items. */
				_n( "%1$d of %2$d item selected", "%1$d of %2$d items selected", totalCount, "wordpress-seo" ),
				selectedCount,
				totalCount
			) }
		</span>
	</div>
);

/**
 * The AI usage-counter badge.
 *
 * @returns {JSX.Element} The sparks badge.
 */
const SparksBadge = () => (
	<span
		className="yst-inline-flex yst-rounded-full yst-p-px"
		style={ { backgroundImage: "linear-gradient(to bottom right, var(--yst-ai-color-pink-300), var(--yst-ai-color-purple-300))" } }
	>
		<span className="yst-inline-flex yst-items-center yst-gap-1 yst-rounded-full yst-bg-white yst-px-2.5 yst-py-1 yst-text-xs yst-font-medium yst-text-slate-700">
			<GradientSparklesIcon className="yst-h-3.5 yst-w-3.5" />
		</span>
	</span>
);

/**
 * The Free AI generate sparks with their usage-counter badge.
 *
 * @returns {JSX.Element} The Free AI generate sparks.
 */
const FreeBulkActions = () => (
	<>
		<Button variant="ai-secondary" size="small" className="yst-bg-white">
			{ __( "Generate SEO titles", "wordpress-seo" ) }
		</Button>
		<Button variant="ai-secondary" size="small" className="yst-bg-white">
			{ __( "Generate meta descriptions", "wordpress-seo" ) }
		</Button>
		<SparksBadge />
	</>
);

/**
 * The AI generate buttons toolbar row, shown when rows are selected.
 *
 * @param {Object}  props           The props.
 * @param {boolean} props.isPremium Whether Premium is active.
 *
 * @returns {JSX.Element} The bulk actions row content.
 */
export const BulkActions = ( { isPremium } ) => (
	<div className="yst-flex yst-items-center yst-gap-3 yst-px-4 yst-py-3">
		{ isPremium ? <Slot name={ BULK_ACTIONS_SLOT } /> : <FreeBulkActions /> }
	</div>
);
