import React from "react";
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
 * @param {Object} props The component props.
 * @param {string} [props.type="text"] The type of the input.
 * @param {string} props.id The id of the input.
 * @param {string} [props.label=""] The label of the input.
 * @param {import("react").ReactNode} [props.helpLink=null] The help link rendered next to the label.
 *
 * @returns {ReactElement} The rendered synonyms input element.
 */
const SynonymsInput = ( {
	type = "text",
	label = "",
	helpLink = null,
	...inputProps
} ) => {
	return (
		<InputContainer>
			<SynonymsFieldLabelContainer>
				<StyledYoastInputLabel htmlFor={ inputProps.id }>
					{ label }
				</StyledYoastInputLabel>
				{ helpLink }
			</SynonymsFieldLabelContainer>
			<InputField
				type={ type }
				{ ...inputProps }
				autoComplete="off"
			/>
		</InputContainer>
	);
};

export default SynonymsInput;
