import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import uniqueId from "lodash/uniqueId";
import { YoastInputContainer, YoastInputField, YoastInputLabel } from "./YoastInput";
import colors from "../../../../style-guide/colors.json";

const ExplanationText = styled.p`
	color: ${ colors.$color_grey_text };
`;

const SynonymsInput = ( { id, label, value, onChange, explanationText } ) => {
	return(
		<YoastInputContainer>
			<YoastInputLabel htmlFor={ id }>
				{ label }
			</YoastInputLabel>
			{ explanationText !== null && (
				<ExplanationText>
					{ explanationText }
				</ExplanationText>
			) }
			<YoastInputField
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
	explanationText: PropTypes.node,
};

SynonymsInput.defaultProps = {
	id: uniqueId( "synonyms-input-" ),
	label: "",
	value: "",
	explanationText: null,
};

export default SynonymsInput;
