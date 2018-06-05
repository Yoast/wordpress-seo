// External dependencies.
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { StyledSection, StyledHeading, StyledSectionBase } from "yoast-components";

const Section = styled( StyledSection )`
	margin-bottom: 2em;
	max-width: 640px;
	
	&${ StyledSectionBase } {
		padding: 0 0 16px;

		& ${ StyledHeading } {
			padding-left: 20px;
			font-size: 14.4px;
		}
	}
`;

/**
 * Creates the Snippet Preview Section.
 *
 * @param {Object} props                  The component props.
 * @param {ReactComponent} props.children The component's children
 *
 * @returns {ReactElement} Snippet Preview Section.
 */
const SnippetPreviewSection = ( { children } ) => {
	return <Section
		headingLevel={ 3 }
		headingText="Snippet preview"
		headingIcon="eye"
		headingIconColor="#555" >
		{ children }
	</Section>;
};

SnippetPreviewSection.propTypes = {
	children: PropTypes.element,
};

export default SnippetPreviewSection;
