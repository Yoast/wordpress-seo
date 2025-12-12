import { useCallback } from "@wordpress/element";

/**
 * Custom hook for handling schema toggle changes with programmatic disable and confirmation modals.
 *
 * @param {Object} options The options.
 * @param {boolean} options.isDisabledProgrammatically Whether the toggle is disabled programmatically.
 * @param {boolean} options.confirmBeforeDisable Whether to show confirmation before disabling.
 * @param {string} options.fieldName The field name to update.
 * @param {Function} options.setFieldValue The function to set the field value.
 * @param {Function} options.onShowProgrammaticallyDisabledModal Callback to show the programmatically disabled modal.
 * @param {Function} options.onShowDisableConfirmModal Callback to show the disable confirmation modal.
 * @returns {Function} The toggle change handler.
 */
const useSchemaToggleHandler = ( {
	isDisabledProgrammatically,
	confirmBeforeDisable,
	fieldName,
	setFieldValue,
	onShowProgrammaticallyDisabledModal,
	onShowDisableConfirmModal,
} ) => {
	return useCallback( ( newValue ) => {
		if ( isDisabledProgrammatically && newValue ) {
			// User is trying to enable but it's disabled programmatically (show info modal)
			onShowProgrammaticallyDisabledModal();
		} else if ( confirmBeforeDisable && ! newValue ) {
			// User is trying to disable (show confirmation modal)
			onShowDisableConfirmModal();
		} else {
			// Just apply the change
			setFieldValue( fieldName, newValue );
		}
	}, [
		isDisabledProgrammatically,
		confirmBeforeDisable,
		fieldName,
		setFieldValue,
		onShowProgrammaticallyDisabledModal,
		onShowDisableConfirmModal,
	] );
};

export default useSchemaToggleHandler;
