import React from "react";
import PropTypes from "prop-types";
import uniqueId from "lodash/uniqueId";
import styled from "styled-components";

import StyledSection from "../../../../forms/StyledSection/StyledSection";
import SynonymsInput from "./SynonymsInput";

const Section = styled( StyledSection )`
	display: flex;
	flex-direction: column;
`;

class SynonymsSection extends React.Component {
	/**
	 * Constructs a SynonymsSection component
	 *
	 * @param {Object} props          The props for this input field component.
	 * @param {string} props.id       The id of the SynonymsField.
	 * @param {string} props.label    The label of the SynonymsField.
	 * @param {string} props.synonyms The initial synonyms passed to the state.
	 * @param {string} props.onChange The change event handler.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );
	}

	/**
	 * Renders the SynonymsSection component.
	 *
	 * @returns {ReactElement} The rendered SynonymsSection component.
	 */
	render() {
		const { id, label, synonyms, onChange } = this.props;

		return (
			<Section
				headingText={ label }
				headingIcon={ "key" }
				headingLevel={ 3 }
			>
				<SynonymsInput
					id={ id }
					label={ label }
					synonyms={ synonyms }
					onChange={ onChange }
				/>
			</Section>
		);
	}
}

SynonymsSection.propTypes = {
	id: PropTypes.string,
	label: PropTypes.string.isRequired,
	synonyms: PropTypes.string,
	onChange: PropTypes.func,
};

SynonymsSection.defaultProps = {
	id: uniqueId( "yoast-synonyms-input-" ),
	synonyms: "",
};

export default SynonymsSection;
