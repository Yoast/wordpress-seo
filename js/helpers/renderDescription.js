var isEmpty = require( "lodash/lang/isEmpty" );

var addClass = require( "./addClass" );
var removeClass = require( "./removeClass" );

/**
 * Makes the rendered description gray if no description has been set by the user.
 *
 * @param {string} descriptionElement Target description element
 * @param {string} description Current description
 */
function renderDescription( descriptionElement, description ) {
	if ( isEmpty( description ) ) {
		addClass( descriptionElement, "desc-render" );
		removeClass( descriptionElement, "desc-default" );
	} else {
		addClass( descriptionElement, "desc-default" );
		removeClass( descriptionElement, "desc-render" );
	}
}

module.exports = renderDescription;
