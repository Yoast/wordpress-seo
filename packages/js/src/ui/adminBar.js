/**
 * Updates the traffic light present on the page
 *
 * @param {Object} indicator The indicator for the keyword score.
 *
 * @returns {void}
 */
export function update( indicator ) {
	jQuery( "#wp-admin-bar-wpseo-menu .wpseo-score-icon" )
		.attr( "title", indicator.screenReaderText )
		.attr( "class", "wpseo-score-icon " + indicator.className )
		.find( ".wpseo-score-text" ).text( indicator.screenReaderText );
}
