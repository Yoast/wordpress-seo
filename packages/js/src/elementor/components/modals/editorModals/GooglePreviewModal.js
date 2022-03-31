/* External dependencies */
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import EditorModal from "../../../../containers/EditorModal";
import SnippetEditorWrapper from "../../../containers/SnippetEditor";

/**
 * The Google Preview Modal.
 *
 * @returns {React.Component} The Google Preview Modal.
 */
const GooglePreviewModal = () => {
	return (
		<EditorModal
			title={ __( "Google preview", "wordpress-seo" ) }
			id="yoast-google-preview-modal"
			shouldCloseOnClickOutside={ false }
		>
			<SnippetEditorWrapper showCloseButton={ false } hasPaperStyle={ false } />
		</EditorModal>
	);
};

export default GooglePreviewModal;
