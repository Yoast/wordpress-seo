import { useCallback, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { AutocompleteField, Spinner } from "@yoast/ui-library";
import { unescape } from "lodash";
import { useFetch } from "../../fetch/use-fetch";

/**
 * @type {import("../index").Taxonomy} Taxonomy
 * @type {import("../index").Term} Term
 */

/**
 * @param {string|URL} endpoint The URL to fetch from.
 * @param {string} query The query.
 * @returns {URL} The URL to query for the terms.
 */
const createQueryUrl = ( endpoint, query ) => {
	const url = new URL( endpoint );

	url.searchParams.set( "search", query );
	url.searchParams.set( "_fields", [ "id", "name" ] );

	return url;
};

/**
 * @param {{id: number, name: string}} term The term from the response.
 * @returns {Term} The transformed term for internal usage.
 */
const transformTerm = ( term ) => ( { name: String( term.id ), label: unescape( term.name ) } );

/**
 * Renders either a list of terms or a message that nothing was found.
 * @param {Term[]} terms The terms.
 * @returns {JSX.Element} The element.
 */
const Content = ( { terms } ) => terms.length === 0
	? (
		<div className="yst-autocomplete__option">
			{ __( "Nothing found", "wordpress-seo" ) }
		</div>
	)
	: terms.map( ( { name, label } ) => (
		<AutocompleteField.Option key={ name } value={ name }>
			{ label }
		</AutocompleteField.Option>
	) )
;

/**
 * @param {string} idSuffix The suffix for the ID.
 * @param {Taxonomy} taxonomy The taxonomy.
 * @param {Term?} selected The selected term.
 * @param {function(Term?)} onChange The callback. Expects it changes the `selected` prop.
 * @returns {JSX.Element} The element.
 */
export const TermFilter = ( { idSuffix, taxonomy, selected, onChange } ) => {
	const [ query, setQuery ] = useState( "" );
	const { data: terms = [], error, isPending } = useFetch( {
		dependencies: [ taxonomy.links.search, query ],
		url: createQueryUrl( taxonomy.links.search, query ),
		options: {
			headers: {
				"Content-Type": "application/json",
			},
		},
		prepareData: ( result ) => result.map( transformTerm ),
	} );

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
			clearButtonScreenReaderText={ __( "Clear filter", "wordpress-seo" ) }
			validation={ error && {
				variant: "error",
				message: __( "Something went wrong.", "wordpress-seo" ),
			} }
		>
			{ isPending && (
				<div className="yst-autocomplete__option">
					<Spinner />
				</div>
			) }
			{ ! isPending && <Content terms={ terms } /> }
		</AutocompleteField>
	);
};
