import { SelectControl } from "@wordpress/components";
import { useCallback } from "@wordpress/element";
import { unescape } from "lodash";

/**
 * A select box for selecting a taxonomy.
 *
 * @param {Object} props Component props.
 * @param {Object[]} [props.terms] The terms to choose from.
 * @param {number} props.terms[].id The term ID.
 * @param {string} props.terms[].name The term name.
 * @param {Function} props.onChange The function to call when the selected term changes.
 * @param {string} props.id The ID of the select.
 * @param {string} props.label The label for the select.
 * @param {number} props.value The selected term.
 *
 * @returns {JSX.Element} The rendered TaxonomyPicker component.
 */
const TaxonomyPicker = ( { id, value, terms = [], label, onChange } ) => {
	const handleChange = useCallback( ( newValue ) => {
		onChange( parseInt( newValue, 10 ) );
	}, [ onChange ] );

	return (
		<SelectControl
			__nextHasNoMarginBottom={ true }
			__next40pxDefaultSize={ true }
			id={ id }
			label={ label }
			value={ value }
			onChange={ handleChange }
			options={ terms.map( term => ( {
				label: unescape( term.name ),
				value: term.id,
			} ) ) }
		/>
	);
};

export default TaxonomyPicker;
