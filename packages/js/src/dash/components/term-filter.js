import { useCallback, useEffect, useRef, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { AutocompleteField } from "@yoast/ui-library";
import { debounce } from "lodash";
import PropTypes from "prop-types";
import { FETCH_DELAY } from "../../shared-admin/constants";

/**
 * @typedef {import("../index").Taxonomy} Taxonomy
 * @typedef {import("../index").Term} Term
 */

/**
 * @param {string} url The URL to fetch from.
 * @param {string} query The query to search for.
 * @param {AbortSignal} signal The signal to abort the request.
 * @returns {Promise<any|Error>} The promise of terms, or an error.
 */
const searchTerms = async( { url, query, signal } ) => {
	try {
		const urlInstance = new URL( "?" + new URLSearchParams( {
			search: query,
			_fields: [ "name", "slug" ],
		} ), url );
		const response = await fetch( urlInstance, {
			headers: {
				"Content-Type": "application/json",
			},
			signal,
		} );

		if ( ! response.ok ) {
			throw new Error( "Failed to search terms" );
		}
		return response.json();
	} catch ( e ) {
		throw e;
	}
};

/**
 * @param {{name: string, slug: string}} term The term from the response.
 * @returns {Term} The transformed term.
 */
const transformTerm = ( term ) => ( { name: term.slug, label: term.name } );

/**
 * @param {string} idSuffix The suffix for the ID.
 * @param {Taxonomy} taxonomy The taxonomy.
 * @param {Term?} selected The selected term.
 * @param {function(ContentType?)} onChange The callback. Expects it changes the `selected` prop.
 * @returns {JSX.Element} The element.
 */
export const TermFilter = ( { idSuffix, taxonomy, selected, onChange } ) => {
	const [ error, setError ] = useState( null );
	const [ query, setQuery ] = useState( "" );
	const [ terms, setTerms ] = useState( [] );
	/** @type {MutableRefObject<AbortController>} */
	const controller = useRef();

	useEffect( () => {
		controller.current?.abort();
		controller.current = new AbortController();

		searchTerms( { url: taxonomy.links.search, query, signal: controller.current.signal } )
			.then( ( result ) => {
				setTerms( result.map( transformTerm ) );
				setError( null );
			} )
			.catch( ( e ) => {
				// Ignore abort errors, because they are expected.
				if ( e?.name !== "AbortError" ) {
					setError( {
						variant: "error",
						message: __( "Something went wrong", "wordpress-seo" ),
					} );
				}
			} );

		return () => {
			controller.current?.abort();
		};
	}, [ taxonomy.links.search, query ] );

	const handleChange = useCallback( ( value ) => {
		onChange( terms.find( ( { name } ) => name === value ) );
	}, [ terms ] );
	const handleQueryChange = useCallback( debounce( ( event ) => {
		setQuery( event?.target?.value?.trim()?.toLowerCase() || "" );
	}, FETCH_DELAY ), [] );

	return (
		<AutocompleteField
			id={ `term--${ idSuffix }` }
			label={ taxonomy.label }
			value={ selected?.name }
			selectedLabel={ selected?.label || "" }
			onChange={ handleChange }
			onQueryChange={ handleQueryChange }
			placeholder={ __( "All", "wordpress-seo" ) }
			nullable={ true }
			validation={ error }
		>
			{ terms
				? terms.map( ( { name, label } ) => (
					<AutocompleteField.Option key={ name } value={ name }>
						{ label }
					</AutocompleteField.Option>
				) )
				: __( "None found", "wordpress-seo" )
			}
		</AutocompleteField>
	);
};

TermFilter.propTypes = {
	idSuffix: PropTypes.string.isRequired,
	taxonomy: PropTypes.shape( {
		label: PropTypes.string.isRequired,
		links: PropTypes.shape( {
			search: PropTypes.string.isRequired,
		} ).isRequired,
	} ).isRequired,
	selected: PropTypes.shape( {
		name: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
	} ),
	onChange: PropTypes.func.isRequired,
};
