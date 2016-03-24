
var placeholderTemplate = require( "../templates" ).imagePlaceholder;

/**
 * Sets the placeholder with a given value.
 *
 * @param {Object} imageContainer The location to put the placeholder in.
 * @param {string} placeholder The value for the placeholder.
 * @param {bool} isError When the placeholder should an error.
 */
function setImagePlaceholder( imageContainer, placeholder, isError ) {
	var classNames = [ "social-image-placeholder" ];
	isError = isError || false;

	if ( isError ) {
		classNames.push( "social-image-placeholder--error" );
	}

	imageContainer.innerHTML = placeholderTemplate( {
		className : classNames.join( " " ),
		placeholder : placeholder
	} );
}

module.exports= setImagePlaceholder;