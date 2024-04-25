import { dispatch, subscribe } from "@wordpress/data";
import { cloneDeep, debounce, forEach, isEqual } from "lodash";
import createWatcher, { createCollectorFromObject } from "../../helpers/create-watcher";
import { STORES, SYNC_TIME } from "../../shared-admin/constants";
import { getDefaultMetadata, getFieldSelectors, getProductMetadata } from "./store";
import { transformFieldToMetadataKey, transformToMetadataValue } from "./transform";

/**
 * Creates an updater.
 * @param {number} productId The product ID.
 * @returns {function} The updater.
 */
const createUpdater = ( productId ) => {
	const { editEntityRecord } = dispatch( STORES.wp.core );
	const defaultMetadata = getDefaultMetadata();

	/**
	 * Syncs the data to our store.
	 * @param {?Object<string,*>} data The collected data.
	 * @returns {void}
	 */
	return ( data ) => {
		if ( ! data ) {
			return;
		}

		// Unfortunately, we need to pass the full metadata to update a part of it.
		const metadata = cloneDeep( getProductMetadata( productId ) );
		if ( ! metadata ) {
			return;
		}

		let isChanged = false;
		forEach( data, ( value, field ) => { // eslint-disable-line complexity
			const metaKey = transformFieldToMetadataKey( field );
			if ( ! metaKey ) {
				return;
			}
			const transformedValue = transformToMetadataValue( field, value );
			const metadataItemIndex = metadata.findIndex( ( { key } ) => key === metaKey );

			// Remove the metadata item if it's the same as the default.
			if ( transformedValue === defaultMetadata[ metaKey ] ) {
				// Don't remove the default if it is already in the database (i.e. it has an ID).
				if ( metadataItemIndex !== -1 && ! ( "id" in metadata[ metadataItemIndex ] ) ) {
					metadata.splice( metadataItemIndex, 1 );
					isChanged = true;
				}
				return;
			}

			// Add or update the metadata item.
			if ( metadataItemIndex === -1 ) {
				metadata.push( { key: metaKey, value: transformedValue } );
				isChanged = true;
			} else if ( ! isEqual( metadata[ metadataItemIndex ]?.value, transformedValue ) ) {
				metadata[ metadataItemIndex ].value = transformedValue;
				isChanged = true;
			}
		} );

		if ( isChanged ) {
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
export const syncToMetadata = ( productId ) => subscribe(
	debounce(
		createWatcher(
			createCollectorFromObject( getFieldSelectors() ),
			createUpdater( productId )
		),
		SYNC_TIME.wait,
		{ maxWait: SYNC_TIME.max }
	),
	STORES.editor
);
