/* External dependencies */
import PropTypes from "prop-types";
import styled from "styled-components";
import { unescape } from "lodash";
import { useCallback } from "@wordpress/element";

const SelectContainer = styled.div`
	padding-top: 6px;
`;

/**
 * A select box for selecting a taxonomy.
 *
 * @param {Object} props The component's props.
 *
 * @returns {wp.Element} The rendered TaxonomyPicker component.
 */
const TaxonomyPicker = ( props ) => {
	const {
		value,
		id,
		terms,
		onChange,
	} = props;

	const handleChange = useCallback( ( e ) => {
		onChange( parseInt( e.target.value, 10 ) );
	}, [ onChange ] );

	// Disable reason: UI needs to be re-designed.
	/* eslint-disable jsx-a11y/no-onchange */
	return (
		<SelectContainer>
			<select
				className="components-select-control__input"
				id={ id }
				value={ value }
				onChange={ handleChange }
			>
				{
					terms.map( term => {
						return (
							<option
								key={ term.id }
								value={ term.id }
							>
								{ unescape( term.name ) }
							</option>
						);
					} )
				}
			</select>
		</SelectContainer>
	);
	/* eslint-enable jsx-a11y/no-onchange */
};

TaxonomyPicker.propTypes = {
	terms: PropTypes.arrayOf( PropTypes.shape( {
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
	} ) ),
	onChange: PropTypes.func.isRequired,
	id: PropTypes.string,
	value: PropTypes.number,
};

export default TaxonomyPicker;
