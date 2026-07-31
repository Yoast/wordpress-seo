import CheckIcon from "@heroicons/react/outline/CheckIcon";
import XIcon from "@heroicons/react/outline/XIcon";
import { Slot } from "@wordpress/components";
import { useEffect, useId, useRef } from "@wordpress/element";
import { __, _n, sprintf } from "@wordpress/i18n";
import { Button, Checkbox, useSvgAria, useToggleState } from "@yoast/ui-library";
import { BULK_ACTIONS_SLOT, BULK_NOTICES_SLOT } from "../constants";
import { useAiUpsell } from "../hooks/use-ai-upsell";
import { DismissibleAlert } from "./dismissible-alert";
import { OverviewExclusionNotice } from "./overview-exclusion-notice";
import { OverviewSelectionNotice } from "./overview-selection-notice";
import { UpsellModal } from "./upsell-modal";
import { SelectMenu } from "./select-menu";

/**
 * The first toolbar row: the multiselection checkbox, the Select menu and the selected-count.
 *
 * @param {Object}   props               The props.
 * @param {string}   [props.idSuffix]    A suffix that keeps the checkbox id unique across the two tab tables.
 * @param {boolean}  props.isAllSelected Whether every row is selected.
 * @param {boolean}  [props.isIndeterminate] Whether only some rows are selected (renders the checkbox as a minus).
 * @param {Function} props.onToggleAll   Toggles between selecting every row and none.
 * @param {Function} props.onSelectAll   Selects every row.
 * @param {Function} props.onDeselectAll Clears the selection.
 * @param {number}   props.selectedCount      The number of selected rows.
 * @param {number}   props.totalCount         The total number of rows.
 * @param {string}   [props.contentTypeLabel] The active content type label, used in the selected-count copy.
 * @param {Object[]} [props.smartSelectItems] The quality-based Select-menu items ({key, label, ariaLabel, icon, onClick}).
 *
 * @returns {JSX.Element} The selection toolbar.
 */
