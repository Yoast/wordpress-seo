export const ADD_CHECK_LIST = "ADD_CHECK_LIST";

/**
 * Adds a checklist to the pre-publish box.
 *
 * @param {string} name The name of the checklist item.
 * @param {Object} data The checklist data, consisting of a label, score and score value.
 *
 * @returns {Object} An action for redux.
 */
export function addCheckList( name, data ) {
	return {
		type: ADD_CHECK_LIST,
		name,
		data,
	};
}
