/* External dependencies */
import { __ } from "@wordpress/i18n";

/* Internal dependencies */
import EditorModal from "../../../../containers/EditorModal";
import FacebookEditor from "../../../containers/FacebookEditor";

/**
 * The Facebook Preview Modal.
 *
 * @returns {React.Component} The Facebook Preview Modal.
 */
const FacebookPreviewModal = () => {
	return (
		<EditorModal
			title={ __( "Facebook preview", "wordpress-seo" ) }
			id="yoast-facebook-preview-modal"
			shouldCloseOnClickOutside={ false }
		>
			<FacebookEditor />
		</EditorModal>
	);
};

export default FacebookPreviewModal;
