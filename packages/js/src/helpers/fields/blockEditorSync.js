import { dispatch, select, subscribe } from "@wordpress/data";
import { debounce, reduce, forEach } from "lodash";
import { createWatcher, createCollectorFromObject } from "../create-watcher";
import { STORES, META_FIELDS, SYNC_TIME, POST_META_KEY_PREFIX } from "../../shared-admin/constants";
import { transformMetaValue } from "./transform-meta-value";

META_FIELDS.primaryTerms = 	{
	key: "primary_terms",
	get: "getPrimaryTaxonomies",
};

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
		const postData = getEditedEntityRecord( "postType", type, id );

		if ( ! postData.meta || ! data ) {
			return;
		}

		const changedData = {};

		forEach( data, ( value, key ) => {
			const fieldKey = key.replace( POST_META_KEY_PREFIX, "" );
			if( fieldKey === "primary_terms" ) {
				return;
			}
			const transformedValue = transformMetaValue( fieldKey, value );
			if ( transformedValue !== postData.meta[ key ] ) {
				if( ! changedData.meta ){
					changedData.meta = {};
				}
				changedData.meta[ key ] = transformedValue;
			}
		} );

		const primaryTerms = data[ `${POST_META_KEY_PREFIX}primary_terms` ];
		
		if( primaryTerms ) {
			forEach( primaryTerms, ( value, key ) => {
				const fieldKey = `primary_${key}`;
				const transformedValue = transformMetaValue( fieldKey, value );
				if ( transformedValue !== postData[ `${POST_META_KEY_PREFIX}primary_terms` ][ key ] ) {
					if( ! changedData[ `${POST_META_KEY_PREFIX}primary_terms` ] ){
						changedData[ `${POST_META_KEY_PREFIX}primary_terms` ] = {};
					}
					changedData[ `${POST_META_KEY_PREFIX}primary_terms` ][key] = transformedValue;
				}
			} );
		
		}

		if ( changedData ) {
			editPost( changedData );
		}
	};
};

/**
 * Initializes the sync: from Yoast editor store to core editor store.
 * @returns {function} The un-subscriber.
 */
export const blockEditorSync = () => {
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
		} ),
		createUpdater()
	), SYNC_TIME.wait, { maxWait: SYNC_TIME.max, leading: true } ), STORES.editor );
};
