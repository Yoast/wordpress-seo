/**
 * Check if an element has hidden fields in order to use the block editor sync to core store.
 *
 * @returns {boolean} True if the element has hidden fields.
 */
export const hasHiddenFields = () => {
	const element = document.getElementById( "wpseo_meta" ) || document.getElementById( "yoast-form" );
	const inside = element?.querySelector( ".inside" );
	const hiddenFields = inside?.querySelectorAll( "input[type=hidden]" );
	if ( hiddenFields && hiddenFields.length ) {
		return true;
	}
	return false;
};
