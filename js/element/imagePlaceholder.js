var placeholderTemplate = require( "../templates" ).imagePlaceholder;

/**
 * Sets the placeholder with a given value.
 *
 * @param {Object} imageContainer The location to put the placeholder in.
 * @param {string} placeholder The value for the placeholder.
 * @param {bool} isError When the placeholder should an error.
 * @param {string} modifier A css class modifier to change the styling.
 */
function setImagePlaceholder( imageContainer, placeholder, isError, modifier ) {
	var classNames = [ "social-image-placeholder" ];
	isError = isError || false;
	modifier = modifier || "";

	if ( isError ) {
		classNames.push( "social-image-placeholder--error" );
	}

	if ( "" !== modifier ) {
		classNames.push( "social-image-placeholder--" + modifier );
	}

	imageContainer.innerHTML = placeholderTemplate( {
		className: classNames.join( " " ),
		placeholder: placeholder
	} );
}

module.exports= setImagePlaceholder;
