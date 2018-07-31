import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import uniqueId from "lodash/uniqueId";
import { YoastInputContainer, YoastInputField, YoastInputLabel } from "./YoastInput";

const ExplanationText = styled.p`
	font-size: .8em;
`;

const SynonymsInput = ( { id, label, value, onChange, explanationText } ) => {
	return(
		<YoastInputContainer>
			<YoastInputLabel htmlFor={ id }>
				{ label }
			</YoastInputLabel>
			<ExplanationText>
				{ explanationText }
			</ExplanationText>
			<YoastInputField
				aria-label={ label }
				type="text"
				id={ id }
				onChange={ onChange }
				value={ value }
			/>
		</YoastInputContainer>
	);
};

SynonymsInput.propTypes = {
	id: PropTypes.string,
	label: PropTypes.string,
	value: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	explanationText: PropTypes.string,
};

SynonymsInput.defaultProps = {
	id: uniqueId( "yoast-input-" ),
	label: "",
	value: "",
	explanationText: "",
};

export default SynonymsInput;
