/**
 * Generates the selection toolbar's view. While loading, the previous content type's items and selection still
 * linger behind the skeleton rows, so a neutral (empty) selection is presented instead.
 *
 * @param {boolean}  isLoading   Whether the rows are still loading.
 * @param {number[]} selectedIds The currently selected item ids.
 * @param {Object[]} items       The loaded items (per page).
 * @param {number}   total       The total number of items across all pages.
 *
 * @returns {{isAllSelected: boolean, isIndeterminate: boolean, selectedCount: number, totalCount: number, hasSelection: boolean}} The selection view.
 */
export const getSelectionView = ( isLoading, selectedIds, items, total ) => {
	if ( isLoading ) {
		return { isAllSelected: false, isIndeterminate: false, selectedCount: 0, totalCount: 0, hasSelection: false };
	}
	// Only posts the user can edit are selectable, so "all selected" is measured against the editable rows.
	const selectableCount = items.filter( ( item ) => item.editable ).length;
	const selectedCount = selectedIds.length;
	const isAllSelected = selectableCount > 0 && selectedCount === selectableCount;
	return {
		isAllSelected,
		isIndeterminate: selectedCount > 0 && ! isAllSelected,
		selectedCount,
		totalCount: total,
		hasSelection: selectedCount > 0,
	};
};
