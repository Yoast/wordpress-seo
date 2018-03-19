import React from "react";
import styled from "styled-components";
import { SnippetPreview, StyledSection, StyledHeading } from "yoast-components";
import { injectIntl, defineMessages } from "react-intl";

const messages = defineMessages( {
	snippetPreview: {
		id: "snippetPreview.snippetPreview",
		defaultMessage: "Snippet preview",
	},
} );

const Section = styled( StyledSection )`
	margin-bottom: 2em;
	max-width: 640px;
	padding: 0 0 16px;

	& ${ StyledHeading } {
		padding-left: 20px;
	}
`;

/**
 * Creates the Snippet Preview Section.
 *
 * @param {Object} props The component props.
 *
 * @returns {ReactElement} Snippet Preview Section.
 */
const SnippetPreviewSection = ( props ) => {
	const { formatMessage } = props.intl;

	return <Section
		headingLevel={ 3 }
		headingText={ formatMessage( messages.snippetPreview ) }
		headingIcon="eye"
		headingIconColor="#555"
	>
		<SnippetPreview
			title="Title"
			url="Url"
			description="Description"
			onClick={ () => {} }
		/>
	</Section>;
};

export default injectIntl( SnippetPreviewSection );
