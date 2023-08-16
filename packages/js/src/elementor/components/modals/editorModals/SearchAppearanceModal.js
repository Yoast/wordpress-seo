/* External dependencies */
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import EditorModal from "../../../../containers/EditorModal";
import SnippetEditorWrapper from "../../../containers/SnippetEditor";

/**
 * The Search Appearance Modal.
 *
 * @returns {JSX.Element} The Search Appearance Modal.
 */
const SearchAppearanceModal = () => {
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

export default SearchAppearanceModal;
