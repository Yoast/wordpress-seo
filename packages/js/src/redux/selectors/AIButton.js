import { get } from "lodash";

/**
 * Returns the active AI Fixes button.
 * @param {object} state The state.
 * @returns {string} Active AI Fixes button id.
 */
export const getActiveAIFixesButton = state => get( state, "AIButton.activeAIButton", "" );

/**
 * Returns the disabled AI Fixes buttons.
 * @param {object} state The state.
 * @returns {object} The disabled buttons along with their reasons.
 */
export const getDisabledAIFixesButtons = state => get( state, "AIButton.disabledAIButtons", {} );
