/**
 * Updates the traffic light present on the page
 *
 * @param {Object} indicator The indicator for the keyword score.
 *
 * @returns {void}
 */
export function update( indicator ) {
	var trafficLight = jQuery( ".yst-traffic-light" );
	var trafficLightLink = trafficLight.closest( ".wpseo-meta-section-link" );
	var trafficLightDesc = jQuery( "#wpseo-traffic-light-desc" );
	var cssClass = indicator.className || "na";

	// Update the traffic light image.
	trafficLight
		.attr( "class", "yst-traffic-light " + cssClass );

	// Update the traffic light link.
	trafficLightLink.attr( "aria-describedby", "wpseo-traffic-light-desc" );

	if ( trafficLightDesc.length > 0 ) {
		trafficLightDesc.text( indicator.screenReaderText );
	} else {
		trafficLightLink
			.closest( "li" )
			.append( "<span id='wpseo-traffic-light-desc' class='screen-reader-text'>" + indicator.screenReaderText + "</span>" );
	}
}
