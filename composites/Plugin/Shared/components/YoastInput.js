// External dependencies.
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import uniqueId from "lodash/uniqueId";

// Internal dependencies.
import colors from "../../../../style-guide/colors.json";

const YoastInputLabel = styled.label`
	font-size: 1em;
	font-weight: bold;
	margin-bottom: 0.5em;
	display: block;
`;

const YoastInputField = styled.input`
	border: 3px solid ${ colors.$color_input_border };
	padding: 0.75em;
	font-size: 1em;
`;

const YoastInput = ( { id, label, showLabel, value, onChange } ) => {
	return(
		<React.Fragment>
			{ showLabel && label !== "" &&
				<YoastInputLabel htmlFor={ id }>
					{ label }
				</YoastInputLabel> }
			<YoastInputField
				aria-label={ showLabel ? null : label }
				type="text"
				id={ id }
				onChange={ onChange }
				value={ value }
			/>
		</React.Fragment>
	);
};

YoastInput.propTypes = {
	id: PropTypes.string,
	label: PropTypes.string,
	showLabel: PropTypes.bool,
	value: PropTypes.string,
	onChange: PropTypes.func.isRequired,
};

YoastInput.defaultProps = {
	id: uniqueId( "yoast-input-" ),
	showLabel: true,
	label: "",
	value: "",
};

export default YoastInput;