export const SelectionToolbar = ( { idSuffix = "", isAllSelected, isIndeterminate = false, onToggleAll, onSelectAll, onDeselectAll, selectedCount, totalCount, contentTypeLabel, smartSelectItems = [] } ) => {
	const noun = contentTypeLabel ? contentTypeLabel.toLowerCase() : __( "items", "wordpress-seo" );

	const checkboxRef = useRef( null );
	useEffect( () => {
		if ( checkboxRef.current ) {
			checkboxRef.current.indeterminate = isIndeterminate;
		}
	}, [ isIndeterminate ] );

	return (
		<div className="yst-flex yst-items-center yst-gap-4">
			<Checkbox
				ref={ checkboxRef }
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
				smartSelectItems={ smartSelectItems }
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
 * The AI generate buttons in Free; each opens the upsell modal.
 *
 * @param {Object} props             The props.
 * @param {string} props.contentType The active content type, used to pick the upsell variant.
 *
 * @returns {JSX.Element} The AI generate buttons.
 */
const FreeBulkActions = ( { contentType } ) => {
	const upsell = useAiUpsell( contentType );
	const [ isUpsellOpen, , , openUpsell, closeUpsell ] = useToggleState( false );

	return (
		<>
			<Button variant="ai-secondary" size="small" className="yst-bg-white" onClick={ openUpsell }>
				{ __( "Generate SEO titles", "wordpress-seo" ) }
			</Button>
			<Button variant="ai-secondary" size="small" className="yst-bg-white" onClick={ openUpsell }>
				{ __( "Generate meta descriptions", "wordpress-seo" ) }
			</Button>
			<UpsellModal isOpen={ isUpsellOpen } onClose={ closeUpsell } { ...upsell } />
		</>
	);
};

/**
 * The Save edits / Cancel edits actions for pending manual edits.
 *
 * @param {Object}   props             The props.
 * @param {number}   props.editCount   The number of rows with unsaved manual edits.
 * @param {Function} props.onApplyAll  Saves every row's open edits.
 * @param {Function} props.onDiscardAll Discards every row's open edits.
 * @param {boolean}  [props.isApplying=false] Whether an apply-all is in flight; disables both actions.
 *
 * @returns {JSX.Element} The manual review actions.
 */
export const ManualReviewActions = ( { editCount, onApplyAll, onDiscardAll, isApplying = false } ) => {
	// Couple the count summary to each action, so screen readers announce it.
	const summaryId = useId();
	const svgAriaProps = useSvgAria();

	return (
		<div className="yst-grow yst-flex yst-justify-end yst-items-center yst-gap-4">
			<span id={ summaryId } className="yst-text-sm yst-font-medium yst-text-slate-800">
				{ sprintf(
					/* translators: %d expands to the number of rows with unsaved changes. */
					_n( "%d row with unsaved changes", "%d rows with unsaved changes", editCount, "wordpress-seo" ),
					editCount
				) }
			</span>
			<div className="yst-flex yst-gap-2">
				<Button variant="secondary" size="small" className="yst-gap-1.5" onClick={ onApplyAll } disabled={ isApplying } aria-describedby={ summaryId }>
					<CheckIcon className="yst-h-4 yst-w-4 yst-text-green-500" { ...svgAriaProps } />
					{ __( "Save edits", "wordpress-seo" ) }
				</Button>
				<Button variant="secondary" size="small" className="yst-gap-1.5" onClick={ onDiscardAll } disabled={ isApplying } aria-describedby={ summaryId }>
					<XIcon className="yst-h-4 yst-w-4 yst-text-red-500" { ...svgAriaProps } />
					{ __( "Cancel edits", "wordpress-seo" ) }
				</Button>
			</div>
		</div>
	);
};

/**
 * The inline error shown when a batch "Save edits" had one or more rows fail to save.
 *
 * @param {Object}   props           The props.
 * @param {Function} props.onDismiss Dismisses the notice.
 *
 * @returns {JSX.Element} The save-error notice.
 */
export const ManualSaveErrorNotice = ( { onDismiss } ) => (
	<DismissibleAlert variant="error" role="alert" onDismiss={ onDismiss }>
		<div className="yst-flex yst-flex-col yst-gap-1">
			<span className="yst-block yst-font-medium">{ __( "Couldn't save your edits.", "wordpress-seo" ) }</span>
			<span className="yst-font-normal">{ __( "Something went wrong. Please try again.", "wordpress-seo" ) }</span>
		</div>
	</DismissibleAlert>
);

/**
 * The overview-selection truncation and exclusion notices, the Free save-error notice, and the alerts slot
 * Premium fills (e.g. its AI alerts). Only rendered on the active tab, so each tab has a single slot to target.
 * The truncation and exclusion notices are independent and can show at the same time.
 *
 * @param {Object}   props                      The props.
 * @param {number}   [props.preselectedTotal]   How many items were selected on the WP admin overview; shows the truncation notice.
 * @param {Function} [props.onDismissPreselection] Dismisses the truncation notice.
 * @param {boolean}  [props.hasExcludedPreselected] Whether carried-over items were dropped; shows the exclusion notice.
 * @param {Function} [props.onDismissExclusion] Dismisses the exclusion notice.
 * @param {boolean}  [props.hasSaveError]       Whether the last apply-all failed; shows the save-error notice.
 * @param {Function} [props.onDismissSaveError] Dismisses the save-error notice.
 * @param {number[]} props.selectedIds          The ids of the selected rows, passed to the notices fill.
 * @param {string}   props.activeFieldSet       The active field set, passed to the notices fill.
 * @param {string}   props.contentType          The active content type, passed to the notices fill.
 * @param {string}   [props.contentTypeLabel]   The active content type label (plural), passed to the notices fill.
 * @param {string}   [props.contentTypeSingularLabel] The active content type singular label, passed to the notices fill.
 *
 * @returns {JSX.Element} The notices region.
 */
const BulkActionsNotices = ( {
	preselectedTotal = 0, onDismissPreselection, hasExcludedPreselected = false, onDismissExclusion, hasSaveError, onDismissSaveError,
	selectedIds, activeFieldSet, contentType, contentTypeLabel, contentTypeSingularLabel,
} ) => (
	<>
		<OverviewSelectionNotice total={ preselectedTotal } onDismiss={ onDismissPreselection } />
		<OverviewExclusionNotice hasExclusions={ hasExcludedPreselected } onDismiss={ onDismissExclusion } />
		{ hasSaveError && <ManualSaveErrorNotice onDismiss={ onDismissSaveError } /> }
		<Slot
			name={ BULK_NOTICES_SLOT }
			fillProps={ { selectedIds, activeFieldSet, contentType, contentTypeLabel, contentTypeSingularLabel } }
		/>
	</>
);

/**
 * The padded action band: Free's AI generate buttons (when AI is enabled), Premium's AI slot, and the manual
 * review actions when a row has unsaved edits.
 *
 * @param {Object}   props                The props.
 * @param {boolean}  props.isPremium      Whether Premium is active.
 * @param {boolean}  props.isAiEnabled    Whether the AI feature is enabled; gates Free's AI affordances.
 * @param {boolean}  props.isActive       Whether this is the active tab; only the active tab renders the slot and actions.
 * @param {number[]} props.selectedIds    The ids of the selected rows, passed to the AI slot.
 * @param {string}   props.activeFieldSet The active field set, passed to the AI slot.
 * @param {string}   props.contentType    The active content type (also the Free upsell variant).
 * @param {boolean}  [props.hasUnsavedEdits] Whether a row has unsaved manual edits.
 * @param {number}   [props.editCount]    The number of rows with unsaved manual edits.
 * @param {Function} [props.onApplyAll]   Saves every row's open edits.
 * @param {Function} [props.onDiscardAll] Discards every row's open edits.
 * @param {boolean}  [props.isApplyingAll] Whether an apply-all is in flight; disables the review actions.
 *
 * @returns {JSX.Element} The action band.
 */
const BulkActionsBand = ( {
	isPremium, isAiEnabled, isActive, selectedIds, activeFieldSet, contentType, hasUnsavedEdits, editCount, onApplyAll, onDiscardAll, isApplyingAll,
} ) => (
	<div className="yst-flex yst-items-center yst-gap-3 yst-border-y yst-border-slate-200 yst-bg-slate-100 yst-px-4 yst-py-3">
		{ ! isPremium && isAiEnabled && <FreeBulkActions contentType={ contentType } /> }
		{ isActive && (
			<Slot name={ BULK_ACTIONS_SLOT } fillProps={ { selectedIds, activeFieldSet, contentType, hasUnsavedEdits } } />
		) }
		{ isActive && hasUnsavedEdits && (
			<ManualReviewActions editCount={ editCount } onApplyAll={ onApplyAll } onDiscardAll={ onDiscardAll } isApplying={ isApplyingAll } />
		) }
	</div>
);

/**
 * The AI generate buttons toolbar row, shown when rows are selected. In Premium the active tab's slot is filled
 * with the AI buttons (the fill receives `fillProps`); in Free they open the upsell modal. The notices slot above
 * it is full-bleed (outside the padded band), so Premium can fill it with a full-width row (e.g. an alert).
 *
 * @param {Object}   props                The props.
 * @param {boolean}  props.isPremium      Whether Premium is active.
 * @param {boolean}  [props.isAiEnabled=false] Whether the AI feature is enabled in the global settings. Gates the AI
 *                                         affordances (Free's upsell buttons; Premium fills its own slot only when on)
 *                                         without touching any non-AI actions the band may host.
 * @param {boolean}  props.isActive       Whether this is the active tab. Only the active tab renders the slots, so the
 *                                        Premium fill has a single slot to target (each tab renders its own bar).
 * @param {number[]} props.selectedIds      The ids of the selected rows.
 * @param {string}   props.activeFieldSet     The active tab/field set (Search or Social), which drives the buttons.
 * @param {string}   props.contentType        The active content type (also the Free upsell variant).
 * @param {string}   [props.contentTypeLabel] The active content type label (plural), passed to the notices fill for its copy.
 * @param {string}   [props.contentTypeSingularLabel] The active content type singular label, passed to the notices fill.
 * @param {boolean}  [props.hasUnsavedEdits]  Whether a row has unsaved manual edits, passed to the actions fill so Premium
 *                                             can disable the AI buttons while edits are in progress.
 * @param {number}   [props.editCount]        The number of rows with unsaved manual edits, shown in the review summary.
 * @param {Function} [props.onApplyAll]       Saves every row's open edits.
 * @param {Function} [props.onDiscardAll]     Discards every row's open edits.
 * @param {boolean}  [props.isApplyingAll]    Whether an apply-all is in flight; disables the review actions.
 * @param {boolean}  [props.hasSaveError]     Whether the last apply-all failed; shows the inline save-error notice.
 * @param {Function} [props.onDismissSaveError] Dismisses the save-error notice.
 * @param {number}   [props.preselectedTotal] How many items were selected on the WP admin overview; shows the truncation notice.
 * @param {Function} [props.onDismissPreselection] Dismisses the truncation notice.
 * @param {boolean}  [props.hasExcludedPreselected] Whether carried-over items were dropped; shows the exclusion notice.
 * @param {Function} [props.onDismissExclusion] Dismisses the exclusion notice.
 *
 * @returns {JSX.Element} The bulk actions row content.
 */
export const BulkActions = ( {
	isPremium, isAiEnabled = false, isActive, selectedIds, activeFieldSet, contentType, contentTypeLabel, contentTypeSingularLabel,
	hasUnsavedEdits, editCount, onApplyAll, onDiscardAll, isApplyingAll, hasSaveError, onDismissSaveError,
	preselectedTotal, onDismissPreselection, hasExcludedPreselected, onDismissExclusion,
} ) => (
	<div className="yst-flex yst-flex-col">
		{ isActive && (
			<BulkActionsNotices
				preselectedTotal={ preselectedTotal }
				onDismissPreselection={ onDismissPreselection }
				hasExcludedPreselected={ hasExcludedPreselected }
				onDismissExclusion={ onDismissExclusion }
				hasSaveError={ hasSaveError }
				onDismissSaveError={ onDismissSaveError }
				selectedIds={ selectedIds }
				activeFieldSet={ activeFieldSet }
				contentType={ contentType }
				contentTypeLabel={ contentTypeLabel }
				contentTypeSingularLabel={ contentTypeSingularLabel }
			/>
		) }
		<BulkActionsBand
			isPremium={ isPremium }
			isAiEnabled={ isAiEnabled }
			isActive={ isActive }
			selectedIds={ selectedIds }
			activeFieldSet={ activeFieldSet }
			contentType={ contentType }
			hasUnsavedEdits={ hasUnsavedEdits }
			editCount={ editCount }
			onApplyAll={ onApplyAll }
			onDiscardAll={ onDiscardAll }
			isApplyingAll={ isApplyingAll }
		/>
	</div>
);
