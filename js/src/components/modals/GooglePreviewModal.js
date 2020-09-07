/* External dependencies */
import { __ } from "@wordpress/i18n";
import SettingsModal from "./SettingsModal";

/* Internal dependencies */
import SnippetEditorWrapper from "../../containers/SnippetEditor";

/**
 * The Google Preview Modal.
 *
 * @returns {React.Component} The Google Preview Modal.
 */
const GooglePreviewModal = () => {
	return (
		<SettingsModal
			title={ __( "Google preview", "wordpress-seo" ) }
			postTypeName="post"
		>
			<SnippetEditorWrapper showCloseButton={ false } hasPaperStyle={ false } />
		</SettingsModal>
	);
};

export default GooglePreviewModal;
