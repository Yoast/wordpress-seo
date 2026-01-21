/**
 * Stores the last clicked AI button info for focus restoration.
 * This allows accurate focus restoration when the toast is dismissed,
 * since both metabox and sidebar buttons share the same ID.
 */

let clickedButtonInfo = null;

/**
 * Finds the collapsible container ID for the given button element.
 *
 * @param {HTMLElement} element The button element.
 * @returns {string|null} The container ID, or null if not found.
 */
const findContainerId = ( element ) => {
	const collapsible = element.closest( "[id^='yoast-'][id$='-collapsible-sidebar'], [id^='yoast-'][id$='-collapsible-metabox']" );
	return collapsible ? collapsible.id : null;
};

/**
 * Stores info about the clicked AI button for later focus restoration.
 *
 * @param {HTMLElement} element The button that was clicked.
 * @returns {void}
 */
export const setClickedAIButton = ( element ) => {
	if ( ! element ) {
		clickedButtonInfo = null;
		return;
	}
	clickedButtonInfo = {
		buttonId: element.id,
		containerId: findContainerId( element ),
	};
};

/**
 * Gets the stored clicked AI button element by querying the DOM.
 *
 * @returns {HTMLElement|null} The button element, or null if not found.
 */
export const getClickedAIButton = () => {
	if ( ! clickedButtonInfo ) {
		return null;
	}

	const { buttonId, containerId } = clickedButtonInfo;

	// If we have a container ID, look for the button within that container.
	if ( containerId ) {
		const container = document.getElementById( containerId );
		if ( container ) {
			return container.querySelector( `#${ buttonId }` );
		}
	}

	// Fallback to finding the first button with that ID.
	return document.getElementById( buttonId );
};

/**
 * Clears the stored clicked AI button info.
 *
 * @returns {void}
 */
export const clearClickedAIButton = () => {
	clickedButtonInfo = null;
};
