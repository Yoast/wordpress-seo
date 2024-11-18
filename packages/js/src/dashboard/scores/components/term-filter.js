import { useCallback, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { AutocompleteField, Spinner } from "@yoast/ui-library";
import { useFetch } from "../../hooks/use-fetch";

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
 * @param {function(Term?)} onChange The callback. Expects it changes the `selected` prop.
 * @returns {JSX.Element} The element.
 */
export const TermFilter = ( { idSuffix, taxonomy, selected, onChange } ) => {
	const [ query, setQuery ] = useState( "" );
	const { data: terms = [], error, isPending } = useFetch( {
		dependencies: [ taxonomy.links.search, query ],
		url: createQueryUrl( taxonomy.links.search, query ),
		options: { headers: { "Content-Type": "application/json" } },
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
