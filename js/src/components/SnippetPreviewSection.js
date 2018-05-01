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
 * Function to map the editor data to data for the preview.
 *
 * @param {Object} mappedData The default mappedData object.
 * @param {string} mappedData.title The processed title.
 * @param {string} mappedData.url The baseUrl with the slug.
 * @param {string} mappedData.description The processed description.
 *
 * @returns {Object} The new mappedData object.
 */
const mapDataToPreview = function( mappedData ) {
	mappedData.url = mappedData.url.replace( /\s/g, "-" );

	return mappedData;
};

/**
 * Creates the Snippet Preview Section.
 *
 * @param {Object} props The component props.
 *
 * @returns {ReactElement} Snippet Preview Section.
 */
const SnippetPreviewSection = ( { baseUrl } ) => {
	return <Section
		headingLevel={ 3 }
		headingText="React snippet preview"
		headingIcon="eye"
		headingIconColor="#555"
	>
		<SnippetEditor
			baseUrl={ baseUrl }
			mapDataToPreview={ mapDataToPreview }
		/>
	</Section>;
};

SnippetPreviewSection.propTypes = {
	baseUrl: PropTypes.string.isRequired,
};

export default SnippetPreviewSection;
