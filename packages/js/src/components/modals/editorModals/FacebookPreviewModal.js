/* External dependencies */
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import EditorModal from "../../../containers/EditorModal";
import FacebookEditor from "../../../containers/FacebookEditor";
import React from "react";
import styled from "styled-components";
import { colors } from "@yoast/style-guide";

const ModalDescription = styled.legend`
	margin: 8px 0;
	padding: 0;
	color: ${ colors.$color_headings };
	font-size: 12px;
	font-weight: 300;
`;

/**
 * The Facebook Preview Modal.
 *
 * @returns {React.Component} The Facebook Preview Modal.
 */
const FacebookPreviewModal = () => {
	return (
		<EditorModal
			title={ __( "Social appearance", "wordpress-seo" ) }
			id="yoast-facebook-preview-modal"
		>
			<ModalDescription>{ __( "Determine how your post should look on social media like Facebook, Twitter, Instagram, WhatsApp, " +
				"Threads, LinkedIn, Slack, and more.", "wordpress-seo" ) }</ModalDescription>
			<FacebookEditor />
		</EditorModal>
	);
};

export default FacebookPreviewModal;
