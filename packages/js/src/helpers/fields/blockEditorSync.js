
import { dispatch, select, subscribe } from "@wordpress/data";
import { debounce, forEach, pickBy } from "lodash";
import createWatcher, { createCollectorFromObject } from "../../helpers/create-watcher";

const METADATA_IDS = {
	focusKeyphrase: "_yoast_wpseo_focuskw",
	facebookImageId: "_yoast_wpseo_opengraph-image-id",
};

const SYNC_TIME = {
	wait: 1500,
	max: 3000,
};

/**
 * Retrieves the focus keyphrase.
 * @returns {string} The focus keyphrase.
 */
const getFocusKeyphrase = () => select( "yoast-seo/editor" )?.getFocusKeyphrase();

/**
 * Retrieve facebook image id.
 * @returns {string} The facebook image id.
 */
const getFacebookImageId = () => select( "yoast-seo/editor" )?.getFacebookImageId();

/**
 * Creates an updater.
 * @returns {function} The updater.
 */
const createUpdater = () => {
	const { editPost } = dispatch( "core/editor" );

	/**
	 * Syncs the data to the WP entity record.
	 * @param {Object} data The collected data.
	 * @returns {void}
	 */
	return ( data ) => {
		// Unfortunately, we need to pass the full metadata to update a part of it.
		const metadata = select( "core/editor" ).getCurrentPost().meta;
		if ( ! metadata || ! data ) {
			return;
		}

		const changedData = pickBy( data, ( value, key ) => value !== metadata[ METADATA_IDS[ key ] ] );

		if ( changedData ) {
			const newMetadata = {};
			forEach( changedData, ( value, key ) => {
				newMetadata[ METADATA_IDS[ key ] ] = value;
			} );
			// eslint-disable-next-line camelcase
			editPost( {
				meta: newMetadata,
			} );
		}
	};
};

/**
 * Initializes the sync: from Yoast editor store to product metadata.
 * @returns {function} The un-subscriber.
 */
const blockEditorSync = () => {
	return subscribe( debounce( createWatcher(
		createCollectorFromObject( {
			focusKeyphrase: getFocusKeyphrase,
			facebookImageId: getFacebookImageId,
		} ),
		createUpdater()
	), SYNC_TIME.wait, { maxWait: SYNC_TIME.max } ), "yoast-seo/editor" );
};

export default blockEditorSync;
