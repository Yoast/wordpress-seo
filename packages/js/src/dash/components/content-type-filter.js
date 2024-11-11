import { useCallback, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { AutocompleteField } from "@yoast/ui-library";
import PropTypes from "prop-types";

/**
 * @typedef {import("./dashboard").ContentType} ContentType
 */

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
			selectedLabel={ selected?.label || "" }
			onChange={ handleChange }
			onQueryChange={ handleQueryChange }
		>
			{ filtered.map( ( { name, label } ) => (
				<AutocompleteField.Option key={ name } value={ name }>
					{ label }
				</AutocompleteField.Option>
			) ) }
		</AutocompleteField>
	);
};

ContentTypeFilter.propTypes = {
	idSuffix: PropTypes.string.isRequired,
	contentTypes: PropTypes.arrayOf(
		PropTypes.shape( {
			name: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		} )
	).isRequired,
	selected: PropTypes.shape( {
		name: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
	} ),
	onChange: PropTypes.func.isRequired,
};
