/* External dependencies */
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import EditorModal from "../../../../containers/EditorModal";
import TwitterEditor from "../../../containers/TwitterEditor";

/**
 * The Twitter Preview Modal.
 *
 * @returns {React.Component} The Twitter Preview Modal.
 */
const TwitterPreviewModal = () => {
	return (
		<EditorModal
			title={ __( "Twitter preview", "wordpress-seo" ) }
			id="yoast-twitter-preview-modal"
			shouldCloseOnClickOutside={ false }
		>
			<TwitterEditor />
		</EditorModal>
	);
};

export default TwitterPreviewModal;
