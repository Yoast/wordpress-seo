/**
 * Stores the last clicked AI button element reference.
 * This allows accurate focus restoration when the toast is dismissed,
 * since both metabox and sidebar buttons share the same ID.
 */

let clickedButtonRef = null;

/**
 * Stores a reference to the clicked AI button.
 *
 * @param {HTMLElement} element The button that was clicked.
 * @returns {void}
 */
export const setClickedAIButton = ( element ) => {
	clickedButtonRef = element;
};

/**
 * Gets the stored clicked AI button reference.
 *
 * @returns {HTMLElement|null} The stored button, or null if not set.
 */
export const getClickedAIButton = () => clickedButtonRef;

/**
 * Clears the stored clicked AI button reference.
 *
 * @returns {void}
 */
export const clearClickedAIButton = () => {
	clickedButtonRef = null;
};
