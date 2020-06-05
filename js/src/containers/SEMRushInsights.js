// External dependencies.
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { StyledSection, StyledHeading, StyledSectionBase } from "@yoast/components";
import { getDirectionalStyle as getRtlStyle } from "@yoast/helpers";

const Section = styled( StyledSection )`
	max-width: 640px;
	
	&${ StyledSectionBase } {
		padding-left: 0;
		padding-right: 0;

		& ${ StyledHeading } {
			${ getRtlStyle( "padding-left", "padding-right" ) }: 20px;
			margin-left: ${ getRtlStyle( "0", "20px" ) };
		}
	}
`;

/**
 * Creates the Insights section for the Related Keyphrases Modal.
 *
 * @returns {ReactElement} More insights link Section.
 */
const InsightsSection = ( { title } ) => {
	return (
		<Section
			headingLevel={ 3 }
			headingText={ title }
			headingIconColor="#555"
		>
			Lorem ipsum
		</Section>
	);
};

InsightsSection.propTypes = {
	title: PropTypes.string,
};

InsightsSection.defaultProps = {
	title: true,
};

export default InsightsSection;
