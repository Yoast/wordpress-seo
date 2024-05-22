import { subscribe } from "@wordpress/data";
import { debounce, forEach, isEqual } from "lodash";
import createWatcher from "../../helpers/create-watcher";
import { STORES, SYNC_TIME } from "../../shared-admin/constants";
import { getFieldDispatchers, getFieldSelectors, getProductMetadata } from "./store";
import { transformDispatchers, transformFromMetadataValue, transformMetadataKeyToField } from "./transform";

/**
 * Creates an updater.
 * @returns {function} The updater.
 */
const createUpdater = () => {
	const selectors = getFieldSelectors();
	const dispatchers = transformDispatchers( getFieldDispatchers(), selectors );

	/**
	 * Syncs the data to our store.
	 * @param {{key: string, value: *}[]} data The collected data.
	 * @returns {void}
	 */
	return ( data ) => {
		if ( ! data ) {
			return;
		}

		forEach( data, ( { key, value } ) => {
			const field = transformMetadataKeyToField( key );
			if ( ! field || ! selectors[ field ] ) {
				return;
			}

			const transformedValue = transformFromMetadataValue( field, value );
			if ( ! isEqual( transformedValue, selectors[ field ]() ) ) {
				dispatchers[ field ]( transformedValue );
			}
		} );
	};
};

/**
 * Initializes the sync: from product metadata to Yoast editor store.
 * @param {number} productId The product ID.
 * @returns {function} The un-subscriber.
 */
export const syncFromMetadata = ( productId ) => subscribe(
	debounce(
		createWatcher(
			getProductMetadata.bind( null, productId ),
			createUpdater()
		),
		SYNC_TIME.wait,
		{ maxWait: SYNC_TIME.max }
	),
	STORES.wp.core
);
