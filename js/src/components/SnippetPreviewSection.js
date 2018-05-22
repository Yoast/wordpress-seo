// External dependencies.
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import identity from "lodash/identity";
import get from "lodash/get";
import { StyledSection, StyledHeading, StyledSectionBase } from "yoast-components";
import { stripFullTags } from "yoastseo/js/stringProcessing/stripHTMLTags";

// Internal dependencies.
import SnippetEditor from "../containers/SnippetEditor";

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
 * Runs the legacy replaceVariables function on the data in the snippet preview.
 *
 * @param {Object} data             The snippet preview data object.
 * @param {string} data.title       The snippet preview title.
 * @param {string} data.url         The snippet preview url: baseUrl with the slug.
 * @param {string} data.description The snippet preview description.
 *
 * @returns {Object} Returns the data object in which the placeholders have been replaced.
 */
const legacyReplaceUsingPlugin = function( data ) {
	const replaceVariables = get( window, [ "YoastSEO", "wp", "replaceVarsPlugin", "replaceVariables" ], identity );

	return {
		url: data.url,
		title: stripFullTags( replaceVariables( data.title ) ),
		description: stripFullTags( replaceVariables( data.description ) ),
	};
};

/**
 * Apply replaceVariables function on the data in the snippet preview.
 *
 * @param {Object} data             The snippet preview data object.
 * @param {string} data.title       The snippet preview title.
 * @param {string} data.url         The snippet preview url: baseUrl with the slug.
 * @param {string} data.description The snippet preview description.
 *
 * @returns {Object} Returns the data object in which the placeholders have been replaced.
 */
const applyReplaceUsingPlugin = function( data ) {
	// If we do not have pluggable loaded, apply just our own replace variables.
	const pluggable = get( window, [ "YoastSEO", "app", "pluggable" ], false );
	if ( ! pluggable || ! get( window, [ "YoastSEO", "app", "pluggable", "loaded" ], false ) ) {
		return legacyReplaceUsingPlugin( data );
	}

	const applyModifications = pluggable._applyModifications.bind( pluggable );

	return  {
		url: data.url,
		title: stripFullTags( applyModifications( "data_page_title", data.title ) ),
		description: stripFullTags( applyModifications( "data_meta_desc", data.description ) ),
	};
};

/**
 * Process the snippet editor form data before it's being displayed in the snippet preview.
 *
 * @param {Object} data             The snippet preview data object.
 * @param {string} data.title       The snippet preview title.
 * @param {string} data.url         The snippet preview url: baseUrl with the slug.
 * @param {string} data.description The snippet preview description.
 *
 * @returns {Object} The snippet preview data object.
 */
const mapEditorDataToPreview = function( data ) {
	// Replace whitespaces in the url with dashes.
	data.url = data.url.replace( /\s/g, "-" );

	return applyReplaceUsingPlugin( data );
};

/**
 * Creates the Snippet Preview Section.
 *
 * @param {Object} props         The component props.
 * @param {string} props.baseUrl The base url that the preview uses for the slug.
 * @param {string} props.date    The date that can get prefixed to the meta description.
 *
 * @returns {ReactElement} Snippet Preview Section.
 */
const SnippetPreviewSection = ( { baseUrl, date } ) => {
	return <Section
		headingLevel={ 3 }
		headingText="Snippet preview"
		headingIcon="eye"
		headingIconColor="#555"
	>
		<SnippetEditor
			baseUrl={ baseUrl }
			mapDataToPreview={ mapEditorDataToPreview }
			date={ date }
			descriptionPlaceholder="Please provide a meta description by editing the snippet below."
		/>
	</Section>;
};

SnippetPreviewSection.propTypes = {
	baseUrl: PropTypes.string.isRequired,
	date: PropTypes.string,
};

SnippetPreviewSection.defaultProps = {
	date: "",
};

export default SnippetPreviewSection;
