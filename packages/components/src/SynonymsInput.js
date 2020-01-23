import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { InputContainer } from "./input/InputContainer";
import { InputField } from "./input/InputField";
import { InputLabel } from "./input/InputLabel";
import { getDirectionalStyle } from "@yoast/helpers";

const SynonymsFieldLabelContainer = styled.span`
	margin-bottom: 0.5em;
`;

const StyledYoastInputLabel = styled( InputLabel )`
	display: inline-block;
	margin-bottom: 0;
	${ getDirectionalStyle( "margin-right: 4px", "margin-left: 4px" ) };
`;

/**
 * Renders the input for synonyms.
 *
 * All props that are not specific to this element are passed to the input element.
 *
 * @param {object} props The component props.
 *
 * @returns {ReactElement} The rendered synonyms input element.
 */
const SynonymsInput = ( props ) => {
	const {
		label,
		helpLink,
		...inputProps
	} = props;

	return (
		<InputContainer>
			<SynonymsFieldLabelContainer>
				<StyledYoastInputLabel htmlFor={ inputProps.id }>
					{ label }
				</StyledYoastInputLabel>
				{ helpLink }
			</SynonymsFieldLabelContainer>
			<InputField
				{ ...inputProps }
				autoComplete="off"
			/>
		</InputContainer>
	);
};

SynonymsInput.propTypes = {
	type: PropTypes.string,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	helpLink: PropTypes.node,
};

SynonymsInput.defaultProps = {
	type: "text",
	label: "",
	helpLink: null,
};

export default SynonymsInput;
