/**
 * Just temporarily, should be provided through an ImageSelect prop
 */
function onSelect( image ) {
	wpDataDispatch( "yoast-seo/editor" ).setFacebookPreviewImage( {
		url: image.url,
		id: image.id,
		warnings: validateFacebookImage( image ),
	} );
}

/**
 * Function to get the media object and hook the right action dispatchers.
 *
 * @returns {void}
 */
function getMedia( media, onSelect ) {
	if ( ! media ) {
		media = window.wp.media();
		// Listens for the selection of an image. Then gets the right data and dispatches the data to the store.
		media.on( "select", () => {
			const selected = media.state().get( "selection" ).first();
			const image = {
				type: selected.attributes.subtype,
				width: selected.attributes.width,
				height: selected.attributes.height,
				url: selected.attributes.url,
				id: selected.attributes.id,
			};
			onSelect( image );
		} );
	}

	return media;
}

/**
 * Function to open the media instance.
 *
 * @returns {void}
 */
export function openMedia( media, onSelect ) {
	return getMedia( media, onSelect ).open();
}
