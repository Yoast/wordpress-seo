import { store } from "@wordpress/core-data";
import { dispatch, subscribe } from "@wordpress/data";
import { debounce, forEach, identity } from "lodash";
import createWatcher from "../../helpers/create-watcher";
import { STORES, SYNC_TIME } from "../constants";
import { METADATA_IDS } from "./constants";
import { getFocusKeyphrase, getMetaDescription, getProductMetadata, getSeoTitle } from "./selectors";

const MAP_ID_TO_GETTER = {
	focusKeyphrase: getFocusKeyphrase,
	seoTitle: getSeoTitle,
	metaDescription: getMetaDescription,
};

/**
 * Creates an updater.
 * @returns {function} The updater.
 */
const createUpdater = () => {
	const { setFocusKeyword, updateAnalysisData } = dispatch( STORES.editor );

	/**
	 * Syncs the data to our store.
	 * @param {Object} data The collected data.
	 * @returns {void}
	 */
	return ( data ) => {
		if ( ! data ) {
			return;
		}

		forEach( MAP_ID_TO_GETTER, ( getValue, key ) => {
			const metadataItem = data?.find( ( { key: k } ) => k === METADATA_IDS[ key ] );
			if ( metadataItem && metadataItem?.value !== getValue() ) {
				console.log( "UPDATE", key, metadataItem.value );
				switch ( key ) {
					case [ METADATA_IDS.focusKeyphrase ]:
						setFocusKeyword( metadataItem.value );
						dispatch( STORES.editor )[ mapIdToSetter[ key ] ]( metadataItem.value );
				}
			}
		} );

		// Find the focus keyphrase and update it if it has changed.
		const focusKeyphrase = data.find( ( { key } ) => key === METADATA_IDS.focusKeyphrase )?.value;
		if ( focusKeyphrase && focusKeyphrase !== getFocusKeyphrase() ) {
			console.log( "UPDATE FOCUS KEYPHRASE", focusKeyphrase );
			setFocusKeyword( focusKeyphrase );
		}

		// Find the SEO title and update it if it has changed.
		const seoTitle = data.find( ( { key } ) => key === METADATA_IDS.seoTitle )?.value;
		if ( seoTitle ) {
			console.log( "UPDATE SEO TITLE", seoTitle );
			updateAnalysisData( { title: seoTitle } );
		}
	};
};

/**
 * Initializes the sync: from product metadata to Yoast editor store.
 * @param {number} productId The product ID.
 * @returns {function} The un-subscriber.
 */
export const syncFromMetadata = ( productId ) => {
	return subscribe( debounce( createWatcher(
		getProductMetadata.bind( null, productId ),
		createUpdater()
	), SYNC_TIME.wait, { maxWait: SYNC_TIME.max } ), store );
};
