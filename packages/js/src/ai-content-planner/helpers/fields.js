/**
 * Helper function to update the hidden fields of the post meta.
 *
 * @param {string} id The ID of the input element to update.
 * @returns {void}
 */
const updateInput = ( id ) => {
	const input = document.getElementById( id );
	if ( input ) {
		input.value = "1";
	}
};

/**
 * A Helper function to get the value of the hidden fields of the post meta.
 *
 * @param {string} id The ID of the input element to get the value from.
 * @returns {string|undefined} The value of the input element.
 */
const getInputValue = ( id ) => {
	return document.getElementById( id )?.value;
};

/**
 * Helper function to get whether the banner is dismissed from the hidden input.
 *
 * @returns {boolean} True if the banner is dismissed, false otherwise.
 */
export const getIsBannerDismissedFromInput = () => getInputValue( "yoast_wpseo_is_content_planner_banner_dismissed" ) === "1";

/**
 * Helper function to get the value of whether the banner is rendered.
 * @returns {boolean} True if the banner is rendered, false otherwise.
 */
export const getIsBannerRenderedFromInput = () => getInputValue( "yoast_wpseo_is_content_planner_banner_rendered" ) === "1";

/**
 * Helper function to mark the banner as rendered in the hidden input.
 *
 * @returns {void}
 */
export const setBannerRenderedInput = () => {
	updateInput( "yoast_wpseo_is_content_planner_banner_rendered" );
};

/**
 * Helper function to mark the banner as dismissed in the hidden input.
 *
 * @returns {void}
 */
export const setBannerDismissedInput = () => {
	updateInput( "yoast_wpseo_is_content_planner_banner_dismissed" );
};
