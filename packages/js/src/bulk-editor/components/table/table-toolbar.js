import AnimateHeight from "react-animate-height";

/**
 * The table toolbar, including the selection toolbar, bulk actions, and filters.
 *
 * @param {object} props The toolbar props.
 * @param {JSX.Element} [props.selectionToolbar] The selection toolbar content.
 * @param {JSX.Element} [props.filters] The filters content.
 * @param {JSX.Element} [props.bulkActions] The bulk actions content.
 * @param {boolean} [props.showBulkActions] Whether to show the bulk actions.
 * @returns {JSX.Element} The table toolbar.
 */
export const BulkEditorTableToolbar = ( { selectionToolbar, filters, bulkActions, showBulkActions } ) => {
	return <>
		{ selectionToolbar && <div className="yst-bg-slate-50 yst-p-3">
			<div className="yst-flex yst-items-center yst-justify-between yst-gap-4">
				{ selectionToolbar }
				{ filters }
			</div>
		</div> }
		{ bulkActions && (
			<div aria-hidden={ ! showBulkActions } data-testid="bulk-actions-band">
				<AnimateHeight easing="ease-in-out" duration={ 300 } height={ showBulkActions ? "auto" : 0 } animateOpacity={ true }>
					{ bulkActions }
				</AnimateHeight>
			</div>
		) }</>;
};
