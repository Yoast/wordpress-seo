import apiFetch from "@wordpress/api-fetch";

/**
 * Fetches fresh alt text for the given attachment IDs from the WP REST API.
 *
 * @param {number[]} ids Attachment IDs to fetch alt text for.
 * @returns {Promise<Map<number, string>>} Map of attachment ID to alt text.
 */
export const fetchAttachmentAlts = async( ids ) => {
	if ( ! ids.length ) {
		return new Map();
	}

	const entries = await Promise.all(
		ids.map( ( id ) =>
			apiFetch( { path: `/wp/v2/media/${ id }?_fields=id,alt_text` } )
				.then( ( media ) => [ media.id, media.alt_text ?? "" ] )
				.catch( () => [ id, "" ] )
		)
	);

	return new Map( entries );
};
