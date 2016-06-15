$ = jQuery;

/**
 * Updates the traffic light present on the page
 *
 * @param {Object} indicator The indicator for the keyword score.
 */
function updateTrafficLight( indicator ) {
	var trafficLight = jQuery( '.yst-traffic-light' );
	var trafficLightLink = trafficLight.closest( '.wpseo-meta-section-link' );

	// Update the traffic light image.
	trafficLight
		.attr( 'class', 'yst-traffic-light ' + indicator.className )
		.attr( 'alt', '' );

	// Update the traffic light link.
	trafficLightLink.attr( 'title', indicator.fullText );
}

module.exports = {
	update: updateTrafficLight
};
