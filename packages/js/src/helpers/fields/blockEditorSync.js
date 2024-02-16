
import { dispatch, select, subscribe } from "@wordpress/data";
import { debounce, forEach, pickBy } from "lodash";
import createWatcher, { createCollectorFromObject } from "../../helpers/create-watcher";
import { STORE, CORE_EDITOR_STORE, SYNC_TIME, METADATA_IDS } from "../../constants";

/**
 * Retrieves the focus keyphrase.
 * @returns {string} The focus keyphrase.
 */
const getFocusKeyphrase = () => select( STORE )?.getFocusKeyphrase();

/**
 * Retrieve facebook image id.
 * @returns {string} The facebook image id.
 */
const getFacebookImageId = () => select( STORE )?.getFacebookImageId();

const getNoIndex = () => select( STORE )?.getNoIndex();

/**
 * Creates an updater.
 * @returns {function} The updater.
 */
const createUpdater = () => {
	const { editPost } = dispatch( CORE_EDITOR_STORE );

	/**
	 * Syncs the data to the WP entity record.
	 * @param {Object} data The collected data.
	 * @returns {void}
	 */
	return ( data ) => {
		// Unfortunately, we need to pass the full metadata to update a part of it.
		const metadata = select( CORE_EDITOR_STORE ).getCurrentPost().meta;
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
			noIndex: getNoIndex,
		} ),
		createUpdater()
	), SYNC_TIME.wait, { maxWait: SYNC_TIME.max } ), STORE );
};

export default blockEditorSync;
