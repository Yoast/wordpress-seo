/* External dependencies */
import { dispatch, select, subscribe } from "@wordpress/data";

/* Internal dependencies */
import { NAMESPACE } from "./index";

/**
 * Invalidate a list of terms for the given taxonomy, forcing the selector to query the terms again.
 *
 * @param {string} taxonomy Taxonomy slug.
 *
 * @returns {void}
 */
export function invalidateTerms( taxonomy ) {
	dispatch( "core/data" ).invalidateResolution(
		NAMESPACE,
		"getTerms",
		[ taxonomy ]
	);
}

/**
 * Takes a WordPress selector and returns a promise. The promise will return
 * the value of the selector as soon as it become not null.
 *
 * @param {string} namespace    The selector's namespace.
 * @param {string} selectorName  The selector's name.
 *
 * @returns {function} The promisified selector.
 */
export function promisifySelector( namespace, selectorName ) {
	const selectors = select( namespace );

	if ( ! selectors[ selectorName ] ) {
		return false;
	}

	const selector = selectors[ selectorName ];

	return ( ...args ) => {
		return new Promise( resolve => {
			let value = selector( ...args );
			if ( value ) {
				return resolve( value );
			}

			const unsubscribe = subscribe( () => {
				value = selector( ...args );

				if ( ! value ) {
					return;
				}

				unsubscribe();
				return resolve( value );
			} );
		} );
	};
}
