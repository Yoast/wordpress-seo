import React from "react";
import PropTypes from "prop-types";
import uniqueId from "lodash/uniqueId";
import styled from "styled-components";
import noop from "lodash/noop";

import { YoastInputContainer, YoastInputField, YoastInputLabel } from "./YoastInput";
import { getRtlStyle } from "../../../../utils/helpers/styled-components";

const SynonymsFieldLabelContainer = styled.span`
	margin-bottom: 0.5em;
`;

const StyledYoastInputLabel = styled( YoastInputLabel )`
	display: inline-block;
	margin-bottom: 0;
	${ getRtlStyle( "margin-right: 4px", "margin-left: 4px" ) };
`;

const SynonymsInput = ( { id, label, helpLink, value, onChange, onBlur, onFocus } ) => {
	return (
		<YoastInputContainer>
			<SynonymsFieldLabelContainer>
				<StyledYoastInputLabel htmlFor={ id }>
					{ label }
				</StyledYoastInputLabel>
				{ helpLink }
			</SynonymsFieldLabelContainer>
			<YoastInputField
				type="text"
				id={ id }
				onChange={ onChange }
				onBlur={ onBlur }
				onFocus={ onFocus }
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
	onBlur: PropTypes.func,
	onFocus: PropTypes.func,
	helpLink: PropTypes.node,
};

SynonymsInput.defaultProps = {
	id: uniqueId( "synonyms-input-" ),
	label: "",
	value: "",
	onBlur: noop,
	onFocus: noop,
	helpLink: null,
};

export default SynonymsInput;
