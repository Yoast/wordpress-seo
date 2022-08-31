export const ADD_CHECKLIST = "ADD_CHECKLIST";

/**
 * Adds a checklist to the pre-publish box.
 *
 * @param {string} name The name of the checklist item.
 * @param {Object} data The checklist data, consisting of a label, score and score value.
 *
 * @returns {Object} An action for redux.
 */
export function addChecklist( name, data ) {
	return {
		type: ADD_CHECKLIST,
		name,
		data,
	};
}
