import { store } from "@wordpress/core-data";
import { dispatch, subscribe } from "@wordpress/data";
import { cloneDeep, debounce, forEach } from "lodash";
import createWatcher, { createCollectorFromObject } from "../../helpers/create-watcher";
import { STORES, SYNC_TIME } from "../constants";
import { METADATA_IDS } from "./constants";
import { getFocusKeyphrase, getProductMetadata, getSeoTitle } from "./selectors";

/**
 * Creates an updater.
 * @param {number} productId The product ID.
 * @returns {function} The updater.
 */
const createUpdater = ( productId ) => {
	const { editEntityRecord } = dispatch( store );

	/**
	 * Syncs the data to the WP entity record.
	 * @param {Object} data The collected data.
	 * @returns {void}
	 */
	return ( data ) => {
		// Unfortunately, we need to pass the full metadata to update a part of it.
		const metadata = cloneDeep( getProductMetadata( productId ) );
		if ( ! metadata || ! data ) {
			return;
		}

		let isChanged = false;
		forEach( data, ( value, key ) => {
			const metadataItem = metadata?.find( ( { key: k } ) => k === METADATA_IDS[ key ] );
			if ( ! metadataItem ) {
				metadata.push( { key: METADATA_IDS[ key ], value } );
				isChanged = true;
			} else if ( metadataItem?.value !== value ) {
				metadataItem.value = value;
				isChanged = true;
			}
		} );

		if ( isChanged ) {
			console.log( "SYNC Yoast => WP data", metadata );
			// eslint-disable-next-line camelcase
			editEntityRecord( "postType", "product", productId, { meta_data: metadata } );
		}
	};
};

/**
 * Initializes the sync: from Yoast editor store to product metadata.
 * @param {number} productId The product ID.
 * @returns {function} The un-subscriber.
 */
export const syncToMetadata = ( productId ) => {
	return subscribe( debounce( createWatcher(
		createCollectorFromObject( {
			focusKeyphrase: getFocusKeyphrase,
			seoTitle: getSeoTitle,
		} ),
		createUpdater( productId )
	), SYNC_TIME.wait, { maxWait: SYNC_TIME.max } ), STORES.editor );
};
