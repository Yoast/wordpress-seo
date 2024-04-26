/* eslint-disable complexity */
import { select, subscribe } from "@wordpress/data";
import { debounce, forEach, reduce } from "lodash";
import { createWatcher, createCollectorFromObject } from "../../helpers/create-watcher";
import { STORES, HIDDEN_INPUT_ID_PREFIX, SYNC_TIME, META_FIELDS } from "../../shared-admin/constants";
import { getPrimaryTerms } from "./primaryTaxonomiesFieldsStore";
import { transformMetaValue } from "./transform-meta-value";

/**
 * Creates an updater.
 * @returns {function} The updater.
 */
export const createUpdater = () => {
	/**
	 * Syncs the data to the WP entity record.
	 * @param {Object} data The collected data.
	 * @returns {void}
	 */
	return ( data ) => {
		const isPost = select( STORES.editor ).getIsPost();
		const prefix = isPost ? HIDDEN_INPUT_ID_PREFIX.post : HIDDEN_INPUT_ID_PREFIX.term;

		forEach( data, ( value, key ) => {
			const field = document.getElementById( prefix + key );
			const tranformedValue = transformMetaValue( key, value );
			if ( field && field.value !== tranformedValue ) {
				console.log( field.value, value, key, tranformedValue )
				field.value = tranformedValue;
			}
		} );
	};
};

/**
 * Initializes the sync: from Yoast editor store to the hidden fields.
 * @returns {function} The un-subscriber.
 */
export const hiddenFieldsSync = () => {
	const primaryTaxonomiesGetters = getPrimaryTerms();

	const getters = reduce( META_FIELDS, ( acc, value ) => {
		// check if value.get is a function in select( STORES.editor ) store 
		if ( typeof select( STORES.editor )[ value.get ] === "function" ) {
			acc[ value.key ] = select( STORES.editor )[ value.get ];
		}
		return acc;
	}, {} );

	return subscribe( debounce( createWatcher(
		createCollectorFromObject( {
			...getters,
			...primaryTaxonomiesGetters,
			// Slug is added for elementor editor.
			slug: select( STORES.editor ).getSnippetEditorSlug
		} ),
		createUpdater()
	), SYNC_TIME.wait, { maxWait: SYNC_TIME.max } ), STORES.editor );
};
