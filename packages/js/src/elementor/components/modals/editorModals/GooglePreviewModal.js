/* External dependencies */
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import EditorModal from "../../../../containers/EditorModal";
import SnippetEditorWrapper from "../../../containers/SnippetEditor";
import React from "react";
import styled from "styled-components";
import { colors } from "@yoast/style-guide";

const SearchModalDescription = styled.legend`
	margin: 8px 0;
	padding: 0;
	color: ${ colors.$color_headings };
	font-size: 12px;
	font-weight: 300;
`;

/**
 * The Search appearance Modal.
 *
 * @returns {React.Component} The Google Preview Modal.
 */
const GooglePreviewModal = () => {
	return (
		<EditorModal
			title={ __( "Search appearance", "wordpress-seo" ) }
			id="yoast-google-preview-modal"
			shouldCloseOnClickOutside={ false }
		>
			<SearchModalDescription>{ __( "Determine how your post should look in the search results.", "wordpress-seo" ) }</SearchModalDescription>
			<SnippetEditorWrapper showCloseButton={ false } hasPaperStyle={ false } />
		</EditorModal>
	);
};

export default GooglePreviewModal;
