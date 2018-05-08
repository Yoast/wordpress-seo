// External dependencies.
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { StyledSection, StyledHeading, StyledSectionBase } from "yoast-components";

// Internal dependencies.
import SnippetEditor from "../containers/SnippetEditor";

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
 * @param {Object} data The snippet preview data object.
 * @param {string} data.title The snippet preview title.
 * @param {string} data.url The snippet preview url: baseUrl with the slug.
 * @param {string} data.description The snippet preview description.
 *
 * @returns {Object} The snippet preview data object.
 */
const mapEditorDataToPreview = function( data ) {
	// Replace whitespaces in the url with dashes.
	data.url = data.url.replace( /\s/g, "-" );

	return data;
};

/**
 * Creates the Snippet Preview Section.
 *
 * @param {Object} props           The component props.
 * @param {string} props.baseUrl   The base url that the preview uses for the slug.
 * @param {string} props.date      The date that can get prefixed to the meta description.
 * @param {Object} props.templates Can contain templates for the title and/or the description.
 *                                 Which will then be used if they are empty.
 *
 * @returns {ReactElement} Snippet Preview Section.
 */
const SnippetPreviewSection = ( { baseUrl, date, templates } ) => {
	return <Section
		headingLevel={ 3 }
		headingText="React snippet preview"
		headingIcon="eye"
		headingIconColor="#555"
	>
		<SnippetEditor
			baseUrl={ baseUrl }
			mapDataToPreview={ mapEditorDataToPreview }
			date={ date }
			templates={ templates }
		/>
	</Section>;
};

SnippetPreviewSection.propTypes = {
	baseUrl: PropTypes.string.isRequired,
	date: PropTypes.string,
	templates: PropTypes.object,
};

SnippetPreviewSection.defaultProps = {
	date: "",
};

export default SnippetPreviewSection;
