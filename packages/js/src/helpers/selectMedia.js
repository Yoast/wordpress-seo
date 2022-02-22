/**
 * Function to get the media object and hook the right action dispatchers.
 *
 * @param {Function} onSelect Callback function received from openMedia. Gets object image' as an argument.
 *
 * @returns {void}
 */
function getMedia( onSelect ) {
	let media = null;
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
			sizes: selected.attributes.sizes,
		};
		onSelect( image );
	} );

	return media;
}

/**
 * Function to open the media instance.
 *
 * @param {Function} onSelect Callback function passed through to getMedia.
 *
 * @returns {void}
 */
export function openMedia( onSelect ) {
	return getMedia( onSelect ).open();
}
