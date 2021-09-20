import { noop } from "lodash";
import { APPLY_THEME_MODIFICATIONS, HANDLE_ROUTE_CHANGED, HANDLE_SAVE, REMOVE_THEME_MODIFICATIONS } from "./constants";

/**
 * Creates controls.
 *
 * @param {Object} controls The functions to create controls from.
 * @param {function} [controls.handleSave] A handle save function.
 * @param {function} [controls.handleRouteChanged] The function to handle when the route changed.
 * @param {function} [controls.applyThemeModifications] The function to apply theme modifications.
 * @param {function} [controls.removeThemeModifications] The function to remove theme modifications.
 *
 * @returns {Object} The controls.
 */
const createControls = ( {
	handleSave = noop,
	handleRouteChanged = noop,
	applyThemeModifications = noop,
	removeThemeModifications = noop,
} = {} ) => ( {
	[ HANDLE_SAVE ]: async ( { payload } ) => handleSave( payload ),
	[ HANDLE_ROUTE_CHANGED ]: async ( { payload } ) => handleRouteChanged( payload ),
	[ APPLY_THEME_MODIFICATIONS ]: async ( { payload } ) => applyThemeModifications( payload ),
	[ REMOVE_THEME_MODIFICATIONS ]: async ( { payload } ) => removeThemeModifications( payload ),
} );

export default createControls;
