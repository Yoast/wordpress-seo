import React from "react";
import styled from "styled-components";
import { StyledSection, StyledHeading, StyledSectionBase } from "yoast-components";
import SnippetEditor from "../containers/SnippetEditor";
import {injectIntl, defineMessages, intlShape} from "react-intl";
import PropTypes from "prop-types";

const messages = defineMessages( {
	snippetPreview: {
		id: "snippetPreview.snippetPreview",
		defaultMessage: "React snippet preview",
	},
} );

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
const SnippetPreviewSection = ( { intl, baseUrl } ) => {
	const { formatMessage } = intl;

	return <Section
		headingLevel={ 3 }
		headingText={ formatMessage( messages.snippetPreview ) }
		headingIcon="eye"
		headingIconColor="#555"
	>
		<SnippetEditor
			baseUrl={ baseUrl }
		/>
	</Section>;
};

SnippetPreviewSection.propTypes = {
	baseUrl: PropTypes.string.isRequired,
	intl: intlShape,
};

export default injectIntl( SnippetPreviewSection );
