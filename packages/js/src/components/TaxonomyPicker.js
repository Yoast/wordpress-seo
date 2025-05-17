import { SelectControl } from "@wordpress/components";
import { useCallback } from "@wordpress/element";
import { unescape } from "lodash";
import PropTypes from "prop-types";

/**
 * A select box for selecting a taxonomy.
 *
 * @param {string} id The ID of the select.
 * @param {number} value The selected term.
 * @param {{id: number, name: string}[]} terms The terms to choose from.
 * @param {string} label The label for the select.
 * @param {Function} onChange The function to call when the selected term changes.
 *
 * @returns {JSX.Element} The rendered TaxonomyPicker component.
 */
const TaxonomyPicker = ( { id, value, terms, label, onChange } ) => {
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

TaxonomyPicker.propTypes = {
	terms: PropTypes.arrayOf( PropTypes.shape( {
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
	} ) ),
	onChange: PropTypes.func.isRequired,
	id: PropTypes.string,
	label: PropTypes.string,
	value: PropTypes.number,
};

export default TaxonomyPicker;
