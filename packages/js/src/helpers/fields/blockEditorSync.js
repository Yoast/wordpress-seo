import { dispatch, select, subscribe } from "@wordpress/data";
import { debounce, reduce, mapKeys, forEach } from "lodash";
import { createWatcher, createCollectorFromObject } from "../create-watcher";
import { STORES, META_FIELDS, SYNC_TIME, POST_META_KEY_PREFIX } from "../../shared-admin/constants";
import { getPrimaryTerms } from "./primaryTaxonomiesFieldsStore";
import { transformMetaValue } from "./transform-meta-value";

/**
 * Creates an updater.
 * @returns {function} The updater.
 */
const createUpdater = () => {
	const { editPost } = dispatch( STORES.wp.editor );
	const { getCurrentPost } = select( STORES.wp.editor );
	const { getEditedEntityRecord } = select( STORES.wp.core );

	/**
	 * Syncs the data to the WP entity record.
	 * @param {Object} data The collected data.
	 * @returns {void}
	 */
	return ( data ) => {
		const { type, id } = getCurrentPost();
		const metadata = getEditedEntityRecord( "postType", type, id ).meta;

		if ( ! metadata || ! data ) {
			return;
		}

		const changedData = {};

		forEach( data, ( value, key ) => {
			const fieldKey = key.replace( POST_META_KEY_PREFIX, "" );
			const transformedValue = transformMetaValue( fieldKey, value );
			const transformMetadataValue = transformMetaValue( fieldKey, metadata[ key ] );

			if ( transformedValue !== transformMetadataValue ) {
				changedData[ key ] = transformedValue;
			}
		} );

		if ( changedData ) {
			editPost( {
				meta: changedData,
			} );
		}
	};
};

/**
 * Initializes the sync: from Yoast editor store to core editor store.
 * @returns {function} The un-subscriber.
 */
export const blockEditorSync = () => {
	const primaryTaxonomiesGetters = mapKeys( getPrimaryTerms(), ( value, key ) => POST_META_KEY_PREFIX + key );

	const getters = reduce( META_FIELDS, ( acc, value ) => {
		// check if value.get is a function in select( STORES.editor ) store
		if ( typeof select( STORES.editor )[ value.get ] === "function" ) {
			acc[ POST_META_KEY_PREFIX + value.key ] = select( STORES.editor )[ value.get ];
		}
		return acc;
	}, {} );

	return subscribe( debounce( createWatcher(
		createCollectorFromObject( {
			...getters,
			...primaryTaxonomiesGetters,
		} ),
		createUpdater()
	), SYNC_TIME.wait, { maxWait: SYNC_TIME.max } ), STORES.editor );
};
