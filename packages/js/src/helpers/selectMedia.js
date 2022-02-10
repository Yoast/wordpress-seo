/**
 * Strips an attachment to an object with what we want.
 *
 * @param {wp.media.model.Attachment} attachment A WordPress media attachment.
 *
 * @returns {Object} Image attributes.
 */
const toImage = ( attachment ) => ( {
	type: attachment.subtype,
	width: attachment.width,
	height: attachment.height,
	url: attachment.url,
	id: attachment.id,
	sizes: attachment.sizes,
	// Use fallbacks: the media title or the filename without extension.
	alt: attachment.alt || attachment.title || attachment.name,
} );

/**
 * Function to get the media object and hook the right action dispatchers.
 *
 * @param {Function} onSelect Callback function received from openMedia. Gets object image' as an argument.
 *
 * @returns {wp.media.view.MediaFrame} A media workflow.
 */
function getMedia( onSelect ) {
	const media = window.wp.media();

	// Listens for the selection of an image. Then gets the right data and dispatches the data to the store.
	media.on( "select", () => {
		const selected = media.state().get( "selection" ).first();

		onSelect( toImage( selected.attributes ) );
	} );

	return media;
}

/**
 * Fetches the attachment via WP media.
 *
 * @param {number|string} id The attachment ID to fetch.
 *
 * @returns {Promise} The promise of an attachment. Can be rejected.
 */
export function fetchAttachment( id ) {
	return new Promise( ( resolve, reject ) => {
		if ( ! window.wp.media.attachment ) {
			reject();
		}

		window.wp.media.attachment( id ).fetch()
			.then( attachment => {
				resolve( toImage( attachment ) );
			} )
			.catch( () => reject() );
	} );
}

/**
 * Function to open the media instance.
 *
 * @param {Function} onSelect Callback function passed through to getMedia.
 *
 * @returns {void}
 */
export function openMedia( onSelect ) {
	getMedia( onSelect ).open();
}
