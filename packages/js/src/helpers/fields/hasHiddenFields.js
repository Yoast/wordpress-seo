/**
 * Check if an element has hidden fields in order to use the block editor sync to core store.
 *
 * @returns {boolean} True if the element has hidden fields.
 */
export const hasHiddenFields = () => {
	var element = document.getElementById( "wpseo_meta" );
	console.log( element );
	if ( element ) {
		var inputs = element.getElementsByTagName( "input" );
		for ( var i = 0; i < inputs.length; i++ ) {
			if ( inputs[ i ].type === "hidden" ) {
				return true;
			}
		}
	}
	return false;
};
