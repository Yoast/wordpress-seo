import { useCallback, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { AutocompleteField } from "@yoast/ui-library";
import { replace, unescape } from "lodash";

/**
 * @type {import("../index").ContentType} ContentType
 */


/**
 * The regex to find a single quote.
 * @type {RegExp}
 */
const findSingleQuoteRegex =  new RegExp( "&#0?39;", "g" );

/**
 * Decodes the label to remove HTML entities
 * @param {string} encodedString The string to decode.
 * @returns {string} The decoded string.
 */
function decodeString( encodedString ) {
	return replace( unescape( encodedString ), findSingleQuoteRegex, "'" );
}

/**
 * @param {string} idSuffix The suffix for the ID.
 * @param {ContentType[]} contentTypes The content types.
 * @param {ContentType?} selected The selected content type.
 * @param {function(ContentType?)} onChange The callback. Expects it changes the `selected` prop.
 * @returns {JSX.Element} The element.
 */
export const ContentTypeFilter = ( { idSuffix, contentTypes, selected, onChange } ) => {
	const [ filtered, setFiltered ] = useState( () => contentTypes );

	const handleChange = useCallback( ( value ) => {
		onChange( contentTypes.find( ( { name } ) => name === value ) );
	}, [ contentTypes ] );
	const handleQueryChange = useCallback( ( event ) => {
		const query = event.target.value.trim().toLowerCase();
		setFiltered( query
			? contentTypes.filter( ( { name, label } ) => label.toLowerCase().includes( query ) || name.toLowerCase().includes( query ) )
			: contentTypes );
	}, [ contentTypes ] );

	return (
		<AutocompleteField
			id={ `content-type--${ idSuffix }` }
			label={ __( "Content type", "wordpress-seo" ) }
			value={ selected?.name }
			selectedLabel={ decodeString( selected?.label ) || "" }
			onChange={ handleChange }
			onQueryChange={ handleQueryChange }
		>
			{ filtered.map( ( { name, label } ) => {
				const decodedLabel = decodeString( label );
				return <AutocompleteField.Option key={ name } value={ name }>
					{ decodedLabel }
				</AutocompleteField.Option>;
			} ) }
		</AutocompleteField>
	);
};
