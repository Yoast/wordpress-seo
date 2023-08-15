/* External dependencies */
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import EditorModal from "../../../../containers/EditorModal";
import SnippetEditorWrapper from "../../../containers/SnippetEditor";

/**
 * The Search appearance Modal.
 *
 * @returns {JSX.Element} The Search Preview Modal.
 */
const SearchPreviewModal = () => {
	return (
		<EditorModal
			title={ __( "Search appearance", "wordpress-seo" ) }
			id="yoast-search-preview-modal"
			shouldCloseOnClickOutside={ false }
		>
			<SnippetEditorWrapper showCloseButton={ false } hasPaperStyle={ false } />
		</EditorModal>
	);
};

export default SearchPreviewModal;
