import React from "react";
import PropTypes from "prop-types";
import uniqueId from "lodash/uniqueId";

import { YoastInputContainer, YoastInputField, YoastInputLabel } from "./YoastInput";
import HelpText from "../../Shared/components/HelpText";

const SynonymsInput = ( { id, label, value, onChange, explanationText } ) => {
	return(
		<YoastInputContainer>
			<YoastInputLabel htmlFor={ id }>
				{ label }
			</YoastInputLabel>
			{ explanationText !== null && (
				<HelpText>
					{ explanationText }
				</HelpText>
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
