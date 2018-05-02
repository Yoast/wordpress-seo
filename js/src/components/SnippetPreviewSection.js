import React from "react";
import styled from "styled-components";
import { StyledSection, StyledHeading, StyledSectionBase } from "yoast-components";
import SnippetEditor from "../containers/SnippetEditor";
import PropTypes from "prop-types";

const Section = styled( StyledSection )`
	margin-bottom: 2em;
	max-width: 640px;
	
	&${ StyledSectionBase } {
		padding: 0 0 16px;

		& ${ StyledHeading } {
			padding-left: 20px;
		}
	}
`;

/**
 * Creates the Snippet Preview Section.
 *
 * @param {Object} props The component props.
 *
 * @returns {ReactElement} Snippet Preview Section.
 */
const SnippetPreviewSection = ( { baseUrl, date } ) => {
	return <Section
		headingLevel={ 3 }
		headingText="React snippet preview"
		headingIcon="eye"
		headingIconColor="#555"
	>
		<SnippetEditor
			baseUrl={ baseUrl }
			date={ date }
		/>
	</Section>;
};

SnippetPreviewSection.propTypes = {
	baseUrl: PropTypes.string.isRequired,
	date: PropTypes.string,
};

SnippetPreviewSection.propTypes = {
	date: "",
};

export default SnippetPreviewSection;
