import React from "react";
import PropTypes from "prop-types";
import uniqueId from "lodash/uniqueId";
import styled from "styled-components";

import { YoastInputContainer, YoastInputField, YoastInputLabel } from "./YoastInput";
import { getRtlStyle } from "../utils/helpers/styled-components";

const SynonymsFieldLabelContainer = styled.span`
	margin-bottom: 0.5em;
`;

const StyledYoastInputLabel = styled( YoastInputLabel )`
	display: inline-block;
	margin-bottom: 0;
	${ getRtlStyle( "margin-right: 4px", "margin-left: 4px" ) };
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
		<YoastInputContainer>
			<SynonymsFieldLabelContainer>
				<StyledYoastInputLabel htmlFor={ inputProps.id }>
					{ label }
				</StyledYoastInputLabel>
				{ helpLink }
			</SynonymsFieldLabelContainer>
			<YoastInputField
				{ ...inputProps }
				autoComplete="off"
			/>
		</YoastInputContainer>
	);
};

SynonymsInput.propTypes = {
	type: PropTypes.string,
	id: PropTypes.string,
	label: PropTypes.string,
	helpLink: PropTypes.node,
};

SynonymsInput.defaultProps = {
	type: "text",
	id: uniqueId( "synonyms-input-" ),
	label: "",
	helpLink: null,
};

export default SynonymsInput;
