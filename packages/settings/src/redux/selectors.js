import { ASYNC_STATUS } from "@yoast/admin-ui-toolkit/constants";
import { get, isEmpty, isEqual } from "lodash";

/**
 * Returns general messages.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The general messages.
 */
export function getNotifications( state ) {
	return get( state, "notifications", [] );
}

/* DATA SELECTORS */
/**
 * Returns all the data.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The data.
 */
export function getAllData( state ) {
	return get( state, "data", {} );
}

/**
 * Returns the data as found by the specified path.
 *
 * @param {Object} state The state.
 * @param {string} path The path of the data. For example: "featureToggles.copyWriting.seoAnalysis".
 * @param {*} defaultValue The value to return when the path was not found.
 *
 * @returns {*} The found data or the defaultValue if not found.
 */
export function getData( state, path, defaultValue ) {
	return get( state, [ "data", path ].filter( Boolean ).join( "." ), defaultValue );
}

/**
 * Returns the touched data as found by the specified path.
 *
 * @param {Object} state The state.
 * @param {string} path The path of the data. For example: "featureToggles.copyWriting.seoAnalysis".
 * @param {*} defaultValue The value to return when the path was not found.
 *
 * @returns {*} The found touched data or the defaultValue if not found.
 */
export function getTouchedData( state, path, defaultValue ) {
	return get( state, `touchedData.${ path }`, defaultValue );
}

/* OPTIONS SELECTORS */
/**
 * Returns the options as found by the specified path.
 *
 * @param {Object} state The state.
 * @param {string} path The path of the option. For example: "featureToggles.copyWriting.seoAnalysis".
 * @param {*} defaultValue The value to return when the path was not found.
 *
 * @returns {Object} The found options (Object), the found specific option (boolean) or the defaultValue if not found.
 */
export function getOption( state, path, defaultValue ) {
	return get( state, [ "options", path ].filter( Boolean ).join( "." ), defaultValue );
}

/**
 * Get a save error from current state for a specified path.
 * @param {Object} state The current state.
 * @param {string} path The path in state to get error for.
 * @returns {string[]} Possibly empty array of error messages.
 */
export const getSaveError = ( state, path ) => get( state, `save.errors.${ path }`, [] );

/**
 * Get the save errors from current state.
 * @param {Object} state The current state.
 * @returns {Object} Error messages.
 */
export const getSaveErrors = ( state ) => get( state, "save.errors", {} );

/**
 * Whether or not there are any save errors.
 * @param {Object} state The current state.
 * @returns {boolean} False when there are no save errors.
 */
export const hasSaveErrors = ( state ) => ! isEmpty( getSaveErrors( state ) );

/**
 * Get the status of the save async action.
 * @param {Object} state The current state.
 * @returns {string} Status of the save async action.
 */
export const getSaveStatus = ( state ) => get( state, "save.status", ASYNC_STATUS.idle );

/**
 * Get the validation error prop for usage in the components.
 *
 * @param {Object} state The current state.
 * @param {string} path The path in state to get error for.
 *
 * @returns {{isVisible: boolean, message: string}} The validation error prop.
 */
export const getValidationErrorProp = ( state, path ) => {
	const saveError = getSaveError( state, path );
	const isTouched = getTouchedData( state, path, false );

	return {
		messages: saveError,
		isVisible: ! isEmpty( saveError ) && ! isTouched,
	};
};

/* SAVED DATA SELECTORS */
/**
 * Returns all the saved data.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The saved data.
 */
export function getAllSavedData( state ) {
	return get( state, "savedData", {} );
}

/**
 * Returns whether the saved data differs from the data.
 *
 * @param {Object} state The current state.
 *
 * @returns {boolean} True when there are unsaved changes.
 */
export function hasUnsavedChanges( state ) {
	const data = getAllData( state );
	const savedData = getAllSavedData( state );

	return ! isEqual( data, savedData );
}

/* THEME MODIFICATIONS SELECTORS */
/**
 * @param {Object} state The current state.
 * @param {string} [dataPath] Optional path in state to get data from: apply or remove.
 * @returns {string} Status of the theme modifications async action.
 */
export const getThemeModificationsStatus = ( state, dataPath = "apply" ) => get( state, `themeModifications.${ dataPath }`, ASYNC_STATUS.idle );
