/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const SelectContainer = styled.div`
	padding-top: 6px;
`;

/**
 * A select box for selecting a taxonomy.
 *
 * @param {Object} props The component's props.
 *
 * @returns {ReactElement} The rendered TaxonomyPicker component.
 */
const TaxonomyPicker = ( props ) => {
	const {
		value,
		id,
		terms,
		onChange,
	} = props;

	// Disable reason: UI needs to be re-designed.
	/* eslint-disable jsx-a11y/no-onchange */
	return (
		<SelectContainer>
			<select
				className="components-select-control__input"
				id={ id }
				value={ value }
				onChange={ e => {
					onChange( parseInt( e.target.value, 10 ) );
				} }
			>
				{
					terms.map( term => {
						return (
							<option
								key={ term.id }
								value={ term.id }
							>
								{ term.name }
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
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	} ) ),
	onChange: PropTypes.func.isRequired,
	id: PropTypes.string,
	value: PropTypes.string,
};

export default TaxonomyPicker;
