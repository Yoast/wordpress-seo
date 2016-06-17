/**
 * Updates the traffic light present on the page
 *
 * @param {Object} indicator The indicator for the keyword score.
 */
function updateTrafficLight( indicator ) {
	jQuery( '.yst-traffic-light' )
		.attr( 'class', 'yst-traffic-light ' + indicator.className )
		.attr( 'alt', indicator.screenReaderText );
}

module.exports = {
	update: updateTrafficLight
};
