/* External dependencies */
import { __ } from "@wordpress/i18n";
import SettingsModal from "./SettingsModal";

/* Internal dependencies */
import FacebookEditor from "../../containers/FacebookEditor";

/**
 * The Facebook Preview Modal.
 *
 * @returns {React.Component} The Facebook Preview Modal.
 */
const FacebookPreviewModal = () => {
	return (
		<SettingsModal
			title={ __( "Facebook preview", "wordpress-seo" ) }
			postTypeName="post"
		>
			<FacebookEditor location="modal" />
		</SettingsModal>
	);
};

export default FacebookPreviewModal;
