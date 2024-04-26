import { dispatch, select, subscribe } from "@wordpress/data";
import { debounce, pickBy, reduce } from "lodash";
import { createWatcher, createCollectorFromObject } from "../../helpers/create-watcher";
import { STORES, META_FIELDS, SYNC_TIME, POST_META_KEY_PREFIX } from "../../shared-admin/constants";
import { getPrimaryTerms } from "./primaryTaxonomiesFieldsStore";
import { transformMetaValue } from "./transform-meta-value";

/**
 * Creates an updater.
 * @returns {function} The updater.
 */
const createUpdater = () => {
	const { editPost } = dispatch( STORES.wp.editor );
	const { getCurrentPost } = select( STORES.wp.core );
	const { getEditedEntityRecord } = select( "core" );

	/**
	 * Syncs the data to the WP entity record.
	 * @param {Object} data The collected data.
	 * @returns {void}
	 */
	return ( data ) => {
		const currentPost = getCurrentPost();

		if ( ! ( "meta" in currentPost ) || ! data ) {
			return;
		}

		const metadata = getEditedEntityRecord( "postType", currentPost.type, currentPost.id ).meta;
		const changedData = pickBy( data, ( value, key ) => transformMetaValue( key, value ) !== metadata[ POST_META_KEY_PREFIX + key ] );
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
	const primaryTaxonomiesGetters = getPrimaryTerms();

	const getters = reduce( META_FIELDS, ( acc, value ) => {
		acc[ value.key ] = select( STORES.editor )[ value.get ];
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
