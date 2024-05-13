/* eslint-disable complexity */
import { select, subscribe } from "@wordpress/data";
import { debounce, forEach, reduce } from "lodash";
import { createWatcher, createCollectorFromObject } from "../create-watcher";
import { STORES, HIDDEN_INPUT_ID_PREFIX, SYNC_TIME, META_FIELDS } from "../../shared-admin/constants";
import { getPrimaryTerms } from "./primaryTaxonomiesFieldsStore";
import { transformMetaValue } from "./transform-meta-value";

/**
 * Creates an updater.
 * @returns {function} The updater.
 */
export const createUpdater = () => {
	const isTerm = select( STORES.editor ).getIsTerm();
	const prefix = isTerm ? HIDDEN_INPUT_ID_PREFIX.term : HIDDEN_INPUT_ID_PREFIX.post;

	/**
	 * Syncs the data to the WP entity record.
	 * @param {Object} data The collected data.
	 * @returns {void}
	 */
	return ( data ) => {
		forEach( data, ( value, key ) => {
			const field = document.getElementById( prefix + key );
			if ( ! field ) {
				return;
			}
			const transformedValue = transformMetaValue( key, value );
			if ( field && field.value !== transformedValue ) {
				field.value = transformedValue;
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
			// Slug is added for elementor editor, used only when hidden field for slug exist.
			slug: select( STORES.editor ).getSnippetEditorSlug,
		} ),
		createUpdater()
	), SYNC_TIME.wait, { maxWait: SYNC_TIME.max } ), STORES.editor );
};
