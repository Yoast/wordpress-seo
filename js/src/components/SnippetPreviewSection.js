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
 * Process the snippet editor form data before it's being displayed in the snippet preview.
 *
 * Replace whitespaces in the url with dashes.
 *
 * @param {Object} data The snippet preview data object.
 * @param {string} data.title The snippet preview title.
 * @param {string} data.url The snippet preview url: baseUrl with the slug.
 * @param {string} data.description The snippet preview description.
 *
 * @returns {Object} The snippet preview data object.
 */
const mapEditorDataToPreview = function( data ) {
	data.url = data.url.replace( /\s/g, "-" );

	return data;
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
			mapDataToPreview={ mapEditorDataToPreview }
		/>
	</Section>;
};

SnippetPreviewSection.propTypes = {
	baseUrl: PropTypes.string.isRequired,
};

export default SnippetPreviewSection;
