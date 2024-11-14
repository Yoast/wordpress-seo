import { useCallback, useEffect, useRef, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { AutocompleteField, Spinner } from "@yoast/ui-library";
import { debounce } from "lodash";
import { FETCH_DELAY } from "../../shared-admin/constants";
import { fetchJson } from "../util/fetch-json";

/**
 * @type {import("../index").Taxonomy} Taxonomy
 * @type {import("../index").Term} Term
 */

/**
 * @param {string|URL} baseUrl The URL to fetch from.
 * @param {string} query The query.
 * @returns {URL} The URL with the query.
 */
const createQueryUrl = ( baseUrl, query ) => new URL( "?" + new URLSearchParams( {
	search: query,
	_fields: [ "name", "slug" ],
} ), baseUrl );

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
	const [ isPending, setIsPending ] = useState( false );
	const [ error, setError ] = useState();
	const [ query, setQuery ] = useState( "" );
	const [ terms, setTerms ] = useState( [] );
	/** @type {MutableRefObject<AbortController>} */
	const controller = useRef();

	// This needs to be wrapped including settings the state, because the debounce return messes with the timing/events.
	const handleTermQuery = useCallback( debounce( ( ...args ) => {
		fetchJson( ...args )
			.then( ( result ) => {
				setTerms( result.map( transformTerm ) );
				setError( undefined ); // eslint-disable-line no-undefined
			} )
			.catch( ( e ) => {
				// Ignore abort errors, because they are expected.
				if ( e?.name !== "AbortError" ) {
					setError( {
						variant: "error",
						message: __( "Something went wrong", "wordpress-seo" ),
					} );
				}
			} )
			.finally( () => {
				setIsPending( false );
			} );
	}, FETCH_DELAY ), [] );

	const handleChange = useCallback( ( value ) => {
		if ( value === null ) {
			// User indicated they want to clear the selection.
			setQuery( "" );
		}
		onChange( terms.find( ( { name } ) => name === value ) );
	}, [ terms ] );

	const handleQueryChange = useCallback( ( event ) => {
		setQuery( event?.target?.value?.trim()?.toLowerCase() || "" );
	}, [] );

	useEffect( () => {
		setIsPending( true );
		controller.current?.abort();
		controller.current = new AbortController();
		handleTermQuery( createQueryUrl( taxonomy.links.search, query ), {
			headers: { "Content-Type": "application/json" },
			signal: controller.current.signal,
		} );

		return () => controller.current?.abort();
	}, [ taxonomy.links.search, query, handleTermQuery ] );

	return (
		<AutocompleteField
			id={ `term--${ idSuffix }` }
			label={ taxonomy.label }
			value={ selected?.name || "" }
			selectedLabel={ selected?.label || query }
			onChange={ handleChange }
			onQueryChange={ handleQueryChange }
			placeholder={ __( "All", "wordpress-seo" ) }
			nullable={ true }
			validation={ error }
		>
			{ isPending && (
				<div className="yst-autocomplete__option">
					<Spinner />
				</div>
			) }
			{ ! isPending && terms.length === 0 && (
				<div className="yst-autocomplete__option">
					{ __( "Nothing found", "wordpress-seo" ) }
				</div>
			) }
			{ ! isPending && terms.length > 0 && terms.map( ( { name, label } ) => (
				<AutocompleteField.Option key={ name } value={ name }>
					{ label }
				</AutocompleteField.Option>
			) ) }
		</AutocompleteField>
	);
};
