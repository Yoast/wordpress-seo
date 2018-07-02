import React from "react";
import PropTypes from "prop-types";
import uniqueId from "lodash/uniqueId";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";

import StyledSection from "../../../../forms/StyledSection/StyledSection";
import SynonymsInput from "./SynonymsInput";
import HelpText from "../../Shared/components/HelpText";
import { makeOutboundLink } from "../../../../utils/makeOutboundLink";

const HelpTextLink = makeOutboundLink();

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

		const helpText = [
			__( "Enter synonyms for your focus keyword. Separate individual synonyms with commas. ", "yoast-components" ),
			<HelpTextLink key="1" href="https://yoa.st/kd1">
				{ __( "Learn more about keyword synonyms.", "yoast-components" ) }
			</HelpTextLink>,
		];

		return (
			<Section
				headingText={ label }
				headingIcon={ "key" }
				headingLevel={ 3 }
				className={ "yoast-section" }
			>
				<HelpText
					text={ helpText }
				/>
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
	synonyms: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

SynonymsSection.defaultProps = {
	id: uniqueId( "yoast-synonyms-input-" ),
};

export default SynonymsSection;
